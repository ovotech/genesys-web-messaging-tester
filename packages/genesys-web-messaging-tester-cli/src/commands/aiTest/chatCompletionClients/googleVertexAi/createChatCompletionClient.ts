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
  examples,
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
        ...(examples
          ? {
              examples: examples.map(({ input, output }) => ({
                input: { content: input },
                output: { content: output },
              })),
            }
          : {}),
        messages: [
          // Google requires at least one message. This message is hopefully innocuous enough not to lead to an unexpected result.
          { content: '...', author: 'bot' },
          ...conversationUtterances.map((u) => ({
            author: u.role,
            content: u.content,
          })),
        ],
      };

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
          // const author = candidate.structValue?.fields?.author?.stringValue;
          if (content) {
            return { content: content.trim(), role: 'customer' };
          }
        }
      }

      return null;
    },
  };
}
