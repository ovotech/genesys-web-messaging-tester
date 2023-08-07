import { orderByTimestamp, orderByTimestampResult } from './orderByTimestamp';
import { Response } from '../Response';
import { StructuredMessage } from '../StructuredMessage';
import { SessionResponse, SessionResponseSuccessBody } from '../SessionResponse';
import { ReceivedMsg } from './ReorderedMessageDelayer';

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
  const received = new Date();

  test('Correctly sorts an array with timestamped and non-timestamped elements', () => {
    const unordered: ReceivedMsg<StructuredMessage | Response<unknown>>[] = [
      { received, response: createStructuredMessage('1', '2023-07-22T21:19:41.256Z') },
      {
        received,
        response: createSessionResponse({ connected: true, newSession: false, readOnly: false }),
      },
      { received, response: createStructuredMessage('3', '2023-07-22T21:19:55.256Z') },
      { received, response: createStructuredMessage('7', '2023-07-22T20:13:55.256Z') },
      {
        received,
        response: createSessionResponse({ connected: false, newSession: true, readOnly: false }),
      },
      {
        received,
        response: createSessionResponse({ connected: false, newSession: false, readOnly: true }),
      },
      { received, response: createStructuredMessage('6', '2023-07-22T21:19:25.256Z') },
    ];

    expect(orderByTimestamp(unordered)).toStrictEqual<orderByTimestampResult>({
      wasRearranged: true,
      responses: [
        {
          received,
          response: createStructuredMessage('7', '2023-07-22T20:13:55.256Z'),
        },
        {
          received,
          response: createSessionResponse({ connected: true, newSession: false, readOnly: false }),
        },
        {
          received,
          response: createStructuredMessage('6', '2023-07-22T21:19:25.256Z'),
        },
        {
          received,
          response: createStructuredMessage('1', '2023-07-22T21:19:41.256Z'),
        },
        {
          received,
          response: createSessionResponse({ connected: false, newSession: true, readOnly: false }),
        },
        {
          received,
          response: createSessionResponse({ connected: false, newSession: false, readOnly: true }),
        },
        {
          received,
          response: createStructuredMessage('3', '2023-07-22T21:19:55.256Z'),
        },
      ],
    });
  });

  test('Does not change the order of non-timestamped elements', () => {
    const input: ReceivedMsg<StructuredMessage | Response<unknown>>[] = [
      {
        received,
        response: createSessionResponse({ connected: true, newSession: false, readOnly: false }),
      },
      {
        received,
        response: createSessionResponse({ connected: true, newSession: true, readOnly: false }),
      },
      {
        received,
        response: createSessionResponse({ connected: true, newSession: true, readOnly: true }),
      },
    ];

    expect(orderByTimestamp(input)).toStrictEqual<orderByTimestampResult>({
      wasRearranged: false,
      responses: [
        {
          received,
          response: createSessionResponse({ connected: true, newSession: false, readOnly: false }),
        },
        {
          received,
          response: createSessionResponse({ connected: true, newSession: true, readOnly: false }),
        },
        {
          received,
          response: createSessionResponse({ connected: true, newSession: true, readOnly: true }),
        },
      ],
    });
  });

  test('Correctly sorts an array with only timestamped elements', () => {
    const unordered: ReceivedMsg<StructuredMessage | Response<unknown>>[] = [
      { received, response: createStructuredMessage('1', '2023-07-22T21:19:41.256Z') },
      { received, response: createStructuredMessage('2', '2023-07-22T21:19:55.256Z') },
      { received, response: createStructuredMessage('3', '2023-07-22T21:19:25.256Z') },
    ];

    expect(orderByTimestamp(unordered)).toStrictEqual<orderByTimestampResult>({
      wasRearranged: true,
      responses: [
        {
          received,
          response: createStructuredMessage('3', '2023-07-22T21:19:25.256Z'),
        },
        {
          received,
          response: createStructuredMessage('1', '2023-07-22T21:19:41.256Z'),
        },
        {
          received,
          response: createStructuredMessage('2', '2023-07-22T21:19:55.256Z'),
        },
      ],
    });
  });
});
