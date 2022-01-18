import {
  Conversation,
  WebMessengerGuestSession,
  Transcriber,
} from '@ovotech/genesys-web-messaging-tester';

require('dotenv').config();

(async () => {
  // << test-section
  const session = new WebMessengerGuestSession({
    deploymentId: process.env.DEPLOYMENT_ID!,
    region: process.env.REGION!,
  });

  new Transcriber(session).on('messageTranscribed', (i) => console.log(`${i}`));

  const convo = new Conversation(session);

  // Wait for the conversation to start before sending the message
  await convo.waitForConversationToStart();

  convo.sendText('hi');

  // Waits for response containing text. Error thrown if exceeds timeout
  await convo.waitForResponseContaining('Please enter your account number', {
    timeoutInSeconds: 10,
    caseInsensitive: true,
  });

  convo.sendText('123');
  // test-section

  const response = await convo.waitForResponse();
  if (response.includes('thank you, what would you like to do?')) {
    convo.sendText('change address');
  } else if (response.includes('sorry we cannot find your account. what is your phone number')) {
    convo.sendText('000000');
  }
})().catch((e) => {
  throw e;
});
