import { TranscribedMessage } from '@ovotech/genesys-web-messaging-tester';
import { substituteTemplatePlaceholders } from './substituteTemplatePlaceholders';

test('Replaces transcript placeholder', () => {
  const transcript: TranscribedMessage[] = [
    {
      who: 'You',
      message: 'Hello',
      toString: () => '',
    },
    {
      who: 'Them',
      message: 'Hi',
      toString: () => '',
    },
  ];
  const followUpPrompt = `Hello world.
Below is the transcript:
%TRANSCRIPT%
`;

  const newPrompt = substituteTemplatePlaceholders(followUpPrompt, transcript);

  expect(newPrompt).toStrictEqual(`Hello world.
Below is the transcript:
AI: Hello
Chatbot: Hi
`);
});

test('Transcript placeholder case insensitive', () => {
  const transcript: TranscribedMessage[] = [
    {
      who: 'You',
      message: 'Hello',
      toString: () => '',
    },
  ];
  const followUpPrompt = `Hello world.
Below is the transcript:
%transcript%
`;

  const newPrompt = substituteTemplatePlaceholders(followUpPrompt, transcript);

  expect(newPrompt).toStrictEqual(`Hello world.
Below is the transcript:
AI: Hello
`);
});
