import { shouldEndConversation } from './shouldEndConversation';

test('conversation ended when ChatGPT says special word', () => {
  const wordToIndicateEnd = 'WRONG';
  const shouldEnd = shouldEndConversation(
    [
      {
        role: 'system',
        content: 'Say hello',
      },
      {
        role: 'assistant',
        content: 'Hello',
      },
      {
        role: 'user',
        content: 'Hi',
      },
      {
        role: 'assistant',
        content: `${wordToIndicateEnd} - This has gone wrong`,
      },
    ],
    wordToIndicateEnd,
  );

  expect(shouldEnd).toStrictEqual({
    hasEnded: true,
    reason: 'ChatGPT indicated the bot made a mistake: WRONG - This has gone wrong',
  });
});
