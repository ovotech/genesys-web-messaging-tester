import { Conversation, GenesysMessengerSession, Transcriber } from '../src';

/**
 * Loads environment variables from file named `.env` that
 * is you have to create in the root of the project for this example to work
 *
 * @example contents of .env
 * DEPLOYMENT_ID=<deployment-id-of-deployment-under-test>
 * DEPLOYMENT_ID=<region-of-genesys-instance>
 */
require('dotenv').config();
jest.setTimeout(20000); // 20s

describe('Using jest to perform the test', () => {
  let session: GenesysMessengerSession;

  afterEach(() => session.close());

  test('Asked to rate experience out of 10', async () => {
    // << test-section
    session = new GenesysMessengerSession({
      deploymentId: process.env.DEPLOYMENT_ID!,
      region: process.env.REGION!,
    });

    const convo = new Conversation(session);
    await convo.waitForConversationToStart();

    convo.sendText('hi');

    await expect(convo.waitForResponse()).resolves.toContain(
      'Can we ask you some questions about your experience today?',
    );
    convo.sendText('Yes');

    await expect(convo.waitForResponse()).resolves.toContain(
      'Out of 10 how would you rate your experience with us?',
    );
    // test-section
  });

  test('Transcribe conversation in realtime', async () => {
    session = new GenesysMessengerSession({
      deploymentId: process.env.DEPLOYMENT_ID!,
      region: process.env.REGION!,
    });

    const convo = new Conversation(session);
    await convo.waitForConversationToStart();

    // << transcription-section
    const transcriber = new Transcriber(session);

    // Log interactions as they occur
    transcriber.on('interaction', (i) => console.log(`${i}`));

    convo.sendText('hi');

    await expect(convo.waitForResponse()).resolves.toContain(
      'Can we ask you some questions about your experience today?',
    );

    // Log the transcript for the entire conversation
    console.log(transcriber.getTranscript());
    // transcription-section
  });
});
