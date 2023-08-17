import chalk from 'chalk';
import { TestScriptScenario } from './testScript/parseTestScript';
import {
  BotDisconnectedWaitingForResponseError,
  TimeoutWaitingForResponseError,
  TranscribedMessage,
} from '@ovotech/genesys-web-messaging-tester';
import { ValidationError } from 'joi';
import { ScenarioError, ScenarioSuccess } from './ScenarioResult';
import humanizeDuration from 'humanize-duration';
import {
  ConversationIdGetterFailure,
  PreflightError,
} from './genesysPlatform/messageIdToConversationIdFactory';

export class Ui {
  /**
   * Given the extensive use of Chalk in here, this utility method makes it clear
   * that trailing newlines are safer encoded outside the Chalk string.
   *
   * @see https://github.com/ovotech/genesys-web-messaging-tester/issues/20#issuecomment-1246630078
   */
  private static trailingNewline(text: string, count = 1): string {
    return `${text}${'\n'.repeat(count)}`;
  }

  public errorReadingTestScriptFile(error: Error): string {
    return Ui.trailingNewline(chalk.red(error.message));
  }

  public titleOfTask(
    scenario: TestScriptScenario,
    isRetryDueToUnorderedMsgFailure = false,
  ): string {
    if (isRetryDueToUnorderedMsgFailure) {
      return `${scenario.name} (RETRYING)`;
    } else {
      return scenario.name;
    }
  }

  public titleOfFinishedTask(scenario: TestScriptScenario, hasPassed: boolean): string {
    if (hasPassed) {
      return `${scenario.name} (${chalk.bold.green('PASS')})`;
    } else {
      return `${scenario.name} (${chalk.bold.red('FAIL')})`;
    }
  }

  public messageTranscribed(event: TranscribedMessage): string {
    return Ui.trailingNewline(`${chalk.bold.grey(`${event.who}:`)} ${chalk.grey(event.message)}`);
  }

  public retryingTestDueToFailureLikelyByUnorderedMessage(): string {
    return Ui.trailingNewline('Test failed. Retrying as unordered messages detected');
  }

  public firstLineOfMessageTranscribed(event: TranscribedMessage): string {
    const lines = event.message.trim().split('\n');

    const message = `${chalk.bold.grey(`${event.who}:`)} ${chalk.grey(lines[0])}`;
    if (lines.length > 1) {
      return `${message}${chalk.grey('...')}`;
    }

    return message;
  }

  public validatingTestScriptFailed(error: ValidationError | undefined): string {
    return Ui.trailingNewline(chalk.red(error?.message ?? 'Failed to validate Test Script'));
  }

  public validatingSessionConfigFailed(error: ValidationError | undefined): string {
    return Ui.trailingNewline(chalk.red(error?.message ?? 'Failed to validate Session config'));
  }

  public preflightCheckOfAssociateConvoIdFailed(error: PreflightError): string {
    if (error.errorType === 'missing-permissions') {
      return Ui.trailingNewline(
        chalk.red(
          'Your OAuth Client does not have the necessary permissions to associate a conversation IDs to tests:\n' +
            `'${error.reasonForError}'`,
        ),
      );
    }

    return Ui.trailingNewline(
      chalk.red(
        'There was a problem checking whether your OAuth Client has the necessary permissions to associate a conversation IDs to tests:\n' +
          error.reasonForError,
      ),
    );
  }
  public validatingAssociateConvoIdEnvValidationFailed(error: ValidationError | undefined): string {
    return Ui.trailingNewline(
      chalk.red(
        error?.message ??
          'Failed to validate environment variables containing Genesys OAuth Client credentials',
      ),
    );
  }

  public async scenarioTestResult(result: ScenarioError | ScenarioSuccess): Promise<string> {
    let suffix = '';
    let conversationIdFailure: ConversationIdGetterFailure | undefined = undefined;
    if (result.conversationId.associateId) {
      const conversationIdResult = await result.conversationId.conversationIdGetter();
      if (conversationIdResult.successful) {
        suffix = ` - ${chalk.green(conversationIdResult.id)}`;
      } else {
        conversationIdFailure = conversationIdResult;
        suffix = ` - ${chalk.yellow('unable to associate conversation ID')}`;
      }
    }

    const title = result.hasPassed
      ? `${chalk.bold(result.scenario.name)} (${chalk.green('PASS')}${suffix})`
      : `${chalk.bold(result.scenario.name)} (${chalk.red('FAIL')})${suffix}`;

    const lines = [
      '',
      title,
      '---------------------',
      ...result.transcription.map((t) => `${chalk.bold(`${t.who}:`)} ${t.message}`),
    ];

    if (!result.hasPassed) {
      lines.push('');
      const error = result.reasonForError;
      if (error instanceof BotDisconnectedWaitingForResponseError) {
        if (error.responsesReceived.length === 0) {
          lines.push(
            chalk.red(
              [
                `Bot disconnected from the conversation whilst waiting a message containing:`,
                ` ${error.expectedResponse}`,
                `No messages were received before disconnection`,
              ].join('\n'),
            ),
          );
        } else {
          lines.push(
            chalk.red(
              [
                `Bot disconnected from the conversation whilst waiting a message containing:`,
                ` ${error.expectedResponse}`,
                'Received the following messages before disconnection:',
                ...error.responsesReceived.map((m) => ` - ${m.text}`),
              ].join('\n'),
            ),
          );
        }
      } else if (error instanceof TimeoutWaitingForResponseError) {
        if (error.responsesReceived.length === 0) {
          lines.push(
            chalk.red(
              [
                `Expected a message within ${humanizeDuration(error.timeoutInMs)} containing:`,
                ` ${error.expectedResponse}`,
                `Didn't receive any response`,
              ].join('\n'),
            ),
          );
        } else {
          lines.push(
            chalk.red(
              [
                `Expected a message within ${humanizeDuration(error.timeoutInMs)} containing:`,
                ` ${error.expectedResponse}`,
                'Received:',
                ...error.responsesReceived.map((m) => ` - ${m.text}`),
              ].join('\n'),
            ),
          );
        }
      } else {
        lines.push(chalk.red(result.reasonForError.message));
      }
    }

    if (result.conversationId.associateId && conversationIdFailure) {
      let errorMsg = `WARNING: Could not find Conversation ID for test `;

      switch (conversationIdFailure.reason) {
        case 'not-received-message':
          errorMsg += 'as your test did not receive a response from your flow.';
          break;
        case 'convo-id-not-in-response':
          errorMsg +=
            "as the response from your flow did not contain a Message ID, which is necessary for finding the test's Conversation ID.";
          break;
        case 'unknown-error':
          if (conversationIdFailure.error instanceof Error) {
            errorMsg += `due to an unexpected error: ${conversationIdFailure.error.message}.`;
          }
          if (typeof conversationIdFailure.error === 'string') {
            errorMsg += `due to an unexpected error: ${conversationIdFailure.error}.`;
          }
          errorMsg += `due to an unexpected error.`;
          break;
        default:
          errorMsg += `due to an unexpected error.`;
          break;
      }

      lines.push(chalk.yellow(errorMsg));
    }
    return Ui.trailingNewline(lines.join('\n'), 1);
  }

  public testScriptSummary(results: (ScenarioSuccess | ScenarioError)[]): string {
    const lines: string[] = [];
    for (const r of results) {
      if (r.hasPassed) {
        lines.push(chalk.green(`PASS - ${r.scenario.name}`));
      } else {
        lines.push(chalk.red(`FAIL - ${r.scenario.name}`));
      }

      if (r.wasRetriedDueToUnorderedMessageFailure) {
        lines.push(
          chalk.yellow(
            '  ^This test was retried following a failure that coincided with unordered messages being being received from Genesys\n' +
              '  Read more here: https://github.com/ovotech/genesys-web-messaging-tester/blob/main/docs/cli/unordered-messages.md',
          ),
        );
      }
    }

    return Ui.trailingNewline(
      `\n${chalk.bold('Scenario Test Results')}
---------------------
${lines.join('\n')}`,
    );
  }
}
