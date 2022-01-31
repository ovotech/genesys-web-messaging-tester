import chalk from 'chalk';
import { TestScriptScenario } from './testScript/parseTestScript';
import { TranscribedMessage } from '@ovotech/genesys-web-messaging-tester';
import { ValidationError } from 'joi';

interface ScenarioTestResult {
  scenario: TestScriptScenario;
  hasPassed: boolean;
}

class TestScriptSummaryBuilder {
  private readonly results: ScenarioTestResult[];

  constructor() {
    this.results = [];
  }

  public addFailedScenario(scenario: TestScriptScenario): void {
    this.results.push({ scenario, hasPassed: false });
  }

  public addPassedScenario(scenario: TestScriptScenario): void {
    this.results.push({ scenario, hasPassed: true });
  }

  public build(): string {
    let reportLines: string[] = [];

    for (const r of this.results) {
      if (r.hasPassed) {
        reportLines.push(chalk.green(`PASS ${r.scenario.name}`));
      } else {
        reportLines.push(chalk.red(`FAIL ${r.scenario.name}`));
      }
    }

    return reportLines.join('\n');
  }
}

export class Ui {
  constructor(
    private readonly summaryBuilder: TestScriptSummaryBuilder = new TestScriptSummaryBuilder(),
  ) {}

  public aboutToTestScenario(scenario: TestScriptScenario): string {
    return chalk.bold.white(`Testing scenario '${scenario.name}'...\n`);
  }

  public errorReadingTestScriptFile(error: Error): string {
    return `${error.message}\n`;
  }

  public messageTranscribed(event: TranscribedMessage): string {
    return `${chalk.bold.grey(`${event.who}:`)} ${chalk.grey(event.message)}\n`;
  }

  public validatingTestScriptFailed(error: ValidationError | undefined): string {
    return chalk.red(error?.message ?? 'Failed to validate Test Script\n');
  }

  public validatingSessionConfigFailed(error: ValidationError | undefined): string {
    return chalk.red(error?.message ?? 'Failed to validate Session config\n');
  }

  public scenarioFailed(scenario: TestScriptScenario, error: Error): string {
    this.summaryBuilder.addFailedScenario(scenario);

    return `${chalk.bold.red('Scenario failed')}
${chalk.red(`Reason for failure: ${error.message}\n\n`)}`;
  }

  public scenarioPassed(scenario: TestScriptScenario): string {
    this.summaryBuilder.addPassedScenario(scenario);

    return chalk.bold.green(`Scenario passed\n\n`);
  }

  public testScriptSummary(): string {
    return `${chalk.bold('Scenario Test Results')}
---------------------
${this.summaryBuilder.build()}
`;
  }
}
