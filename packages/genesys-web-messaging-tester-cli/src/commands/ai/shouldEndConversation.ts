import { ChatCompletionRequestMessage } from 'openai';

export function shouldEndConversation(
  messages: ChatCompletionRequestMessage[],
  wordToIndicateEnd = 'WRONG',
):
  | {
      hasEnded: true;
      reason: string;
    }
  | { hasEnded: false } {
  wordToIndicateEnd = wordToIndicateEnd.toUpperCase();
  if (messages.length === 0) {
    return { hasEnded: false };
  }

  const lastMessage = messages.slice(-1);
  if (lastMessage.length === 1 && lastMessage[0].content === '') {
    const who = lastMessage[0].role === 'assistant' ? 'ChatGPT' : 'ChatBot';
    return {
      hasEnded: true,
      reason: `${who} didn't have a response`,
    };
  }

  const lastChatGptMsg = messages.filter((m) => m.role === 'assistant').slice(-1);
  if (
    lastChatGptMsg.length === 1 &&
    lastChatGptMsg[0].content &&
    lastChatGptMsg[0].content.toUpperCase().includes(wordToIndicateEnd)
  ) {
    return {
      hasEnded: true,
      reason: `ChatGPT indicated the bot made a mistake: ${lastChatGptMsg[0].content}`,
    };
  }

  const lastTwoChatGptMsgs = messages.filter((m) => m.role === 'assistant').slice(-2);
  if (lastTwoChatGptMsgs.length === 2) {
    const areMessagesTheSame = lastTwoChatGptMsgs[0].content === lastTwoChatGptMsgs[1].content;
    if (areMessagesTheSame) {
      return {
        hasEnded: true,
        reason: 'ChatGPT has repeated itself',
      };
    }
  }

  const lastTwoChatBotMsgs = messages.filter((m) => m.role === 'user').slice(-2);
  if (lastTwoChatBotMsgs.length === 2) {
    const areMessagesTheSame = lastTwoChatBotMsgs[0].content === lastTwoChatBotMsgs[1].content;
    if (areMessagesTheSame) {
      return {
        hasEnded: true,
        reason: 'ChatBot has repeated itself',
      };
    }
  }

  return { hasEnded: false };
}
