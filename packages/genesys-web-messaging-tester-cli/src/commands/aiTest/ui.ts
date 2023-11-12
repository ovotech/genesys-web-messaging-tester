import chalk from 'chalk';
import { ValidationError } from 'joi';
import { ShouldEndConversationEndedResult } from './prompt/shouldEndConversation';
import { TranscribedMessage } from '@ovotech/genesys-web-messaging-tester';
import { PhraseFound } from './prompt/containsTerminatingPhrases';

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

  public validatingOpenAiEnvValidationFailed(error: ValidationError | undefined): string {
    return Ui.trailingNewline(
      chalk.red(
        error?.message ??
          'Failed to validate environment variables containing Genesys OAuth Client credentials',
      ),
    );
  }

  public onlyOnePromptSupported(totalPrompts: number): string {
    return Ui.trailingNewline(
      chalk.red(`Only one prompt is currently supported. You have defined ${totalPrompts}`),
    );
  }

  public validatingSessionConfigFailed(error: ValidationError | undefined): string {
    return Ui.trailingNewline(chalk.red(error?.message ?? 'Failed to validate Session config'));
  }

  public errorReadingTestScriptFile(error: Error): string {
    return Ui.trailingNewline(chalk.red(error.message));
  }

  public validatingPromptScriptFailed(error: ValidationError | undefined): string {
    return Ui.trailingNewline(chalk.red(error?.message ?? 'Failed to validate Prompt Script'));
  }

  public testResult(result: ShouldEndConversationEndedResult): string {
    const resultMessage =
      result.reason.type === 'pass'
        ? [chalk.bold.green('PASSED'), chalk.green(result.reason.description)]
        : [chalk.bold.red('FAILED'), chalk.red(result.reason.description)];

    return Ui.trailingNewline(['\n---------------------', ...resultMessage].join('\n'));
  }

  public messageTranscribed(msg: TranscribedMessage): string {
    if (msg.who === 'You') {
      console.log(chalk.bold.green(`AI: ${msg.message}`));
    } else {
      console.log(`Chatbot: ${msg.message}`);
    }
    return Ui.trailingNewline(`${chalk.bold.grey(`${msg.who}:`)} ${chalk.grey(msg.message)}`);
  }

  public followUpDetailsUnderDevelopment(): string {
    return Ui.trailingNewline(
      chalk.bold.yellow('Follow up definitions ignored, as functionality is under development'),
    );
  }

  public followUpDetails(feedback: string): string {
    return Ui.trailingNewline(['\n---------------------', feedback].join('\n'));
  }

  public followUpResult(result: PhraseFound): string {
    const resultMessage =
      result.phraseIndicates === 'fail'
        ? chalk.bold.red(`FAILED: ${result.subject}`)
        : chalk.bold.green(`PASSED: ${result.subject}`);

    return Ui.trailingNewline(['\n---------------------', resultMessage].join('\n'));
  }
}
