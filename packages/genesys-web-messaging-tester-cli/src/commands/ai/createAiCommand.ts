import { Command } from 'commander';
import { accessSync, readFileSync } from 'fs';
import {
  Conversation,
  SessionConfig,
  Transcriber,
  WebMessengerGuestSession,
  WebMessengerSession,
} from '@ovotech/genesys-web-messaging-tester';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { validateOpenAiEnvVariables } from './validateOpenAIEnvVariables';
import { Ui } from './ui';
import { validateSessionConfig } from './validateSessionConfig';
import { backOff } from 'exponential-backoff';
import chalk from 'chalk';
import { shouldEndConversation } from './shouldEndConversation';
import { AxiosError } from './AxiosError';

/**
 * This value can be between 0 and 1 and controls the randomness of ChatGPT's completions.
 * 0 = Responses will be deterministic and repetitive
 *     ChatGPT will favour words (tokens) that have the highest probability of coming next in the text it is constructing
 * 1 = Responses will include more variety and creativity
 *     ChatGPT will consider using words (tokens) that are less likely to come next in the text it is constructing
 *
 * @see https://platform.openai.com/docs/quickstart/adjust-your-settings
 */
const temperature = 0.6;
const chatGptPrompt = `I want you to play the role of a customer who has just bought a product but have no interest in
providing feedback. Now start the conversation with the company by saying 'bye bye!'.`;

export interface AiCommandDependencies {
  command?: Command;
  ui?: Ui;
  openAiApiFactory?: (config: Configuration) => OpenAIApi;
  outputConsole?: Console;
  webMessengerSessionFactory?: (sessionConfig: SessionConfig) => WebMessengerSession;
  conversationFactory?: (session: WebMessengerSession) => Conversation;
  fsReadFileSync?: typeof readFileSync;
  fsAccessSync?: typeof accessSync;
}

export function createAiCommand({
  command = new Command(),
  ui = new Ui(),
  openAiApiFactory = (config) => new OpenAIApi(config),
  webMessengerSessionFactory = (config) => new WebMessengerGuestSession(config, { IsTest: 'true' }),
  conversationFactory = (session) => new Conversation(session),
}: AiCommandDependencies = {}): Command {
  return command
    .command('ai')
    .description('Test a WM Deployment against Generative AI')
    .option('-id, --deployment-id <deploymentId>', "Web Messenger Deployment's ID")
    .option(
      '-r, --region <region>',
      'Region of Genesys instance that hosts the Web Messenger Deployment',
    )
    .option('-o, --origin <origin>', 'Origin domain used for restricting Web Messenger Deployment')
    .action(async (options: { deploymentId?: string; region?: string; origin?: string }) => {
      const outputConfig = command.configureOutput();
      if (!outputConfig.writeOut || !outputConfig.writeErr) {
        throw new Error('No writeOut');
      }

      const sessionValidationResult = validateSessionConfig(options);
      if (!sessionValidationResult.validSessionConfig) {
        outputConfig.writeErr(
          ui?.validatingOpenAiEnvValidationFailed(sessionValidationResult.error),
        );
        throw new Error();
      }

      const openAiEnvValidationResult = validateOpenAiEnvVariables(process.env);
      if (!openAiEnvValidationResult.openAikey) {
        outputConfig.writeErr(
          ui?.validatingOpenAiEnvValidationFailed(openAiEnvValidationResult.error),
        );
        throw new Error();
      }

      const session = webMessengerSessionFactory(sessionValidationResult.validSessionConfig);

      const openai = openAiApiFactory(
        new Configuration({ apiKey: openAiEnvValidationResult.openAikey }),
      );

      new Transcriber(session).on('messageTranscribed', (i) => {
        if (i.who === 'You') {
          console.log(chalk.bold.green(`ChatGPT: ${i.message}`));
        } else {
          console.log(`Chatbot: ${i.message}`);
        }
      });

      const convo = conversationFactory(session);

      const messages: ChatCompletionRequestMessage[] = [
        {
          role: 'system',
          content: chatGptPrompt,
        },
      ];

      let endConversation: { hasEnded: false } | { hasEnded: true; reason: string } = {
        hasEnded: false,
      };
      do {
        const { data } = await backOff(
          () =>
            openai.createChatCompletion({
              model: 'gpt-3.5-turbo',
              n: 1, // Number of choices. This demo only supports 1
              temperature,
              messages,
            }),
          {
            startingDelay: 2000,
            retry: (error: AxiosError, attemptNumber) => {
              const retry = error.response.status === 429 && attemptNumber <= 10;
              if (retry) {
                console.log(
                  `${chalk.yellow.bold(`${error.response.statusText}:`)} ${chalk.yellow(
                    `Retrying (${attemptNumber} of 10)`,
                  )}`,
                );
              }
              return retry;
            },
          },
        );

        if (data.choices[0].message?.content) {
          messages.push({ role: 'assistant', content: data.choices[0].message.content });
          await convo.sendText(data.choices[0].message.content);
        } else {
          messages.push({ role: 'assistant', content: '' });
        }

        endConversation = shouldEndConversation(messages);

        if (!endConversation.hasEnded) {
          const chatBotResponses = await convo.waitForResponses(3000);
          messages.push({ role: 'user', content: chatBotResponses.join('\n') });
        }

        endConversation = shouldEndConversation(messages);
      } while (!endConversation.hasEnded);

      console.log(chalk.bold(`\n---------`));
      console.log(chalk.bold(`${endConversation.reason}`));

      session.close();
    });
}
