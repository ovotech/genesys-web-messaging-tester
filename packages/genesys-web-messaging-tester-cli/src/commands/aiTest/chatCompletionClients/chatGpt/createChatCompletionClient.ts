import { ChatCompletionClient, PreflightResult, Utterance } from '../chatCompletionClient';
import { OpenAI } from 'openai';
import { ChatGptConfig } from '../../testScript/modelTypes';

type ChatCompletionMessage = OpenAI.Chat.Completions.CreateChatCompletionRequestMessage;

export function createChatCompletionClient(
  { model = 'gpt-3.5-turbo', temperature }: ChatGptConfig,
  apiKey: string,
  maxRetries = 5,
): ChatCompletionClient {
  const chatCompletion = new OpenAI({ apiKey, maxRetries }).chat.completions;

  return {
    getProviderName(): string {
      return 'ChatGPT';
    },
    async preflightCheck(): Promise<PreflightResult> {
      try {
        await chatCompletion.create({
          model,
          n: 1, // Number of choices
          temperature: 0,
          messages: [
            {
              role: 'system',
              content: 'You help people with math problems',
            },
            {
              role: 'user',
              content: 'What is 1+1?',
            },
          ],
        });

        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          reasonForError: error instanceof Error ? error.message : String(error),
        };
      }
    },

    async predict(context: string, conversationUtterances: Utterance[]): Promise<Utterance | null> {
      const messages: ChatCompletionMessage[] = [
        {
          role: 'system',
          content: context,
        },
        ...conversationUtterances.map<ChatCompletionMessage>((u) => ({
          role: u.role === 'bot' ? 'user' : 'assistant',
          content: u.content,
        })),
      ];

      const { choices } = await chatCompletion.create({
        model,
        n: 1, // Number of choices
        temperature,
        messages,
      });

      if (choices[0]?.message?.content) {
        return { role: 'customer', content: choices[0].message.content };
      } else {
        return null;
      }
    },
  };
}
