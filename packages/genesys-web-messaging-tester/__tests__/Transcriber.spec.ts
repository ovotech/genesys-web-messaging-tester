import { WebMessengerGuestSession, TranscribedMessage, SessionTranscriber } from '../src';
import WebSocket from 'ws';
import getPort from 'get-port';

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
import { NoDelay } from './fixtures/NoDelay';

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
      {},
      () => new WebSocket(`ws://localhost:${genesysServerFixture.port}`),
      new NoDelay(),
    );

    serverConnection = await genesysServerFixture.waitForConnection();
  });

  afterEach(() => {
    session.close();
    genesysServerFixture.close();
  });

  test("Outbound message transcribed as being from 'them'", async () => {
    return new Promise<void>((done) => {
      new SessionTranscriber(session).on('messageTranscribed', (event: TranscribedMessage) => {
        expect(event).toStrictEqual({
          message: 'Example outbound',
          who: 'Them',
          toString: expect.any(Function),
        });
        expect(event.toString()).toStrictEqual('Them: Example outbound');
        done();
      });

      serverConnection.simulateOutboundTextStructuredMessage('Example outbound');
    });
  });

  test("Inbound message transcribed as being from 'you'", async () => {
    return new Promise<void>((done) => {
      new SessionTranscriber(session).on('messageTranscribed', (event: TranscribedMessage) => {
        expect(event).toStrictEqual({
          message: 'Example inbound',
          who: 'You',
          toString: expect.any(Function),
        });
        expect(event.toString()).toStrictEqual('You: Example inbound');
        done();
      });

      serverConnection.simulateInboundTextStructuredMessage('Example inbound');
    });
  });

  test("Inbound/Outbound messages transcribed as being from 'you'/'them'", async () => {
    const transcriber = new SessionTranscriber(session);

    serverConnection.simulateInboundTextStructuredMessage('Example inbound');
    serverConnection.simulateOutboundTextStructuredMessage('Example outbound');

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
