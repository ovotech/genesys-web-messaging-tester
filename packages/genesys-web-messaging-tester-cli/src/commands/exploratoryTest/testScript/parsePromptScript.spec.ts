import { extractExploratoryTestScenarios, TestPromptFile } from './parsePromptScript';

test('prompts converted', () => {
  const testScriptFile: TestPromptFile = {
    scenarios: {
      'test-name-of-test-1': {
        setup: {
          prompt: 'test-prompt-1',
          terminatingPhrases: {
            fail: ['test-failing-response-1'],
            pass: ['test-passing-prompt-1'],
          },
        },
      },
      'test-name-of-test-2': {
        setup: {
          prompt: 'test-prompt-2',
          terminatingPhrases: {
            fail: ['test-failing-response-2'],
            pass: ['test-passing-prompt-2'],
          },
        },
      },
    },
  };

  expect(
    extractExploratoryTestScenarios(testScriptFile, {
      deploymentId: 'test-deployment-id',
      region: 'test-region',
    }),
  ).toStrictEqual([
    {
      sessionConfig: {
        deploymentId: 'test-deployment-id',
        region: 'test-region',
      },
      name: 'test-name-of-test-1',
      setup: {
        prompt: 'test-prompt-1',
        terminatingPhrases: {
          fail: ['test-failing-response-1'],
          pass: ['test-passing-prompt-1'],
        },
      },
    },
    {
      sessionConfig: {
        deploymentId: 'test-deployment-id',
        region: 'test-region',
      },
      name: 'test-name-of-test-2',
      setup: {
        prompt: 'test-prompt-2',
        terminatingPhrases: {
          fail: ['test-failing-response-2'],
          pass: ['test-passing-prompt-2'],
        },
      },
    },
  ]);
});
