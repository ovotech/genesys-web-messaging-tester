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
  outboundStructuredMessage: (text: string, date: Date): StructuredMessage => ({
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
};
