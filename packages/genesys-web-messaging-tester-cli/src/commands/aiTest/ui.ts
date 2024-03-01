import chalk from 'chalk';
import { ValidationError } from 'joi';
import { ShouldEndConversationEndedResult } from './prompt/shouldEndConversation';
import { TranscribedMessage } from '@ovotech/genesys-web-messaging-tester';
import { PreflightError } from './chatCompletionClients/chatCompletionClient';
import { PromptGeneratorResult } from './prompt/generation/promptGenerator';
import { SaveOutputJsResultFailed } from './output/saveOutputJson';

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

  public errorDeterminingAiProvider(): string {
    return Ui.trailingNewline(chalk.red(`AI provider was not recognised`));
  }

  public validatingGcpProjectLocationConfigFailed(error: ValidationError | undefined): string {
    return Ui.trailingNewline(
      chalk.red(
        error?.message ??
          'Failed to validate Google Vertex AI Location and Project config. Provide these in the config file or via environment variables.',
      ),
    );
  }

  public errorReadingTestScriptFile(error: Error): string {
    return Ui.trailingNewline(chalk.red(error.message));
  }

  public validatingPromptScriptFailed(error: ValidationError | undefined): string {
    return Ui.trailingNewline(chalk.red(error?.message ?? 'Failed to validate Prompt Script'));
  }

  public preflightCheckFailure(aiProvider: string, error: PreflightError): string {
    return Ui.trailingNewline(
      chalk.red(
        `The check to ensure ${aiProvider} can be used failed due to:\n${error.reasonForError}`,
      ),
    );
  }

  public displayPlaceholders({ placeholderValues }: PromptGeneratorResult): string {
    const values = Object.entries(placeholderValues);
    return Ui.trailingNewline(
      chalk.grey(values.map(([key, value]) => `${key}: ${value}`).join('\n')),
      2,
    );
  }

  public conversationStartHeader(): string {
    return Ui.trailingNewline(['Conversation', '------------'].join('\n'));
  }

  public testResult(result: ShouldEndConversationEndedResult): string {
    const resultMessage =
      result.reason.type === 'pass'
        ? [chalk.bold.green('PASSED'), chalk.green(result.reason.description)]
        : [chalk.bold.red('FAILED'), chalk.red(result.reason.description)];

    return Ui.trailingNewline(['\n---------------------', ...resultMessage].join('\n'));
  }

  public messageTranscribed(msg: TranscribedMessage): string {
    const utterance = `${msg.who}: ${msg.message}`;
    if (msg.who === 'AI') {
      return Ui.trailingNewline(chalk.bold.green(utterance));
    } else {
      return Ui.trailingNewline(utterance);
    }
  }

  public savingOutputFailed(result: SaveOutputJsResultFailed): string {
    return Ui.trailingNewline(
      chalk.yellow(['\nFailed to save output file:', result.reasonForFailure].join('\n')),
    );
  }
}
