import chalk from 'chalk';
import { TestScriptScenario } from './testScript/parseTestScript';
import {
  TranscribedMessage,
  TimeoutWaitingForResponseError,
  StructuredMessage,
} from '@ovotech/genesys-web-messaging-tester';
import { ValidationError } from 'joi';

interface ScenarioTestResult {
  scenario: TestScriptScenario;
  hasPassed: boolean;
  error?: Error;
}

function createUserFriendlyErrorForTimeoutError(error: TimeoutWaitingForResponseError): string[] {
  if (error.responsesReceived.length === 0) {
    return [`Did not receive any response. Expected '${error.expectedResponse}'.`];
  } else {
    return [
      `Response did not contain '${error.expectedResponse}'`,
      'Responses received instead:',
      `  ${error.responsesReceived.map((m: StructuredMessage) => ` - ${m.body.text}`).join('\n')}`,
    ];
  }
}

class TestScriptSummaryBuilder {
  private readonly results: ScenarioTestResult[];

  constructor() {
    this.results = [];
  }

  public addFailedScenario(scenario: TestScriptScenario, error: Error): void {
    this.results.push({ scenario, hasPassed: false, error });
  }

  public addPassedScenario(scenario: TestScriptScenario): void {
    this.results.push({ scenario, hasPassed: true });
  }

  private buildScenarioStatuses(): string[] {
    let reportLines: string[] = [];

    for (const r of this.results) {
      if (r.hasPassed) {
        reportLines.push(chalk.green(`PASS ${r.scenario.name}`));
      } else {
        reportLines.push(chalk.red(`FAIL ${r.scenario.name}`));
      }
    }

    return reportLines;
  }

  private buildFailureSummaries(): string[] {
    const lines: string[] = [];

    const failedScenarioTests = this.results.filter((r) => !r.hasPassed);
    for (const f of failedScenarioTests) {
      lines.push(chalk.bold.red(`Failure reason for '${f.scenario.name}'`));

      if (!f.error) {
        lines.push(chalk.red('No error why why failure occurred'));
      } else {
        if (f.error instanceof TimeoutWaitingForResponseError) {
          lines.push(...createUserFriendlyErrorForTimeoutError(f.error).map((l) => chalk.red(l)));
        } else {
          lines.push(chalk.red(f.error.message));
        }
      }
      lines.push('');
    }
    return lines;
  }

  public build(): string {
    return [...this.buildScenarioStatuses(), '', ...this.buildFailureSummaries()].join('\n');
  }
}

export class Ui {
  public displayScenarioNames: boolean = false;

  /**
   * Given the extensive use of Chalk in here, this utility method makes it clear
   * that trailing newlines are safer encoded outside the Chalk string.
   *
   * @see https://github.com/ovotech/genesys-web-messaging-tester/issues/20#issuecomment-1246630078
   */
  private static trailingNewline(text: string, count = 1): string {
    return `${text}${'\n'.repeat(count)}`;
  }

  constructor(
    private readonly summaryBuilder: TestScriptSummaryBuilder = new TestScriptSummaryBuilder(),
  ) {}

  public aboutToTestScenario(scenario: TestScriptScenario): string {
    return Ui.trailingNewline(chalk.bold.white(`Testing scenario '${scenario.name}'...`));
  }

  public errorReadingTestScriptFile(error: Error): string {
    return Ui.trailingNewline(chalk.red(error.message));
  }

  public messageTranscribed(scenario: TestScriptScenario, event: TranscribedMessage): string {
    let prefix: string;
    if (this.displayScenarioNames) {
      prefix = `${scenario.name} - ${event.who}:`;
    } else {
      prefix = `${event.who}:`;
    }

    return Ui.trailingNewline(`${chalk.bold.grey(prefix)} ${chalk.grey(event.message)}`);
  }

  public validatingTestScriptFailed(error: ValidationError | undefined): string {
    return Ui.trailingNewline(chalk.red(error?.message ?? 'Failed to validate Test Script'));
  }

  public validatingSessionConfigFailed(error: ValidationError | undefined): string {
    return Ui.trailingNewline(chalk.red(error?.message ?? 'Failed to validate Session config'));
  }

  public scenarioFailed(scenario: TestScriptScenario, error: Error): string {
    this.summaryBuilder.addFailedScenario(scenario, error);

    let errorReason: string;
    if (error instanceof TimeoutWaitingForResponseError) {
      errorReason = createUserFriendlyErrorForTimeoutError(error).join('\n');
    } else {
      errorReason = `Reason for failure: ${error.message}`;
    }

    if (this.displayScenarioNames) {
      return Ui.trailingNewline(
        `${chalk.bold.red(`Scenario '${scenario.name}' failed`)}
${chalk.red(errorReason)}`,
        2,
      );
    } else {
      return Ui.trailingNewline(
        `${chalk.bold.red('Scenario failed')}
${chalk.red(errorReason)}`,
        2,
      );
    }
  }

  public scenarioPassed(scenario: TestScriptScenario): string {
    this.summaryBuilder.addPassedScenario(scenario);

    if (this.displayScenarioNames) {
      return Ui.trailingNewline(chalk.bold.green(`Scenario '${scenario.name}' passed`), 2);
    } else {
      return Ui.trailingNewline(chalk.bold.green('Scenario passed'), 2);
    }
  }

  public testScriptSummary(): string {
    return Ui.trailingNewline(
      `${chalk.bold('Scenario Test Results')}
---------------------
${this.summaryBuilder.build()}`,
    );
  }
}
