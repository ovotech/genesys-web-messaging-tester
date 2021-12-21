import { StructuredMessage } from './genesys/StructuredMessage';
import { compareTwoStrings } from 'string-similarity';

export interface When {
  readonly describe: string;
  compare(message: StructuredMessage): boolean;
}

export function similarTo(similarText: string, similarityThreshold = 0.8): When {
  return {
    describe: `similar to '${similarText}'`,
    compare(message: StructuredMessage) {
      const value = compareTwoStrings(similarText, message.body.text);
      return value >= similarityThreshold;
    },
  };
}

export function is(text: string): When {
  const normalised = text.trim();

  return {
    describe: `is '${text}'`,
    compare(message: StructuredMessage) {
      return normalised === message.body.text;
    },
  };
}
