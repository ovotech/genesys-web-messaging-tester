import { Conversation, WebMessengerGuestSession } from '../src';
import WebSocket from 'ws';
import getPort from 'get-port';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FakeTimers = require('@sinonjs/fake-timers');

import {
  WebMessageServerFixture,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
} from './fixtures/WebMessageServerFixture';
import {
  WebMessageServerConnectionFixture,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
} from './fixtures/WebMessageServerConnectionFixture';

describe('Conversation', () => {
  let genesysServerFixture: WebMessageServerFixture;
  let session: WebMessengerGuestSession;

  let serverConnection: WebMessageServerConnectionFixture;

  beforeEach(async () => {
    genesysServerFixture = new WebMessageServerFixture(await getPort());

    session = new WebMessengerGuestSession(
      {
        deploymentId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        region: 'xxxx.pure.cloud',
      },
      {},
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
    await expect(conversation.waitForConversationToStart()).resolves.toBeDefined();
  });

  test('Waits for outbound message before continuing', async () => {
    const conversation = new Conversation(session);

    serverConnection.simulateSessionResponseMessage();
    await conversation.waitForConversationToStart();

    serverConnection.simulateInboundTextStructuredMessage('Hello World');
    serverConnection.simulateOutboundTextStructuredMessage('Hello World');
    await expect(conversation.waitForResponseText()).resolves.toStrictEqual('Hello World');
  });

  test('Waits for outbound message containing text before continuing', async () => {
    const conversation = new Conversation(session);

    serverConnection.simulateSessionResponseMessage();
    await conversation.waitForConversationToStart();

    serverConnection.simulateOutboundTextStructuredMessage('This is an example question');
    await expect(
      conversation.waitForResponseWithTextContaining('example question'),
    ).resolves.toStrictEqual('This is an example question');
  });

  test('Times out when waiting for outbound message containing text if exceeds timeout', async () => {
    const conversation = new Conversation(session);

    serverConnection.simulateSessionResponseMessage();
    await conversation.waitForConversationToStart();

    serverConnection.simulateOutboundTextStructuredMessage('This is an example question');

    await expect(
      conversation.waitForResponseWithTextContaining('hello', { timeoutInSeconds: 1 }),
    ).rejects.toEqual(
      new Error(
        `Timed-out after 1000ms waiting for a message that contained 'hello'
Received:
   - This is an example question`,
      ),
    );
  });

  test('Throws error when waiting for outbound message containing text if bot disconnects', async () => {
    const conversation = new Conversation(session);

    serverConnection.simulateSessionResponseMessage();
    await conversation.waitForConversationToStart();

    serverConnection.simulateOutboundTextStructuredMessage('This is an example question');
    serverConnection.simulateOutboundDisconnectEventStructuredMessage();

    await expect(
      conversation.waitForResponseWithTextContaining('hello', { timeoutInSeconds: 1 }),
    ).rejects.toEqual(
      new Error(
        `Bot disconnected from the conversation whilst waiting a message that contained 'hello'
Received before disconnection:
   - This is an example question`,
      ),
    );
  });

  test('Waits for responses until X ms of silence after last message', async () => {
    const waitForWebSocketMessagePropagation = async (
      session: WebMessengerGuestSession,
    ): Promise<void> =>
      await new Promise<void>((resolve) => session.on('structuredMessage', resolve));

    const clock = FakeTimers.createClock();
    const conversation = new Conversation(session, clock.setTimeout, clock.clearTimeout);

    serverConnection.simulateSessionResponseMessage();
    await conversation.waitForConversationToStart();

    let response: string[] | undefined;
    const waitForResponses = conversation.waitForResponses(100).then((r) => (response = r));

    serverConnection.simulateOutboundTextStructuredMessage('Test message 1');
    await waitForWebSocketMessagePropagation(session);
    clock.tick(90);
    expect(response).toBeUndefined();

    serverConnection.simulateOutboundTextStructuredMessage('Test message 2');
    await waitForWebSocketMessagePropagation(session);
    clock.tick(90);
    expect(response).toBeUndefined();

    serverConnection.simulateOutboundTextStructuredMessage('Test message 3');
    await waitForWebSocketMessagePropagation(session);
    clock.tick(100);

    await expect(waitForResponses).resolves.toStrictEqual([
      'Test message 1',
      'Test message 2',
      'Test message 3',
    ]);
  });
});
