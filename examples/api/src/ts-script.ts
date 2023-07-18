import {
  Conversation,
  WebMessengerGuestSession,
  Transcriber,
} from '@ovotech/genesys-web-messaging-tester';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '../../.env' });

(async () => {
  // << test-section
  const session = new WebMessengerGuestSession({
    deploymentId: process.env.DEPLOYMENT_ID!,
    region: process.env.REGION!,
  });

  new Transcriber(session).on('messageTranscribed', (i) => console.log(i.toString()));

  const convo = new Conversation(session);

  // Wait for the conversation to start before sending the message
  await convo.waitForConversationToStart();

  await convo.sendText('hi');

  // Waits for response containing text. Error thrown if exceeds timeout
  await convo.waitForResponseWithTextContaining(
    'Can we ask you some questions about your experience today?',
    {
      timeoutInSeconds: 10,
      caseInsensitive: true,
    },
  );

  await convo.sendText('Yes');
  // test-section

  await convo.waitForResponseWithTextMatchingPattern(
    new RegExp(/Thank you! Now for the next question[.]+/, 'im'),
    {
      timeoutInSeconds: 10,
    },
  );

  session.close();
})().catch((e) => {
  throw e;
});
