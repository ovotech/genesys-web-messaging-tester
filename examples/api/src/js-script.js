require('dotenv').config({ path: '../../.env' });

// << test-section
const WebMsgTester = require('@ovotech/genesys-web-messaging-tester');

(async () => {
  const session = new WebMsgTester.WebMessengerGuestSession({
    deploymentId: process.env.DEPLOYMENT_ID,
    region: process.env.REGION,
  });

  const convo = new WebMsgTester.Conversation(session);
  await convo.waitForConversationToStart();

  await convo.sendText('hi');

  await convo.waitForResponseWithTextContaining(
    'Can we ask you some questions about your experience today?',
  );

  await convo.sendText('Yes');

  await convo.waitForResponseWithTextContaining('Thank you! Now for the next question...');

  session.close();
})().catch((e) => {
  throw e;
});
// test-section
