import { validatePromptScript } from './validatePromptScript';

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
          fail: ['test-failing-response-1'],
          pass: ['test-passing-prompt-1'],
        },
      },
      'test-name-of-test-2': {
        prompt: 'test-prompt-2',
        terminatingResponses: {
          fail: ['test-failing-response-2'],
          pass: ['test-passing-prompt-2'],
        },
      },
    },
  });
  expect(validationResponse).toStrictEqual({
    validPromptScript: {
      config: {
        deploymentId: 'test-deployment-id',
        region: 'test-region',
      },
      prompts: {
        'test-name-of-test-1': {
          prompt: 'test-prompt-1',
          terminatingResponses: {
            fail: ['test-failing-response-1'],
            pass: ['test-passing-prompt-1'],
          },
        },
        'test-name-of-test-2': {
          prompt: 'test-prompt-2',
          terminatingResponses: {
            fail: ['test-failing-response-2'],
            pass: ['test-passing-prompt-2'],
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
          pass: ['test-passing-prompt-1'],
        },
      },
    },
  });
  expect(validationResponse).toMatchObject({
    error: {
      details: [
        {
          context: {
            key: 'fail',
            label: 'prompts.test-name-of-test-1.terminatingResponses.fail',
          },
          message: '"prompts.test-name-of-test-1.terminatingResponses.fail" is required',
          path: ['prompts', 'test-name-of-test-1', 'terminatingResponses', 'fail'],
          type: 'any.required',
        },
      ],
    },
  });
});
