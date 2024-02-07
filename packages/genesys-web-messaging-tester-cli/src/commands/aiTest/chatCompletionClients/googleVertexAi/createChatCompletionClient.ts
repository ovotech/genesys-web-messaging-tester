import { helpers, protos, v1 } from '@google-cloud/aiplatform';
import { ParameterRequest, PromptRequest } from './ModelRequest';
import { ChatCompletionClient, PreflightResult, Utterance } from '../chatCompletionClient';
import { GoogleVertexAiConfig } from '../../testScript/modelTypes';

const { PredictionServiceClient } = v1;

export function createChatCompletionClient({
  location,
  project,
  temperature,
  topK,
  topP,
  seed,
  modelVersion,
}: GoogleVertexAiConfig): ChatCompletionClient {
  const version = modelVersion ? `@${modelVersion}` : '';

  const endpoint = `projects/${project}/locations/${location}/publishers/google/models/chat-bison${version}`;

  const predictionServiceClient = new PredictionServiceClient({
    apiEndpoint: `${location}-aiplatform.googleapis.com`,
  });

  const parameters = helpers.toValue({
    ...(temperature ? { temperature } : {}),
    ...(topK ? { topK } : {}),
    ...(topP ? { topP } : {}),
    ...(seed ? { seed } : {}),
  } as ParameterRequest);

  return {
    getProviderName(): string {
      return 'Google Vertex AI';
    },
    async preflightCheck(): Promise<PreflightResult> {
      const prompt: PromptRequest = {
        context: 'You help people with math problems',
        examples: [
          {
            input: { content: 'How many moons does Mars have?' },
            output: {
              content: 'The planet Mars has two moons, Phobos and Deimos.',
            },
          },
        ],
        messages: [{ author: 'student', content: 'What is 1+1?' }],
      };

      const instanceValue = helpers.toValue(prompt);

      const request: protos.google.cloud.aiplatform.v1.IPredictRequest = {
        endpoint,
        instances: [instanceValue!],
        parameters,
      };

      try {
        await predictionServiceClient.predict(request);
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          reasonForError: error instanceof Error ? error.message : String(error),
        };
      }
    },

    async predict(context: string, conversationUtterances: Utterance[]): Promise<Utterance | null> {
      const prompt: PromptRequest = {
        context,
        messages: conversationUtterances.map((u) => ({
          author: u.role,
          content: u.content,
        })),
      };
      // Google requires at least one message. This message is hopefully innocuous enough not to lead to an unexpected result.
      if (prompt.messages.length === 0) {
        prompt.messages.push({ content: '...', author: 'bot' });
      }

      const instanceValue = helpers.toValue(prompt);

      const request: protos.google.cloud.aiplatform.v1.IPredictRequest = {
        endpoint,
        instances: [instanceValue!],
        parameters,
      };

      const [response] = await predictionServiceClient.predict(request);

      for (const prediction of response?.predictions || []) {
        const candidates = prediction.structValue?.fields?.candidates;
        for (const candidate of candidates?.listValue?.values || []) {
          const content = candidate.structValue?.fields?.content?.stringValue;
          const author = candidate.structValue?.fields?.author?.stringValue;
          if (author && content) {
            return { content: content, role: author as unknown as any };
          }
        }
      }

      return null;
    },
  };
}
