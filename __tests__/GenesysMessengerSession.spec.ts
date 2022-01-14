import { GenesysMessengerSession, StructuredMessage } from '../src';
import WebSocket from 'ws';
import getPort from 'get-port';

import {
  WebMessageServerFixture,
  // @ts-ignore
} from './fixtures/WebMessageServerFixture';

describe('GenesysMessengerSession', () => {
  let genesysServerFixture: WebMessageServerFixture;
  let session: GenesysMessengerSession;

  beforeEach(async () => {
    genesysServerFixture = new WebMessageServerFixture(await getPort());
  });

  afterEach(() => {
    session.close();
    genesysServerFixture.close();
  });

  test('WebSocket server request structured correctly', async () => {
    const wsFactory = jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      close: jest.fn(),
    }));
    session = new GenesysMessengerSession(
      {
        deploymentId: '11111111-2222-3333-4444-555555555555',
        region: 'xxxx.pure.cloud',
        origin: 'x.test',
      },
      wsFactory,
    );

    expect(wsFactory).toHaveBeenCalledWith(
      'wss://webmessaging.xxxx.pure.cloud/v1?deploymentId=11111111-2222-3333-4444-555555555555',
      { origin: 'x.test' },
    );
  });

  test('Client sends message to configure session', async () => {
    session = new GenesysMessengerSession(
      {
        deploymentId: '11111111-2222-3333-4444-555555555555',
        region: 'xxxx.pure.cloud',
      },
      () => new WebSocket(`ws://localhost:${genesysServerFixture.port}`),
    );

    const connectionToServer = await genesysServerFixture.waitForConnection();

    await expect(connectionToServer.waitForMessage()).resolves.toStrictEqual({
      action: 'configureSession',
      deploymentId: '11111111-2222-3333-4444-555555555555',
      token: expect.any(String),
    });
  });

  test('Client sends token from session configuration with replies', async () => {
    session = new GenesysMessengerSession(
      {
        deploymentId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        region: 'xxxx.pure.cloud',
      },
      () => new WebSocket(`ws://localhost:${genesysServerFixture.port}`),
    );

    const serverConnection = await genesysServerFixture.waitForConnection();
    const sessionConfigurePayload = await serverConnection.waitForMessage();

    session.sendText('hello world');

    await expect(serverConnection.waitForMessage()).resolves.toStrictEqual({
      action: 'onMessage',
      message: {
        text: 'hello world',
        type: 'Text',
      },
      token: sessionConfigurePayload?.token,
    });
  });

  test('Structured message from Genesys emitted from Session', async () => {
    session = new GenesysMessengerSession(
      {
        deploymentId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        region: 'xxxx.pure.cloud',
      },
      () => new WebSocket(`ws://localhost:${genesysServerFixture.port}`),
    );

    (await genesysServerFixture.waitForConnection()).simulateOutboundStructuredMessage(
      'Hello world',
    );

    await expect(
      new Promise<StructuredMessage>((resolve) => session.on('structuredMessage', resolve)),
    ).resolves.toStrictEqual({
      body: {
        channel: {
          time: expect.any(String),
          type: 'Private',
        },
        direction: 'Outbound',
        id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        originatingEntity: 'Bot',
        text: 'Hello world',
        type: 'Structured',
      },
      class: 'StructuredMessage',
      code: 200,
      type: 'message',
    });
  });
});
