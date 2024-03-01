import { ShouldEndConversationEndedResult } from '../prompt/shouldEndConversation';
import { writeFileSync } from 'node:fs';
import { AiOutputFormat } from './AiOutputFormat';
import { PromptGeneratorResult } from '../prompt/generation/promptGenerator';
import path from 'node:path';
import { Utterance } from '../chatCompletionClients/chatCompletionClient';
import { createFilename } from './createFilename';

export interface SaveOutputJsResultSuccess {
  successful: true;
  outputFilePath: string;
}

export interface SaveOutputJsResultFailed {
  successful: false;
  reasonForFailure: string;
}

export type SaveOutputJsResult = SaveOutputJsResultSuccess | SaveOutputJsResultFailed;

export function saveOutputJs(
  scenarioName: string,
  result: {
    messages: Utterance[];
    generatedPrompt: PromptGeneratorResult;
    result: ShouldEndConversationEndedResult;
  },
  outputDir: string,
  fsWriteFileSync: typeof writeFileSync,
): SaveOutputJsResult {
  const output: AiOutputFormat = {
    placeholderValues: result.generatedPrompt.placeholderValues,
    prompt: result.generatedPrompt.prompt,
    reasonForEnd: {
      type: result.result.reason.type,
      description: result.result.reason.description,
    },
    transcript: result.messages,
  };

  const outputFilePath = path.join(outputDir, `${createFilename(scenarioName)}.json`);
  try {
    fsWriteFileSync(outputFilePath, JSON.stringify(output, null, 2));
  } catch (e) {
    return {
      successful: false,
      reasonForFailure: e instanceof Error ? e.message : String(e),
    };
  }

  return { successful: true, outputFilePath };
}
