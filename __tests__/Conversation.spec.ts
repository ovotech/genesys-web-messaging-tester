import { Conversation, GenesysMessengerSession } from '../src';
import WebSocket from 'ws';
import getPort from 'get-port';

import {
  WebMessageServerFixture,
  //@ts-ignore
} from './fixtures/WebMessageServerFixture';
import {
  WebMessageServerConnectionFixture,
  //@ts-ignore
} from './fixtures/WebMessageServerConnectionFixture';

describe('Conversation', () => {
  let genesysServerFixture: WebMessageServerFixture;
  let session: GenesysMessengerSession;

  let serverConnection: WebMessageServerConnectionFixture;

  beforeEach(async () => {
    genesysServerFixture = new WebMessageServerFixture(await getPort());

    session = new GenesysMessengerSession(
      {
        deploymentId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        region: 'xxxx.pure.cloud',
      },
      () => new WebSocket(`ws://localhost:${genesysServerFixture.port}`),
    );

    serverConnection = await genesysServerFixture.waitForConnection();
  });

  afterEach(() => {
    session.close();
    genesysServerFixture.close();
  });

  test('Session has started when Session Response is received', async () => {
    const conversation = new Conversation(session);

    serverConnection.simulateSessionResponseMessage();
    await expect(conversation.waitForConversationToStart()).resolves.toBeUndefined();
  });

  test('Waits for outbound message before continuing', async () => {
    const conversation = new Conversation(session);

    serverConnection.simulateSessionResponseMessage();
    await conversation.waitForConversationToStart();

    serverConnection.simulateOutboundStructuredMessage('Hello World');
    await expect(conversation.waitForResponse()).resolves.toStrictEqual('Hello World');
  });

  test('Waits for outbound message containing text before continuing', async () => {
    const conversation = new Conversation(session);

    serverConnection.simulateSessionResponseMessage();
    await conversation.waitForConversationToStart();

    serverConnection.simulateOutboundStructuredMessage('This is an example question');
    await expect(conversation.waitForResponseContaining('example question')).resolves.toStrictEqual(
      'This is an example question',
    );
  });

  test('Times out when waiting for outbound message containing text if exceeds timeout', async () => {
    const conversation = new Conversation(session);

    serverConnection.simulateSessionResponseMessage();
    await conversation.waitForConversationToStart();

    serverConnection.simulateOutboundStructuredMessage('This is an example question');

    await expect(
      conversation.waitForResponseContaining('hello', { timeoutInSeconds: 1 }),
    ).rejects.toStrictEqual(
      new Error(
        `Timed out waiting for a message that contained 'hello'
Received:
   - This is an example question`,
      ),
    );
  });
});
