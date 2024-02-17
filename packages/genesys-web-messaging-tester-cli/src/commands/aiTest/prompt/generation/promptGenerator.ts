import { AiScenarioFollowUpSection } from '../../testScript/modelTypes';
import { replacePlaceholders } from './replacePlaceholders';

export interface PromptGeneratorResult {
  placeholderValues: Record<string, string>;
  prompt: string;
}

export function promptGenerator(
  scenario: Pick<AiScenarioFollowUpSection, 'prompt' | 'placeholders'>,
  updatePrompt: typeof replacePlaceholders = replacePlaceholders,
  randomIndex = (max: number) => Math.floor(Math.random() * max),
): PromptGeneratorResult {
  if (!scenario.placeholders) {
    return {
      placeholderValues: {},
      prompt: scenario.prompt,
    };
  }

  const chosenValues: Record<string, string> = Object.fromEntries(
    Object.entries(scenario.placeholders)
      .filter(([, values]) => values.length > 0)
      .map(([placeholder, values]) => {
        return [placeholder, values[randomIndex(values.length)]];
      }),
  );

  return {
    placeholderValues: chosenValues,
    prompt: updatePrompt(scenario.prompt, chosenValues),
  };
}
