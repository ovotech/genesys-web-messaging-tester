export interface AiScenarioSetupSection {
  readonly prompt: string;
  readonly terminatingPhrases: {
    readonly pass: string[];
    readonly fail: string[];
  };
}

export interface AiScenarioFollowUpSection {
  readonly prompt: string;
  readonly placeholders?: Record<string, string[]>;
  readonly terminatingPhrases: {
    readonly pass: string[];
    readonly fail: string[];
  };
}

export interface AiScenarioSection {
  setup: AiScenarioSetupSection;
  followUp?: AiScenarioFollowUpSection;
}

export enum SupportedAiProviders {
  ChatGpt = 'chatgpt',
  GoogleVertexAi = 'google-vertex-ai',
}

export interface GoogleVertexAiConfig {
  location: string;
  project: string;
  /**
   * The temperature is used for sampling during response generation, which occurs when topP and topK are applied. Temperature controls the degree of randomness in token selection. Lower temperatures are good for prompts that require a less open-ended or creative response, while higher temperatures can lead to more diverse or creative results. A temperature of 0 means that the highest probability tokens are always selected. In this case, responses for a given prompt are mostly deterministic, but a small amount of variation is still possible.
   * If the model returns a response that's too generic, too short, or the model gives a fallback response, try increasing the temperature.
   *
   * @see https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-chat#generative-ai-text-chat-nodejs:~:text=content%22%3A%20%22user%20message%22%0A%7D%5D-,temperature,-The%20temperature%20is
   */
  temperature?: number;
  /**
   * Top-K changes how the model selects tokens for output. A top-K of 1 means the next selected token is the most probable among all tokens in the model's vocabulary (also called greedy decoding), while a top-K of 3 means that the next token is selected from among the three most probable tokens by using temperature.
   * For each token selection step, the top-K tokens with the highest probabilities are sampled. Then tokens are further filtered based on top-P with the final token selected using temperature sampling.
   *
   * Specify a lower value for less random responses and a higher value for more random responses.
   *
   * @see https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-chat#generative-ai-text-chat-nodejs:~:text=Default%3A%201024-,topK,-Top%2DK%20changes
   */
  topK?: number;
  /**
   * Top-P changes how the model selects tokens for output. Tokens are selected from the most (see top-K) to least probable until the sum of their probabilities equals the top-P value. For example, if tokens A, B, and C have a probability of 0.3, 0.2, and 0.1 and the top-P value is 0.5, then the model will select either A or B as the next token by using temperature and excludes C as a candidate.
   * Specify a lower value for less random responses and a higher value for more random responses.
   *
   * @see https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-chat#generative-ai-text-chat-nodejs:~:text=Default%3A%2040-,topP,-Top%2DP%20changes
   */
  topP?: number;
  /**
   * Decoder generates random noise with a pseudo random number generator, temperature * noise is added to logits before sampling. The pseudo random number generator (prng) takes a seed as input, it generates the same output with the same seed.
   * If seed is not set, the seed used in decoder will not be deterministic, thus the generated random noise will not be deterministic. If seed is set, the generated random noise will be deterministic.
   *
   * @see https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/text-chat#generative-ai-text-chat-nodejs:~:text=Maximum%20value%3A%20100-,seed,-Decoder%20generates%20random
   */
  seed?: number;
  modelVersion?: string;

  /**
   * Examples for chat prompts are a list of input-output pairs that demonstrate exemplary model output for a given input. Use examples to customize how the model responds to certain questions.
   *
   * @see https://cloud.google.com/vertex-ai/docs/generative-ai/chat/chat-prompts#examples
   */
  examples?: { input: string; output: string }[];
}

export interface ChatGptConfig {
  model?: string;
  /**
   * This value can be between 0 and 1 and controls the randomness of ChatGPT's completions.
   * 0 = Responses will be deterministic and repetitive
   *     ChatGPT will favour words (tokens) that have the highest probability of coming next in the text it is constructing
   * 1 = Responses will include more variety and creativity
   *     ChatGPT will consider using words (tokens) that are less likely to come next in the text it is constructing
   *
   * @see https://platform.openai.com/docs/quickstart/adjust-your-settings
   */
  temperature?: number;
}

export interface TestPromptFileBase<AiProviderConfig> {
  readonly config: {
    readonly deploymentId?: string;
    readonly region?: string;
    readonly origin?: string;
    readonly ai: AiProviderConfig;
  };
  readonly scenarios: {
    [name: string]: AiScenarioSection;
  };
}

export interface GoogleVertexAiConfigSection {
  readonly provider: SupportedAiProviders.GoogleVertexAi;
  readonly config: GoogleVertexAiConfig;
}

export interface ChatGptConfigSection {
  readonly provider: SupportedAiProviders.ChatGpt;
  readonly config?: ChatGptConfig;
}

export type TestPromptFile =
  | TestPromptFileBase<GoogleVertexAiConfigSection>
  | TestPromptFileBase<ChatGptConfigSection>;
