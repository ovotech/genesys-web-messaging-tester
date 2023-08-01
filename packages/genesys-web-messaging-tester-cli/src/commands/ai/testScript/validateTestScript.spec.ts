import { validatePromptScript } from './validateTestScript';

test('Valid', () => {
  const validationResponse = validatePromptScript({
    config: {
      deploymentId: 'test-deployment-id',
      region: 'test-region',
    },
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
  });
  expect(validationResponse).toStrictEqual({
    validTestScript: {
      config: {
        deploymentId: 'test-deployment-id',
        region: 'test-region',
      },
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
    },
  });
});

test('Invalid', () => {
  const validationResponse = validatePromptScript({
    config: {
      deploymentId: 'test-deployment-id',
      region: 'test-region',
    },
    prompts: {
      'test-name-of-test-1': {
        prompt: 'test-prompt-1',
        terminatingResponses: {
          passing: ['test-passing-prompt-1'],
        },
      },
    },
  });
  expect(validationResponse).toMatchObject({
    error: {
      details: [
        {
          context: {
            key: 'failing',
            label: 'prompts.test-name-of-test-1.terminatingResponses.failing',
          },
          message: '"prompts.test-name-of-test-1.terminatingResponses.failing" is required',
          path: ['prompts', 'test-name-of-test-1', 'terminatingResponses', 'failing'],
          type: 'any.required',
        },
      ],
    },
  });
});
