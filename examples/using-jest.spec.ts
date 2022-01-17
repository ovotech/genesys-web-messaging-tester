import { Conversation, WebMessengerGuestSession, Transcriber } from '../src';

/**
 * Loads environment variables from file named `.env` that
 * is you have to create in the root of the project for this example to work
 *
 * @example contents of .env
 * DEPLOYMENT_ID=<deployment-id-of-deployment-under-test>
 * REGION=<region-of-genesys-instance>
 */
require('dotenv').config();
jest.setTimeout(20000); // 20s

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

    // Ignores welcome messages and waits for question
    await expect(
      convo.waitForResponseContaining('Please enter your account number', {
        timeoutInSeconds: 10,
      }),
    ).resolves.toBeDefined();

    await expect(convo.waitForResponse()).resolves.toContain(
      'Can we ask you some questions about your experience today?',
    );
    convo.sendText('Yes');

    await expect(convo.waitForResponse()).resolves.toContain(
      'Out of 10 how would you rate your experience with us?',
    );
    convo.sendText('5');

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
    transcriber.on('messageTranscribed', (i) => console.log(`${i}`));

    convo.sendText('hi');

    await expect(convo.waitForResponse()).resolves.toContain(
      'Can we ask you some questions about your experience today?',
    );

    // Log the transcript for the entire conversation
    console.log(transcriber.getTranscript());
  });
});
