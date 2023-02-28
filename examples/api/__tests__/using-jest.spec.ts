import {
  Conversation,
  WebMessengerGuestSession,
  Transcriber,
} from '@ovotech/genesys-web-messaging-tester';

// Set realistic timeout value for a Web Messenger conversation
jest.setTimeout(20000); // 20s

require('dotenv').config({ path: '../../.env' });

describe('Using jest to perform the test', () => {
  let session: WebMessengerGuestSession;

  afterEach(() => session.close());

  test('Asked to rate experience out of 10', async () => {
    session = new WebMessengerGuestSession({
      deploymentId: process.env.DEPLOYMENT_ID!,
      region: process.env.REGION!,
    });
    const transcriber = new Transcriber(session);

    const convo = new Conversation(session);
    await convo.waitForConversationToStart();

    convo.sendText('hi');

    await expect(
      convo.waitForResponseWithTextContaining(
        'Can we ask you some questions about your experience today?',
        {
          timeoutInSeconds: 10,
        },
      ),
    ).resolves.toBeDefined();

    convo.sendText('Yes');

    await expect(convo.waitForResponseText()).resolves.toContain(
      'Thank you! Now for the next question...',
    );

    console.log(transcriber.getTranscript());
  });

  test('Transcribe conversation in realtime', async () => {
    session = new WebMessengerGuestSession({
      deploymentId: process.env.DEPLOYMENT_ID!,
      region: process.env.REGION!,
    });

    const convo = new Conversation(session);
    await convo.waitForConversationToStart();

    const transcriber = new Transcriber(session);

    // Log interactions as they occur
    transcriber.on('messageTranscribed', (t) => console.log(t.toString()));

    convo.sendText('hi');

    await expect(convo.waitForResponseText()).resolves.toContain(
      'Can we ask you some questions about your experience today?',
    );

    // Log the transcript for the entire conversation
    console.log(transcriber.getTranscript().map((t) => t.toString()));
  });
});
