import { StructuredMessage, SessionResponse } from '../../src';

/**
 * Payloads taken from real interactions
 */
export const webMessagePayloads = {
  sessionResponse: (): SessionResponse => ({
    type: 'response',
    class: 'SessionResponse',
    code: 200,
    body: { connected: true, newSession: true },
  }),
  inboundStructuredMessage: (text: string, date: Date): StructuredMessage => ({
    type: 'message',
    class: 'StructuredMessage',
    code: 200,
    body: {
      originatingEntity: '',
      text,
      direction: 'Inbound',
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      channel: {
        time: date.toISOString(),
        messageId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      },
      type: 'Text',
      metadata: {
        correlationId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      },
    },
  }),
  outboundTextStructuredMessage: (text: string, date: Date): StructuredMessage => ({
    type: 'message',
    class: 'StructuredMessage',
    code: 200,
    body: {
      text,
      direction: 'Outbound',
      id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      channel: { time: date.toISOString(), type: 'Private' },
      type: 'Text',
      originatingEntity: 'Bot',
      metadata: {
        correlationId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      },
    },
  }),
  outboundDisconnectEventStructuredMessage: (date: Date): StructuredMessage => ({
    type: 'message',
    class: 'StructuredMessage',
    code: 200,
    body: {
      direction: 'Outbound',
      id: '0000000-0000-0000-0000-0000000000',
      channel: {
        time: date.toISOString(),
        messageId: '0000000-0000-0000-0000-0000000000',
      },
      type: 'Event',
      events: [
        {
          eventType: 'Presence',
          presence: {
            type: 'Disconnect',
          },
        },
      ],
    },
  }),
};
