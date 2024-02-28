import { promptGenerator } from './promptGenerator';
import { AiScenarioSetupSection } from '../../testScript/modelTypes';

test('Placeholders are replaced if value present', () => {
  const scenario: Pick<AiScenarioSetupSection, 'prompt' | 'placeholders'> = {
    placeholders: {
      FIRST_NAME: ['John'],
      SECOND_NAME: ['Doe'],
    },
    prompt: 'Your first name is {FIRST_NAME} and your second name is {SECOND_NAME}',
  };

  expect(promptGenerator(scenario)).toStrictEqual({
    prompt: 'Your first name is John and your second name is Doe',
    placeholderValues: { FIRST_NAME: 'John', SECOND_NAME: 'Doe' },
  });
});

test('Placeholders ignored if no values present', () => {
  const scenario: Pick<AiScenarioSetupSection, 'prompt' | 'placeholders'> = {
    placeholders: {
      FIRST_NAME: [],
    },
    prompt: 'Your first name is {FIRST_NAME}',
  };

  expect(promptGenerator(scenario)).toStrictEqual({
    prompt: 'Your first name is {FIRST_NAME}',
    placeholderValues: {},
  });
});

test('Original prompt returned if placeholder values not present', () => {
  const scenario: Pick<AiScenarioSetupSection, 'prompt' | 'placeholders'> = {
    prompt: 'Your first name is {FIRST_NAME}',
  };

  expect(promptGenerator(scenario)).toStrictEqual({
    prompt: 'Your first name is {FIRST_NAME}',
    placeholderValues: {},
  });
});
