import { extractAiTestScenarios, TestPromptFile } from './parsePromptScript';

test('prompts converted', () => {
  const testScriptFile: TestPromptFile = {
    scenarios: {
      'test-name-of-test-1': {
        setup: {
          prompt: 'test-prompt-1',
          terminatingPhrases: {
            fail: ['test-failing-phrase-1'],
            pass: ['test-passing-phrase-1'],
          },
        },
      },
      'test-name-of-test-2': {
        setup: {
          prompt: 'test-prompt-2',
          terminatingPhrases: {
            fail: ['test-failing-phrase-2'],
            pass: ['test-passing-phrase-2'],
          },
        },
        followUp: {
          prompt: 'test-prompt-3',
          terminatingPhrases: {
            fail: ['test-failing-phrase-3'],
            pass: ['test-passing-phrase-3'],
          },
        },
      },
    },
  };

  expect(
    extractAiTestScenarios(testScriptFile, {
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
          fail: ['test-failing-phrase-1'],
          pass: ['test-passing-phrase-1'],
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
          fail: ['test-failing-phrase-2'],
          pass: ['test-passing-phrase-2'],
        },
      },
      followUp: {
        prompt: 'test-prompt-3',
        terminatingPhrases: {
          fail: ['test-failing-phrase-3'],
          pass: ['test-passing-phrase-3'],
        },
      },
    },
  ]);
});
