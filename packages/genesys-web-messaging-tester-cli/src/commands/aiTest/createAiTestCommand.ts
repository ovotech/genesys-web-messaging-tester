import { Command } from 'commander';
import { accessSync, readFileSync } from 'fs';
import {
  Conversation,
  SessionConfig,
  SessionTranscriber,
  TranscribedMessage,
  WebMessengerGuestSession,
  WebMessengerSession,
} from '@ovotech/genesys-web-messaging-tester';
import OpenAI, { ClientOptions } from 'openai';
import { validateOpenAiEnvVariables } from './validateOpenAIEnvVariables';
import { Ui } from './ui';
import { validateSessionConfig } from './validateSessionConfig';
import { shouldEndConversation, ShouldEndConversationResult } from './prompt/shouldEndConversation';
import { readableFileValidator } from '../../fileSystem/readableFileValidator';
import { createYamlFileReader } from '../../fileSystem/yamlFileReader';
import { validatePromptScript } from './testScript/validatePromptScript';
import { CommandExpectedlyFailedError } from '../CommandExpectedlyFailedError';

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

export interface AiTestCommandDependencies {
  command?: Command;
  ui?: Ui;
  openAiChatCompletionFactory?: (config: ClientOptions) => Pick<OpenAI.Chat.Completions, 'create'>;
  webMessengerSessionFactory?: (sessionConfig: SessionConfig) => WebMessengerSession;
  conversationFactory?: (session: WebMessengerSession) => Conversation;
  processEnv?: NodeJS.ProcessEnv;
  fsReadFileSync?: typeof readFileSync;
  fsAccessSync?: typeof accessSync;
  chatGptModel?: OpenAI.CompletionCreateParams['model'];
}

export function createAiTestCommand({
  command = new Command(),
  ui = new Ui(),
  openAiChatCompletionFactory = (config) => new OpenAI(config).chat.completions,
  webMessengerSessionFactory = (config) => new WebMessengerGuestSession(config, { IsTest: 'true' }),
  conversationFactory = (session) => new Conversation(session),
  processEnv = process.env,
  fsReadFileSync = readFileSync,
  fsAccessSync = accessSync,
  chatGptModel = 'gpt-3.5-turbo',
}: AiTestCommandDependencies = {}): Command {
  const yamlFileReader = createYamlFileReader(fsReadFileSync);
  if (!ui) {
    throw new Error('UI must be defined');
  }

  return command
    .command('ai')
    .description('Perform testing using Generative AI')
    .argument(
      '<filePath>',
      'Path of the YAML test-script file',
      readableFileValidator(fsAccessSync),
    )
    .option('-id, --deployment-id <deploymentId>', "Web Messenger Deployment's ID")
    .option(
      '-r, --region <region>',
      'Region of Genesys instance that hosts the Web Messenger Deployment',
    )
    .option('-o, --origin <origin>', 'Origin domain used for restricting Web Messenger Deployment')
    .action(
      async (
        testScriptPath: string,
        options: { deploymentId?: string; region?: string; origin?: string },
      ) => {
        const outputConfig = command.configureOutput();
        if (!outputConfig?.writeOut || !outputConfig?.writeErr) {
          throw new Error('No writeOut and/or writeErr');
        }

        const openAiEnvValidationResult = validateOpenAiEnvVariables(processEnv);
        if (!openAiEnvValidationResult.openAikey) {
          outputConfig.writeErr(
            ui.validatingOpenAiEnvValidationFailed(openAiEnvValidationResult.error),
          );
          throw new CommandExpectedlyFailedError();
        }

        // 1. Read YAML file
        let testScriptFileContents: unknown;
        try {
          testScriptFileContents = yamlFileReader(testScriptPath);
        } catch (error) {
          outputConfig.writeErr(ui.errorReadingTestScriptFile(error as Error));
          throw new CommandExpectedlyFailedError();
        }

        // 2. Validate Test Script
        const testScriptValidationResults = validatePromptScript(testScriptFileContents);
        // TODO Update scenario validation object to match
        if (testScriptValidationResults.error) {
          outputConfig.writeErr(ui.validatingPromptScriptFailed(testScriptValidationResults.error));
          throw new CommandExpectedlyFailedError();
        }

        // 3. Merge session config from args and Test Script - args take priority
        const { validPromptScript } = testScriptValidationResults;
        const mergedSessionConfig: Partial<SessionConfig> = {
          deploymentId: options.deploymentId ?? validPromptScript?.config?.deploymentId,
          region: options.region ?? validPromptScript?.config?.region,
          origin: options.origin ?? validPromptScript?.config?.origin,
        };

        // 4. Validate session config
        const sessionConfigValidationResults = validateSessionConfig(mergedSessionConfig);
        if (!sessionConfigValidationResults.validSessionConfig) {
          outputConfig.writeErr(
            ui.validatingSessionConfigFailed(sessionConfigValidationResults.error),
          );
          throw new CommandExpectedlyFailedError();
        }

        const totalScenarios = Object.keys(validPromptScript?.scenarios).length;
        if (totalScenarios > 1) {
          outputConfig.writeErr(ui.onlyOnePromptSupported(totalScenarios));
          throw new CommandExpectedlyFailedError();
        }

        const scenario = Object.entries(validPromptScript?.scenarios)[0][1];

        const session = webMessengerSessionFactory(
          sessionConfigValidationResults.validSessionConfig,
        );

        const openaiChatCompletion = openAiChatCompletionFactory({
          apiKey: openAiEnvValidationResult.openAikey,
          maxRetries: 5,
        });

        const transcript: TranscribedMessage[] = [];
        new SessionTranscriber(session).on('messageTranscribed', (msg: TranscribedMessage) => {
          ui.messageTranscribed(msg);
          transcript.push(msg);
        });

        const convo = conversationFactory(session);
        const messages: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[] = [
          {
            role: 'system',
            content: scenario.setup.prompt,
          },
        ];

        let endConversation: ShouldEndConversationResult = {
          hasEnded: false,
        };
        do {
          const { choices } = await openaiChatCompletion.create({
            model: chatGptModel,
            n: 1, // Number of choices
            temperature,
            messages,
          });

          if (choices[0].message?.content) {
            messages.push({ role: 'assistant', content: choices[0].message.content });
            await convo.sendText(choices[0].message.content);
          } else {
            messages.push({ role: 'assistant', content: '' });
          }

          endConversation = shouldEndConversation(
            messages,
            scenario.setup.terminatingPhrases.fail,
            scenario.setup.terminatingPhrases.pass,
          );

          if (!endConversation.hasEnded) {
            const chatBotResponses = await convo.waitForResponses(3000);
            messages.push({ role: 'user', content: chatBotResponses.join('\n') });
          }

          endConversation = shouldEndConversation(
            messages,
            scenario.setup.terminatingPhrases.fail,
            scenario.setup.terminatingPhrases.pass,
          );
        } while (!endConversation.hasEnded);

        outputConfig.writeOut(ui.testResult(endConversation));
        session.close();

        if (endConversation.reason.type === 'fail') {
          throw new CommandExpectedlyFailedError();
        }

        if (scenario.followUp) {
          outputConfig.writeOut(ui.followUpDetailsUnderDevelopment());
        }
        // if (scenario.followUp) {
        //   const content = substituteTemplatePlaceholders(scenario.followUp.prompt, transcript);
        //   const { choices } = await openai.chat.completions.create({
        //     model: chatGptModel,
        //     n: 1, // Number of choices
        //     temperature,
        //     messages: [
        //       {
        //         role: 'system',
        //         content,
        //       },
        //     ],
        //   });
        //
        //   if (choices[0].message?.content) {
        //     const result = containsTerminatingPhrases(choices[0].message.content, {
        //       fail: scenario.setup.terminatingPhrases.fail,
        //       pass: scenario.setup.terminatingPhrases.pass,
        //     });
        //
        //     outputConfig.writeOut(ui.followUpDetails(choices[0].message.content));
        //     if (result.phraseFound) {
        //       outputConfig.writeOut(ui.followUpResult(result));
        //       if (result.phraseIndicates === 'fail') {
        //         throw new CommandExpectedlyFailedError();
        //       }
        //     }
        //   }
        //
        //   // endConversation = shouldEndConversation(
        //   //   messages,
        //   //   scenario.setup.terminatingPhrases.fail,
        //   //   scenario.setup.terminatingPhrases.pass,
        //   // );
        //   // if (choices[0].message?.content) {
        //   //   messages.push({ role: 'assistant', content: choices[0].message.content });
        //   //   await convo.sendText(choices[0].message.content);
        //   // } else {
        //   //   messages.push({ role: 'assistant', content: '' });
        //   // }
        // }
      },
    );
}
