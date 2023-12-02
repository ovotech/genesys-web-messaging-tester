import { OpenAI } from 'openai';
import { containsTerminatingPhrases } from './containsTerminatingPhrases';

interface Reason {
  type: 'fail' | 'pass';
  description: string;
}

export interface ShouldEndConversationEndedResult {
  hasEnded: true;
  reason: Reason;
}

export interface ShouldEndConversationNotEndedResult {
  hasEnded: false;
}

export type ShouldEndConversationResult =
  | ShouldEndConversationEndedResult
  | ShouldEndConversationNotEndedResult;

export function shouldEndConversation(
  messages: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[],
  failPhrases: string[],
  passPhrases: string[],
): ShouldEndConversationResult {
  if (messages.length === 0) {
    return { hasEnded: false };
  }

  const lastMessage = messages.slice(-1);
  if (lastMessage.length === 1 && lastMessage[0].content === '') {
    const who = lastMessage[0].role === 'assistant' ? 'ChatGPT' : 'Chatbot';
    return {
      hasEnded: true,
      reason: { type: 'fail', description: `${who} didn't have a response` },
    };
  }

  const lastChatGptMsg = messages.filter((m) => m.role === 'assistant').slice(-1);

  if (lastChatGptMsg[0]?.content) {
    const phraseResult = containsTerminatingPhrases(lastChatGptMsg[0].content, {
      pass: passPhrases,
      fail: failPhrases,
    });

    if (phraseResult.phraseFound) {
      return {
        hasEnded: true,
        reason: {
          type: phraseResult.phraseIndicates,
          description: `Terminating phrase found in response: '${lastChatGptMsg[0].content}'`,
        },
      };
    }
  }

  // const lastTwoChatGptMsgs = messages.filter((m) => m.role === 'assistant').slice(-2);
  // if (lastTwoChatGptMsgs.length === 2) {
  //   const areMessagesTheSame = lastTwoChatGptMsgs[0].content === lastTwoChatGptMsgs[1].content;
  //   if (areMessagesTheSame) {
  //     return {
  //       hasEnded: true,
  //       reason: {
  //         type: 'fail',
  //         description: 'AI has repeated itself',
  //       },
  //     };
  //   }
  // }

  const lastTwoChatBotMsgs = messages.filter((m) => m.role === 'user').slice(-2);
  if (lastTwoChatBotMsgs.length === 2) {
    const areMessagesTheSame = lastTwoChatBotMsgs[0].content === lastTwoChatBotMsgs[1].content;
    if (areMessagesTheSame) {
      return {
        hasEnded: true,

        reason: {
          type: 'fail',
          description: 'The Chatbot repeated itself',
        },
      };
    }
  }

  return { hasEnded: false };
}
