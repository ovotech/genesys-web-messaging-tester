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
}

export type Cli = (args: string[]) => Promise<void>;

export function createCli({
  program = new Command(),
  ui = new Ui(),
  webMessengerSessionFactory = (config) => new WebMessengerGuestSession(config),
  conversationFactory = (session) => new Conversation(session),
  fsReadFileSync = readFileSync,
  fsAccessSync = accessSync,
  processExitOverride = (c) => process.exit(c),
}: Dependencies = {}): Cli {
  program?.exitOverride(() => processExitOverride(1));

  program.option('-id, --deployment-id <deploymentId>', "Web Messenger Deployment's ID");
  program.option(
    '-r, --region <region>',
    'Region of Genesys instance that hosts the Web Messenger Deployment',
  );
  program.option(
    '-o, --origin <origin>',
    'Origin domain used for restricting Web Messenger Deployment',
  );
  program.requiredOption<string>(
    '-p, --test-script-path <filePath>',
    'Path of the YAML test script file',
    readableFileValidator(fsAccessSync),
  );
  program.option(
    '-var, --variable [variables...]',
    'Variable key=value for text templates in scenarios. Can be defined multiple times',
    // /\w+\s*=\s*/,
  );

  const yamlFileReader = createYamlFileReader(fsReadFileSync);

  return async function (args: string[]): Promise<void> {
    const outputConfig = program.configureOutput();
    if (!outputConfig.writeOut || !outputConfig.writeErr) {
      throw new Error('No writeOut');
    }

    program.parse(args);

    const options = program.opts();

    // 1. Read YAML file
    let testScriptFileContents: unknown;
    try {
      testScriptFileContents = yamlFileReader(options.testScriptPath);
    } catch (error) {
      outputConfig.writeErr(ui.errorReadingTestScriptFile(error as Error));
      processExitOverride(1);
      return;
    }

    // 2. Validate Test Script
    const testScriptValidationResults = validateTestScript(testScriptFileContents);
    if (!testScriptValidationResults.validTestScript) {
      outputConfig.writeErr(ui.validatingTestScriptFailed(testScriptValidationResults.error));
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
      outputConfig.writeErr(ui.validatingSessionConfigFailed(sessionConfigValidationResults.error));
      processExitOverride(1);
      return;
    }

    // 5. Extract Scenarios from Test Script
    const testScriptScenarios = extractScenarios(
      testScriptValidationResults.validTestScript,
      sessionConfigValidationResults.validSessionConfig,
      options.variable,
    );

    let wasError = false;

    for (const scenario of testScriptScenarios) {
      outputConfig.writeOut(ui.aboutToTestScenario(scenario));

      const session = webMessengerSessionFactory(scenario.sessionConfig);
      try {
        new Transcriber(session).on('messageTranscribed', (event: TranscribedMessage) =>
          // @ts-ignore
          outputConfig.writeOut(ui.messageTranscribed(event)),
        );

        const convo = conversationFactory(session);
        await convo.waitForConversationToStart();

        for (const step of scenario.steps) {
          await step(convo);
        }
        outputConfig.writeOut(ui.scenarioPassed(scenario));
      } catch (error) {
        wasError = true;
        outputConfig.writeErr(ui.scenarioFailed(scenario, error as Error));
      } finally {
        session.close();
      }
    }

    outputConfig.writeOut(ui.testScriptSummary());
    if (wasError) {
      processExitOverride(1);
      return;
    }
  };
}
