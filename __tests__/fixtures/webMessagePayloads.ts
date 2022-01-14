/**
 * Payloads taken from real interactions
 */
export const webMessagePayloads = {
  sessionResponse: () => ({
    type: 'response',
    class: 'SessionResponse',
    code: 200,
    body: { connected: true, newSession: true },
  }),
  inboundStructuredMessage: (text: string, date: Date) => ({
    type: 'message',
    class: 'StructuredMessage',
    code: 200,
    body: {
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
  outboundStructuredMessage: (text: string, date: Date) => ({
    type: 'message',
    class: 'StructuredMessage',
    code: 200,
    body: {
      text,
      direction: 'Outbound',
      id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      channel: { time: date.toISOString(), type: 'Private' },
      type: 'Structured',
      originatingEntity: 'Bot',
    },
  }),
};
