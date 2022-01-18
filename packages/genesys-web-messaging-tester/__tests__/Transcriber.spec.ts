import { WebMessengerGuestSession, TranscribedMessage, Transcriber } from '../src';
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

describe('Transcriber', () => {
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
      () => new WebSocket(`ws://localhost:${genesysServerFixture.port}`),
    );

    serverConnection = await genesysServerFixture.waitForConnection();
  });

  afterEach(() => {
    session.close();
    genesysServerFixture.close();
  });

  test("Outbound message transcribed as being from 'them'", (done) => {
    new Transcriber(session).on('messageTranscribed', (event: TranscribedMessage) => {
      expect(event).toStrictEqual({
        message: 'Example outbound',
        who: 'Them',
        toString: expect.any(Function),
      });
      expect(`${event}`).toStrictEqual('Them: Example outbound');
      done();
    });

    serverConnection.simulateOutboundStructuredMessage('Example outbound');
  });

  test("Inbound message transcribed as being from 'you'", (done) => {
    new Transcriber(session).on('messageTranscribed', (event: TranscribedMessage) => {
      expect(event).toStrictEqual({
        message: 'Example inbound',
        who: 'You',
        toString: expect.any(Function),
      });
      expect(`${event}`).toStrictEqual('You: Example inbound');
      done();
    });

    serverConnection.simulateInboundStructuredMessage('Example inbound');
  });

  test("Inbound message transcribed as being from 'you'", async () => {
    const transcriber = new Transcriber(session);

    serverConnection.simulateInboundStructuredMessage('Example inbound');
    serverConnection.simulateOutboundStructuredMessage('Example outbound');

    // Wait for both inbound/outbound messages to be received
    await new Promise<void>((resolve) => {
      let counter = 0;

      transcriber.on('messageTranscribed', () => {
        counter++;
        if (counter === 2) {
          resolve();
        }
      });
    });

    expect(transcriber.getTranscript()).toStrictEqual([
      {
        message: 'Example inbound',
        who: 'You',
        toString: expect.any(Function),
      },
      {
        message: 'Example outbound',
        who: 'Them',
        toString: expect.any(Function),
      },
    ]);
  });
});
