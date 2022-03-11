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
    for (const r of this.results) {
      if (!r.hasPassed) {
        lines.push(chalk.bold.red(`Failure reason for '${r.scenario.name}'`));
        if (r.error) {
          if (r.error instanceof TimeoutWaitingForResponseError) {
            lines.push(...createUserFriendlyErrorForTimeoutError(r.error).map(l => chalk.red(l)));
          } else {
            lines.push(chalk.red(r.error.message));
          }
        } else {
          lines.push(chalk.red('No error why why failure occurred'));
        }
        lines.push('');
      }
    }
    return lines;
  }

  public build(): string {
    return [...this.buildScenarioStatuses(), '', ...this.buildFailureSummaries()].join('\n');
  }
}

export class Ui {
  public displayScenarioNames: boolean = false;

  constructor(
    private readonly summaryBuilder: TestScriptSummaryBuilder = new TestScriptSummaryBuilder(),
  ) {}

  public aboutToTestScenario(scenario: TestScriptScenario): string {
    return chalk.bold.white(`Testing scenario '${scenario.name}'...\n`);
  }

  public errorReadingTestScriptFile(error: Error): string {
    return chalk.red(`${error.message}\n`);
  }

  public messageTranscribed(scenario: TestScriptScenario, event: TranscribedMessage): string {
    let prefix: string;
    if (this.displayScenarioNames) {
      prefix = `${scenario.name} - ${event.who}:`;
    } else {
      prefix = `${event.who}:`;
    }

    return `${chalk.bold.grey(prefix)} ${chalk.grey(event.message)}\n`;
  }

  public validatingTestScriptFailed(error: ValidationError | undefined): string {
    return chalk.red(error?.message ?? 'Failed to validate Test Script\n');
  }

  public validatingSessionConfigFailed(error: ValidationError | undefined): string {
    return chalk.red(error?.message ?? 'Failed to validate Session config\n');
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
      return `${chalk.bold.red(`Scenario '${scenario.name}' failed`)}
${chalk.red(errorReason)}\n\n`;
    } else {
      return `${chalk.bold.red('Scenario failed')}
${chalk.red(errorReason)}\n\n`;
    }
  }

  public scenarioPassed(scenario: TestScriptScenario): string {
    this.summaryBuilder.addPassedScenario(scenario);

    if (this.displayScenarioNames) {
      return chalk.bold.green(`Scenario '${scenario.name}' passed\n\n`);
    } else {
      return chalk.bold.green(`Scenario passed\n\n`);
    }
  }

  public testScriptSummary(): string {
    return `${chalk.bold('Scenario Test Results')}
---------------------
${this.summaryBuilder.build()}
`;
  }
}
