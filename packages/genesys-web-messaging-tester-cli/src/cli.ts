import ci from 'ci-info';
import { Listr } from 'listr2';
import * as commander from 'commander';
import { Command } from 'commander';
import { accessSync, readFileSync } from 'fs';
import { readableFileValidator } from './fileSystem/readableFileValidator';
import { createYamlFileReader } from './fileSystem/yamlFileReader';
import { extractScenarios } from './testScript/parseTestScript';
import {
  Conversation,
  SessionConfig,
  TranscribedMessage,
  Transcriber,
  WebMessengerGuestSession,
  WebMessengerSession,
} from '@ovotech/genesys-web-messaging-tester';
import { Ui } from './ui';
import { validateSessionConfig } from './testScript/validateSessionConfig';
import { validateTestScript } from './testScript/validateTestScript';
import { ScenarioError, ScenarioSuccess } from './ScenarioResult';
import { validateGenesysEnvVariables } from './genesysPlatform/validateGenesysEnvVariables';
import { configurePlatformClients } from './genesysPlatform/configurePlatformClients';
import {
  createConversationIdGetter,
  messageIdToConversationIdFactory,
  MessageIdToConvoIdClient,
} from './genesysPlatform/messageIdToConversationIdFactory';

function parsePositiveInt(value: string) {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  if (parsedValue <= 0) {
    throw new commander.InvalidArgumentError('Must be greater than 0.');
  }

  return parsedValue;
}

interface ListrRunContext {
  scenarioResults: (ScenarioError | ScenarioSuccess)[];
}

export interface Dependencies {
  outputConsole?: Console;
  program?: Command;
  ui?: Ui;
  webMessengerSessionFactory?: (sessionConfig: SessionConfig) => WebMessengerSession;
  conversationFactory?: (session: WebMessengerSession) => Conversation;
  fsReadFileSync?: typeof readFileSync;
  fsAccessSync?: typeof accessSync;
  /**
   * Allow the {@link process.exit} call to be overridden for testing purposes.
   *
   * There is an [expectation from Commander that this call will terminate the
   * execution path](https://github.com/tj/commander.js/blob/02a124c7d58dbae2ef11f9284b2c68ad94f6dc8b/lib/command.js#L445-L451),
   * otherwise it calls `process.exit` regardless.
   */
  processExitOverride?: (code?: number | undefined) => never;
  /**
   * Quiet mode is used for non-TTY and CI environments, where outputting the progress
   * of a test would cause too much noise in the UI
   */
  quietMode?: boolean;
}

export type Cli = (args: string[]) => Promise<void>;

export function createCli({
  program = new Command(),
  ui = new Ui(),
  webMessengerSessionFactory = (config) => new WebMessengerGuestSession(config, { IsTest: 'true' }),
  conversationFactory = (session) => new Conversation(session),
  fsReadFileSync = readFileSync,
  fsAccessSync = accessSync,
  processExitOverride = (c) => process.exit(c),
  quietMode = !process.stdout.isTTY || ci.isCI,
}: Dependencies = {}): Cli {
  program?.exitOverride(() => processExitOverride(1));

  program.argument(
    '<filePath>',
    'Path of the YAML test-script file',
    readableFileValidator(fsAccessSync),
  );
  program.option('-id, --deployment-id <deploymentId>', "Web Messenger Deployment's ID");
  program.option(
    '-r, --region <region>',
    'Region of Genesys instance that hosts the Web Messenger Deployment',
  );
  program.option(
    '-o, --origin <origin>',
    'Origin domain used for restricting Web Messenger Deployment',
  );
  program?.option(
    '-p, --parallel <number>',
    'Maximum scenarios to run in parallel',
    parsePositiveInt,
    1,
  );
  program?.option(
    '-a, --associate-id',
    `Associate tests their conversation ID.
This requires the following environment variables to be set for an OAuth client
with the role conversation:webmessaging:view:
GENESYS_REGION
GENESYSCLOUD_OAUTHCLIENT_ID
GENESYSCLOUD_OAUTHCLIENT_SECRET`,
    false,
  );
  program?.option('-fo, --failures-only', 'Only output failures', false);

  const yamlFileReader = createYamlFileReader(fsReadFileSync);

  return async function (args: string[]): Promise<void> {
    const outputConfig = program.configureOutput();
    if (!outputConfig.writeOut || !outputConfig.writeErr) {
      throw new Error('No writeOut');
    }

    program.parse(args);

    const options = program.opts();
    const testScriptPath = program.args[0];

    let associateId: { enabled: false } | { enabled: true; client: MessageIdToConvoIdClient };
    if (!options.associateId) {
      associateId = { enabled: false };
    } else {
      const genesysEnvValidationResult = validateGenesysEnvVariables(process.env);
      if (!genesysEnvValidationResult.genesysVariables) {
        outputConfig.writeErr(
          ui?.validatingAssociateConvoIdEnvValidationFailed(genesysEnvValidationResult.error),
        );
      } else {
        const clients = await configurePlatformClients(genesysEnvValidationResult.genesysVariables);

        const messageIdToConversationIdClient = messageIdToConversationIdFactory(clients);
        associateId = { enabled: true, client: messageIdToConversationIdClient };

        const checkResult = await messageIdToConversationIdClient.preflightCheck();
        if (!checkResult.ok) {
          outputConfig.writeErr(ui?.preflightCheckOfAssociateConvoIdFailed(checkResult));
          processExitOverride(1);
        }
      }
    }

    // 1. Read YAML file
    let testScriptFileContents: unknown;
    try {
      testScriptFileContents = yamlFileReader(testScriptPath);
    } catch (error) {
      outputConfig.writeErr(ui?.errorReadingTestScriptFile(error as Error));
      processExitOverride(1);
      return;
    }

    // 2. Validate Test Script
    const testScriptValidationResults = validateTestScript(testScriptFileContents);
    if (!testScriptValidationResults.validTestScript) {
      outputConfig.writeErr(ui?.validatingTestScriptFailed(testScriptValidationResults.error));
      processExitOverride(1);
      return;
    }

    // 3. Merge session config from args and Test Script - args take priority
    const { validTestScript } = testScriptValidationResults;
    const mergedSessionConfig: Partial<SessionConfig> = {
      deploymentId: options.deploymentId ?? validTestScript?.config?.deploymentId,
      region: options.region ?? validTestScript?.config?.region,
      origin: options.origin ?? validTestScript?.config?.origin,
    };

    // 4. Validate session config
    const sessionConfigValidationResults = validateSessionConfig(mergedSessionConfig);
    if (!sessionConfigValidationResults.validSessionConfig) {
      outputConfig.writeErr(
        ui?.validatingSessionConfigFailed(sessionConfigValidationResults.error),
      );
      processExitOverride(1);
      return;
    }

    // 5. Extract Scenarios from Test Script
    const testScriptScenarios = extractScenarios(
      testScriptValidationResults.validTestScript,
      sessionConfigValidationResults.validSessionConfig,
    );

    const hasMultipleTests = testScriptScenarios.length > 1;

    const tasks = new Listr<ListrRunContext>(
      testScriptScenarios.map((scenario) => ({
        title: ui?.titleOfTask(scenario),
        task: async (context, task) => {
          const transcription: TranscribedMessage[] = [];
          const session = webMessengerSessionFactory(scenario.sessionConfig);

          let conversationIdGetter: ReturnType<typeof createConversationIdGetter> | undefined =
            undefined;
          if (associateId.enabled) {
            conversationIdGetter = createConversationIdGetter(session, associateId.client);
          }

          try {
            new Transcriber(session).on('messageTranscribed', (event: TranscribedMessage) => {
              transcription.push(event);

              if (!quietMode) {
                if (hasMultipleTests) {
                  task.output = ui?.firstLineOfMessageTranscribed(event);
                } else {
                  const message = ui?.messageTranscribed(event);
                  if (task.output) {
                    task.output += message;
                  } else {
                    task.output = message;
                  }
                }
              }
            });

            const convo = conversationFactory(session);
            await convo.waitForConversationToStart();

            for (const step of scenario.steps) {
              await step(convo, {});
            }
          } catch (error) {
            context.scenarioResults.push({
              scenario,
              transcription,
              hasPassed: false,
              reasonForError:
                error instanceof Error ? error : new Error('Unexpected error occurred'),
              conversationId: conversationIdGetter
                ? { associateId: true, conversationIdGetter }
                : { associateId: false },
            });
            throw new Error(ui?.titleOfFinishedTask(scenario, false));
          } finally {
            session.close();
          }

          task.title = ui?.titleOfFinishedTask(scenario, true);
          context.scenarioResults.push({
            scenario,
            transcription,
            hasPassed: true,
            conversationId: conversationIdGetter
              ? { associateId: true, conversationIdGetter }
              : { associateId: false },
          });
        },
      })),
      {
        concurrent: options.parallel,
        exitOnError: false,
        collectErrors: false,
        rendererFallback: () => quietMode,
      },
    );

    const results = await tasks.run({ scenarioResults: [] });

    const scenariosThatPassed = results.scenarioResults.filter(
      (s) => s.hasPassed,
    ) as ScenarioSuccess[];

    if (!options.failuresOnly) {
      for (const s of scenariosThatPassed) {
        outputConfig.writeOut(await ui?.scenarioTestResult(s));
      }
    }

    const scenariosThatFailed = results.scenarioResults.filter(
      (s) => !s.hasPassed,
    ) as ScenarioSuccess[];

    for (const s of scenariosThatFailed) {
      outputConfig.writeOut(await ui?.scenarioTestResult(s));
    }

    outputConfig.writeOut(ui?.testScriptSummary([...scenariosThatPassed, ...scenariosThatFailed]));

    if (results.scenarioResults.some((r) => !r.hasPassed)) {
      processExitOverride(1);
      return;
    }
  };
}
