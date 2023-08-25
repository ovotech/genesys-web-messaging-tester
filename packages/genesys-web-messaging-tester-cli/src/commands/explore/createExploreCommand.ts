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
import { shouldEndConversation, ShouldEndConversationResult } from './shouldEndConversation';
import { readableFileValidator } from '../../fileSystem/readableFileValidator';
import { createYamlFileReader } from '../../fileSystem/yamlFileReader';
import { validatePromptScript } from './testScript/validatePromptScript';

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

export interface ExploreCommandDependencies {
  command?: Command;
  ui?: Ui;
  openAiApiFactory?: (config: ClientOptions) => OpenAI;
  webMessengerSessionFactory?: (sessionConfig: SessionConfig) => WebMessengerSession;
  conversationFactory?: (session: WebMessengerSession) => Conversation;
  fsReadFileSync?: typeof readFileSync;
  fsAccessSync?: typeof accessSync;
}

export function createExploreCommand({
  command = new Command(),
  ui = new Ui(),
  openAiApiFactory = (config) => new OpenAI(config),
  webMessengerSessionFactory = (config) => new WebMessengerGuestSession(config, { IsTest: 'true' }),
  conversationFactory = (session) => new Conversation(session),
  fsReadFileSync = readFileSync,
  fsAccessSync = accessSync,
}: ExploreCommandDependencies = {}): Command {
  const yamlFileReader = createYamlFileReader(fsReadFileSync);
  if (!ui) {
    throw new Error('UI must be defined');
  }

  return command
    .command('explore')
    .description('Test a WM Deployment against Generative AI')
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
        if (!outputConfig) {
          throw new Error('Output must be defined');
        }

        if (!outputConfig.writeOut || !outputConfig.writeErr) {
          throw new Error('No writeOut');
        }

        const sessionValidationResult = validateSessionConfig(options);
        if (!sessionValidationResult.validSessionConfig) {
          outputConfig.writeErr(
            ui.validatingOpenAiEnvValidationFailed(sessionValidationResult.error),
          );
          throw new Error();
        }

        const openAiEnvValidationResult = validateOpenAiEnvVariables(process.env);
        if (!openAiEnvValidationResult.openAikey) {
          outputConfig.writeErr(
            ui.validatingOpenAiEnvValidationFailed(openAiEnvValidationResult.error),
          );
          throw new Error();
        }

        // 1. Read YAML file
        let testScriptFileContents: unknown;
        try {
          testScriptFileContents = yamlFileReader(testScriptPath);
        } catch (error) {
          outputConfig.writeErr(ui.errorReadingTestScriptFile(error as Error));
          throw new Error();
        }

        // 2. Validate Test Script
        const testScriptValidationResults = validatePromptScript(testScriptFileContents);
        // TODO Update scenario validation object to match
        if (testScriptValidationResults.error) {
          outputConfig.writeErr(ui.validatingPromptScriptFailed(testScriptValidationResults.error));
          throw new Error();
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
          throw new Error();
        }

        const totalPrompts = Object.keys(validPromptScript?.prompts).length;
        if (totalPrompts > 1) {
          outputConfig.writeErr(ui.onlyOnePromptSupported(totalPrompts));
          throw new Error();
        }

        const promptConfig = Object.entries(validPromptScript?.prompts)[0][1];

        const session = webMessengerSessionFactory(sessionValidationResult.validSessionConfig);

        const openai = openAiApiFactory({
          apiKey: openAiEnvValidationResult.openAikey,
          maxRetries: 5,
        });

        new SessionTranscriber(session).on('messageTranscribed', (msg: TranscribedMessage) =>
          ui.messageTranscribed(msg),
        );

        const convo = conversationFactory(session);
        const messages: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[] = [
          {
            role: 'system',
            content: promptConfig.prompt,
          },
        ];

        let endConversation: ShouldEndConversationResult = {
          hasEnded: false,
        };
        do {
          const { choices } = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
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
            promptConfig.terminatingResponses.fail,
            promptConfig.terminatingResponses.pass,
          );

          if (!endConversation.hasEnded) {
            const chatBotResponses = await convo.waitForResponses(3000);
            messages.push({ role: 'user', content: chatBotResponses.join('\n') });
          }

          endConversation = shouldEndConversation(
            messages,
            promptConfig.terminatingResponses.fail,
            promptConfig.terminatingResponses.pass,
          );
        } while (!endConversation.hasEnded);

        outputConfig.writeOut(ui.testResult(endConversation));

        session.close();

        if (endConversation.reason.type === 'fail') {
          throw new Error();
        }
      },
    );
}
