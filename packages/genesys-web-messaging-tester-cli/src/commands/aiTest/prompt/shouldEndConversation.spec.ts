import { shouldEndConversation } from './shouldEndConversation';

test('conversation ended when ChatGPT says special word', () => {
  const wordToIndicateEnd = 'WRONG';
  const shouldEnd = shouldEndConversation(
    [
      {
        role: 'customer',
        content: 'Hello',
      },
      {
        role: 'bot',
        content: 'Hi',
      },
      {
        role: 'customer',
        content: `${wordToIndicateEnd} - This has gone wrong`,
      },
    ],
    [wordToIndicateEnd],
    [],
  );

  expect(shouldEnd).toStrictEqual({
    hasEnded: true,
    reason: {
      type: 'fail',
      description: 'Terminating phrase found in response: WRONG - This has gone wrong',
    },
  });
});
