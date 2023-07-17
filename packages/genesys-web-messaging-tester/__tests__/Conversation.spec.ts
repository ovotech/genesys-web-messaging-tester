import { Conversation, WebMessengerGuestSession } from '../src';
import WebSocket from 'ws';
import getPort from 'get-port';
import { WebMessageServerFixture } from './fixtures/WebMessageServerFixture';
import { WebMessageServerConnectionFixture } from './fixtures/WebMessageServerConnectionFixture';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const FakeTimers = require('@sinonjs/fake-timers');

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

  test('Waits for outbound message matching regex before continuing', async () => {
    const conversation = new Conversation(session);

    serverConnection.simulateSessionResponseMessage();
    await conversation.waitForConversationToStart();

    serverConnection.simulateOutboundTextStructuredMessage('This is an example question');
    await expect(
      conversation.waitForResponseWithTextContaining(/question/i),
    ).resolves.toStrictEqual('This is an example question');
  });

  test('Throws error when waiting for outbound message matching regex if bot disconnects', async () => {
    const conversation = new Conversation(session);

    serverConnection.simulateSessionResponseMessage();
    await conversation.waitForConversationToStart();

    serverConnection.simulateOutboundTextStructuredMessage('This is an example question');
    serverConnection.simulateOutboundDisconnectEventStructuredMessage();

    await expect(
      conversation.waitForResponseWithTextContaining(/hello/i, { timeoutInSeconds: 1 }),
    ).rejects.toEqual(
      new Error(
        `Bot disconnected from the conversation whilst waiting a message that contained '/hello/i'
Received before disconnection:
   - This is an example question`,
      ),
    );
  });
});
