export interface PreflightError {
  reasonForError: string;
  ok: false;
}

export interface PreflightSuccess {
  ok: true;
}

export type PreflightResult = PreflightError | PreflightSuccess;

export interface Utterance {
  role: 'customer' | 'bot';
  content: string;
}

export interface ChatCompletionClient {
  getProviderName(): string;
  predict(context: string, conversationUtterances: Utterance[]): Promise<Utterance | null>;
  preflightCheck(): Promise<PreflightResult>;
}
