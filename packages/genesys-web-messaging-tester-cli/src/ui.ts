import chalk from 'chalk';
import { TestScriptScenario } from './testScript/parseTestScript';
import {
  TimeoutWaitingForResponseError,
  TranscribedMessage,
} from '@ovotech/genesys-web-messaging-tester';
import { ValidationError } from 'joi';
import { ScenarioError, ScenarioSuccess } from './ScenarioResult';
import humanizeDuration from 'humanize-duration';

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

  public titleOfTask(scenario: TestScriptScenario): string {
    return scenario.name;
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

  public firstLineOfMessageTranscribed(event: TranscribedMessage): string {
    const lines = event.message.trim().split('\n');

    const message = `${chalk.bold.grey(`${event.who}:`)} ${chalk.grey(lines[0])}`;
    if (lines.length > 1) {
      return `${message}...`;
    }

    return message;
  }

  public validatingTestScriptFailed(error: ValidationError | undefined): string {
    return Ui.trailingNewline(chalk.red(error?.message ?? 'Failed to validate Test Script'));
  }

  public validatingSessionConfigFailed(error: ValidationError | undefined): string {
    return Ui.trailingNewline(chalk.red(error?.message ?? 'Failed to validate Session config'));
  }

  public scenarioTestResult(result: ScenarioError | ScenarioSuccess): string {
    const title = result.hasPassed
      ? `${chalk.bold(result.scenario.name)} (${chalk.green('PASS')})`
      : `${chalk.bold(result.scenario.name)} (${chalk.red('FAIL')})`;

    const lines = [
      '',
      title,
      '---------------------',
      ...result.transcription.map((t) => `${chalk.bold(`${t.who}:`)} ${t.message}`),
    ];

    if (!result.hasPassed) {
      lines.push('');
      const error = result.reasonForError;
      if (!(error instanceof TimeoutWaitingForResponseError)) {
        lines.push(chalk.red(result.reasonForError.message));
      } else {
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
                ...error.responsesReceived.map((m) => ` - ${m.body.text}`),
              ].join('\n'),
            ),
          );
        }
      }
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
    }

    return Ui.trailingNewline(
      `\n${chalk.bold('Scenario Test Results')}
---------------------
${lines.join('\n')}`,
    );
  }
}
