import { extractPrompts, TestScriptFile } from './parseTestScript';

test('prompts converted', () => {
  const testScriptFile: TestScriptFile = {
    prompts: {
      'test-name-of-test-1': {
        prompt: 'test-prompt-1',
        terminatingResponses: {
          failing: ['test-failing-response-1'],
          passing: ['test-passing-prompt-1'],
        },
      },
      'test-name-of-test-2': {
        prompt: 'test-prompt-2',
        terminatingResponses: {
          failing: ['test-failing-response-2'],
          passing: ['test-passing-prompt-2'],
        },
      },
    },
  };

  expect(
    extractPrompts(testScriptFile, {
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
      prompt: 'test-prompt-1',
      terminatingResponses: {
        failing: ['test-failing-response-1'],
        passing: ['test-passing-prompt-1'],
      },
    },
    {
      sessionConfig: {
        deploymentId: 'test-deployment-id',
        region: 'test-region',
      },
      name: 'test-name-of-test-2',
      prompt: 'test-prompt-2',
      terminatingResponses: {
        failing: ['test-failing-response-2'],
        passing: ['test-passing-prompt-2'],
      },
    },
  ]);
});
