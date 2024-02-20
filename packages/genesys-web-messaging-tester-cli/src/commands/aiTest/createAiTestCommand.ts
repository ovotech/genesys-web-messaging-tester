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
import { Ui } from './ui';
import { validateSessionConfig } from './validateSessionConfig';
import { shouldEndConversation, ShouldEndConversationResult } from './prompt/shouldEndConversation';
import { readableFileValidator } from '../../fileSystem/readableFileValidator';
import { createYamlFileReader } from '../../fileSystem/yamlFileReader';
import { validatePromptScript } from './testScript/validatePromptScript';
import { CommandExpectedlyFailedError } from '../CommandExpectedlyFailedError';
import { SupportedAiProviders } from './testScript/modelTypes';
import * as googleAi from './chatCompletionClients/googleVertexAi/createChatCompletionClient';
import * as openAi from './chatCompletionClients/chatGpt/createChatCompletionClient';
import { ChatCompletionClient, Utterance } from './chatCompletionClients/chatCompletionClient';
import { validateOpenAiEnvVariables } from './chatCompletionClients/chatGpt/validateOpenAiEnvVariables';
import { promptGenerator } from './prompt/generation/promptGenerator';

export interface AiTestCommandDependencies {
  command?: Command;
  ui?: Ui;
  openAiCreateChatCompletionClient?: typeof openAi.createChatCompletionClient;
  googleAiCreateChatCompletionClient?: typeof googleAi.createChatCompletionClient;
  webMessengerSessionFactory?: (sessionConfig: SessionConfig) => WebMessengerSession;
  conversationFactory?: (session: WebMessengerSession) => Conversation;
  processEnv?: NodeJS.ProcessEnv;
  fsReadFileSync?: typeof readFileSync;
  fsAccessSync?: typeof accessSync;
}

export function createAiTestCommand({
  command = new Command(),
  ui = new Ui(),
  openAiCreateChatCompletionClient = openAi.createChatCompletionClient,
  googleAiCreateChatCompletionClient = googleAi.createChatCompletionClient,
  webMessengerSessionFactory = (config) =>
    new WebMessengerGuestSession(config, { IsAutomatedTest: 'true' }),
  conversationFactory = (session) => new Conversation(session),
  processEnv = process.env,
  fsReadFileSync = readFileSync,
  fsAccessSync = accessSync,
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

        let chatCompletionClient: ChatCompletionClient | null = null;
        if (validPromptScript.config.ai.provider === SupportedAiProviders.ChatGpt) {
          const openAiEnvValidationResult = validateOpenAiEnvVariables(processEnv);
          if (!openAiEnvValidationResult.openAikey) {
            outputConfig.writeErr(
              ui.validatingOpenAiEnvValidationFailed(openAiEnvValidationResult.error),
            );
            throw new CommandExpectedlyFailedError();
          }
          const chatGptConfig = validPromptScript.config.ai.config ?? {};
          chatCompletionClient = openAiCreateChatCompletionClient(
            chatGptConfig,
            openAiEnvValidationResult.openAikey,
          );
        } else {
          const googleAiConfig = validPromptScript.config.ai.config;
          chatCompletionClient = googleAiCreateChatCompletionClient(googleAiConfig);
        }

        // 5. Preflight check of AI library
        const preflightCheckResult = await chatCompletionClient.preflightCheck();
        if (!preflightCheckResult.ok) {
          outputConfig.writeErr(
            ui.preflightCheckFailure(chatCompletionClient.getProviderName(), preflightCheckResult),
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

        new SessionTranscriber(session).on('messageTranscribed', (msg: TranscribedMessage) => {
          ui.messageTranscribed(msg);
        });

        const convo = conversationFactory(session);
        const messages: Utterance[] = [];

        const generatedPrompt = promptGenerator(scenario.setup);
        if (generatedPrompt.placeholdersFound) {
          outputConfig.writeOut(ui.displayPlaceholders(generatedPrompt));
          outputConfig.writeOut(ui.conversationStartHeader());
        }

        let endConversation: ShouldEndConversationResult = {
          hasEnded: false,
        };
        do {
          const utterance = await chatCompletionClient.predict(generatedPrompt.prompt, messages);

          if (utterance) {
            messages.push(utterance);
            await convo.sendText(utterance.content);
          } else {
            messages.push({ role: 'customer', content: '' });
          }

          endConversation = shouldEndConversation(
            messages,
            scenario.setup.terminatingPhrases.fail,
            scenario.setup.terminatingPhrases.pass,
          );

          if (!endConversation.hasEnded) {
            // TODO Allow time to wait to be customised
            const chatBotResponses = await convo.waitForResponses(3000);
            messages.push({ role: 'bot', content: chatBotResponses.join('\n') });
          }

          endConversation = shouldEndConversation(
            messages,
            scenario.setup.terminatingPhrases.fail,
            scenario.setup.terminatingPhrases.pass,
          );
          // TODO Handle bot ending conversation
        } while (!endConversation.hasEnded);

        outputConfig.writeOut(ui.testResult(endConversation));
        session.close();

        if (endConversation.reason.type === 'fail') {
          throw new CommandExpectedlyFailedError();
        }

        if (scenario.followUp) {
          outputConfig.writeOut(ui.followUpDetailsUnderDevelopment());
        }
      },
    );
}
