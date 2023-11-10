import { TranscribedMessage } from '@ovotech/genesys-web-messaging-tester';

function createPromptTranscript(transcript: TranscribedMessage[]): string {
  return transcript
    .map((t) => {
      const who = t.who === 'You' ? 'AI' : 'Chatbot';
      return `${who}: ${t.message}`;
    })
    .join('\n');
}

export function substituteTemplatePlaceholders(
  prompt: string,
  transcript: TranscribedMessage[],
): string {
  return prompt.replace(/%TRANSCRIPT%/i, createPromptTranscript(transcript));
}
