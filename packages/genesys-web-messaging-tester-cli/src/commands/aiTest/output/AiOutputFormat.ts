export interface AiOutputFormat {
  reasonForEnd: { type: 'fail' | 'pass'; description?: string };
  placeholderValues: Record<string, string>;
  prompt: string;
  transcript: { role: string; content: string }[];
}
