/**
 * @see https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-chat#request_body
 */
export interface PromptRequest {
  context: string;
  examples?: {
    input: { content: string };
    output: { content: string };
  }[];
  messages: {
    author: string;
    content: string;
  }[];
}

/**
 * @see https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-chat#request_body
 */
export interface ParameterRequest {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
  groundingConfig?: string;
  stopSequences?: string[];
  candidateCount?: number;
  logprobs?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  logitBias?: string;
  seed?: number;
}
