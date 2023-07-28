import { orderByTimestamp, orderByTimestampResult } from './orderByTimestamp';
import { Response } from '../Response';
import { StructuredMessage } from '../StructuredMessage';
import { SessionResponse, SessionResponseSuccessBody } from '../SessionResponse';

function createStructuredMessage(text: string, time: string): StructuredMessage {
  return {
    type: 'message',
    class: 'StructuredMessage',
    code: 200,
    body: {
      text,
      direction: 'Inbound',
      id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      channel: {
        time,
        messageId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      },
      type: 'Text',
      metadata: {
        correlationId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      },
    },
  };
}

function createSessionResponse(body: SessionResponseSuccessBody): SessionResponse {
  return {
    body,
    class: 'SessionResponse',
    code: 200,
    type: 'response',
  };
}

describe('orderWithTimestamps', () => {
  test('Correctly sorts an array with timestamped and non-timestamped elements', () => {
    const unordered: Response<unknown>[] = [
      createStructuredMessage('1', '2023-07-22T21:19:41.256Z'),
      createSessionResponse({ connected: true, newSession: false, readOnly: false }),
      createStructuredMessage('3', '2023-07-22T21:19:55.256Z'),
      createStructuredMessage('7', '2023-07-22T20:13:55.256Z'),
      createSessionResponse({ connected: false, newSession: true, readOnly: false }),
      createSessionResponse({ connected: false, newSession: false, readOnly: true }),
      createStructuredMessage('6', '2023-07-22T21:19:25.256Z'),
    ];

    expect(orderByTimestamp(unordered)).toStrictEqual<orderByTimestampResult>({
      wasRearranged: true,
      responses: [
        createStructuredMessage('7', '2023-07-22T20:13:55.256Z'),
        createSessionResponse({ connected: true, newSession: false, readOnly: false }),
        createStructuredMessage('6', '2023-07-22T21:19:25.256Z'),
        createStructuredMessage('1', '2023-07-22T21:19:41.256Z'),
        createSessionResponse({ connected: false, newSession: true, readOnly: false }),
        createSessionResponse({ connected: false, newSession: false, readOnly: true }),
        createStructuredMessage('3', '2023-07-22T21:19:55.256Z'),
      ],
    });
  });

  test('Does not change the order of non-timestamped elements', () => {
    const input: Response<unknown>[] = [
      createSessionResponse({ connected: true, newSession: false, readOnly: false }),
      createSessionResponse({ connected: true, newSession: true, readOnly: false }),
      createSessionResponse({ connected: true, newSession: true, readOnly: true }),
    ];

    expect(orderByTimestamp(input)).toStrictEqual<orderByTimestampResult>({
      wasRearranged: false,
      responses: [
        createSessionResponse({ connected: true, newSession: false, readOnly: false }),
        createSessionResponse({ connected: true, newSession: true, readOnly: false }),
        createSessionResponse({ connected: true, newSession: true, readOnly: true }),
      ],
    });
  });

  test('Correctly sorts an array with only timestamped elements', () => {
    const unordered: Response<unknown>[] = [
      createStructuredMessage('1', '2023-07-22T21:19:41.256Z'),
      createStructuredMessage('2', '2023-07-22T21:19:55.256Z'),
      createStructuredMessage('3', '2023-07-22T21:19:25.256Z'),
    ];

    expect(orderByTimestamp(unordered)).toStrictEqual<orderByTimestampResult>({
      wasRearranged: true,
      responses: [
        createStructuredMessage('3', '2023-07-22T21:19:25.256Z'),
        createStructuredMessage('1', '2023-07-22T21:19:41.256Z'),
        createStructuredMessage('2', '2023-07-22T21:19:55.256Z'),
      ],
    });
  });
});
