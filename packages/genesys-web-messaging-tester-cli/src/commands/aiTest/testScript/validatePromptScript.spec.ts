import { validatePromptScript } from './validatePromptScript';

test('Valid', () => {
  const validationResponse = validatePromptScript({
    config: {
      deploymentId: 'test-deployment-id',
      region: 'test-region',
    },
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
  });
  expect(validationResponse).toStrictEqual({
    validPromptScript: {
      config: {
        deploymentId: 'test-deployment-id',
        region: 'test-region',
      },
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
    },
  });
});

test('Invalid', () => {
  const validationResponse = validatePromptScript({
    config: {
      deploymentId: 'test-deployment-id',
      region: 'test-region',
    },
    scenarios: {
      'test-name-of-test-1': {
        setup: {
          prompt: 'test-prompt-1',
          terminatingPhrases: {
            pass: ['test-passing-prompt-1'],
          },
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
            label: 'scenarios.test-name-of-test-1.setup.terminatingPhrases.fail',
          },
          message: '"scenarios.test-name-of-test-1.setup.terminatingPhrases.fail" is required',
          path: ['scenarios', 'test-name-of-test-1', 'setup', 'terminatingPhrases', 'fail'],
          type: 'any.required',
        },
      ],
    },
  });
});