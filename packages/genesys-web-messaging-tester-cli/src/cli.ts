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
import { v4 as uuidv4 } from 'uuid';

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
  webMessengerSessionFactory?: (
    sessionConfig: SessionConfig,
    testId: string,
  ) => WebMessengerSession;
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
   * Progress is shown by outputting the current line of a scenario's transcription, however
   * under certain circumstances (e.g. non-TTY output) this adds a lot of unnecessary noise.
   */
  showProgress?: boolean;
}

export type Cli = (args: string[]) => Promise<void>;

export function createCli({
  program = new Command(),
  ui = new Ui(),
  webMessengerSessionFactory = (config, testId: string) =>
    new WebMessengerGuestSession(config, { TestID: testId }),
  conversationFactory = (session) => new Conversation(session),
  fsReadFileSync = readFileSync,
  fsAccessSync = accessSync,
  processExitOverride = (c) => process.exit(c),
  showProgress = process.stdout.isTTY,
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

  const yamlFileReader = createYamlFileReader(fsReadFileSync);

  return async function (args: string[]): Promise<void> {
    const outputConfig = program.configureOutput();
    if (!outputConfig.writeOut || !outputConfig.writeErr) {
      throw new Error('No writeOut');
    }

    program.parse(args);

    const options = program.opts();
    const testScriptPath = program.args[0];

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
          const testId = uuidv4();

          const transcription: TranscribedMessage[] = [];
          const session = webMessengerSessionFactory(scenario.sessionConfig, testId);
          try {
            new Transcriber(session).on('messageTranscribed', (event: TranscribedMessage) => {
              transcription.push(event);

              if (showProgress) {
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
              await step(convo);
            }
          } catch (error) {
            context.scenarioResults.push({
              scenario,
              transcription,
              hasPassed: false,
              reasonForError:
                error instanceof Error ? error : new Error('Unexpected error occurred'),
            });
            throw new Error(ui?.titleOfFinishedTask(scenario, false));
          } finally {
            session.close();
          }

          task.title = ui?.titleOfFinishedTask(scenario, true);
          context.scenarioResults.push({ scenario, transcription, hasPassed: true });
        },
      })),
      { concurrent: options.parallel, exitOnError: false, collectErrors: false },
    );

    const results = await tasks.run({ scenarioResults: [] });

    const scenariosThatPassed = results.scenarioResults.filter(
      (s) => s.hasPassed,
    ) as ScenarioSuccess[];

    scenariosThatPassed.forEach((s) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      outputConfig.writeOut(ui?.scenarioTestResult(s)),
    );

    const scenariosThatFailed = results.scenarioResults.filter(
      (s) => !s.hasPassed,
    ) as ScenarioSuccess[];

    scenariosThatFailed.forEach((s) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      outputConfig.writeOut(ui?.scenarioTestResult(s)),
    );

    outputConfig.writeOut(ui?.testScriptSummary([...scenariosThatPassed, ...scenariosThatFailed]));

    if (results.scenarioResults.some((r) => !r.hasPassed)) {
      processExitOverride(1);
      return;
    }
  };
}
