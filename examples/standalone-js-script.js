// << test-section
const WebMsgTester = require('@ovotech/genesys-web-messaging-tester');

(async () => {
  const session = new WebMsgTester.WebMessengerGuestSession({
    deploymentId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    region: 'xxxx.pure.cloud',
  });

  const convo = new WebMsgTester.Conversation(session);
  await convo.waitForConversationToStart();

  convo.sendText('hi');

  await convo.waitForResponseContaining('Please enter your account number');

  convo.sendText('123');

  await convo.waitForResponseContaining(
    'Your account number is too short. It is the 6 digit number on your bills',
  );
})().catch((e) => {
  throw e;
});
// test-section
