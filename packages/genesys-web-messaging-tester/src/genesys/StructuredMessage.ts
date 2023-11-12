import { SuccessResponse } from './Response';

export interface StructuredMessageTextBody {
  type: 'Text';
  direction: 'Inbound' | 'Outbound';
  text: string;
  id: string;
  originatingEntity?: string; // Bot
  channel: {
    time: string;
    messageId?: string;
    type?: string;
  };
  metadata: {
    /**
     * @see https://help.mypurecloud.com/articles/find-a-correlation-id/
     */
    correlationId: string;
  };
}

/**
 * @see https://developer.genesys.cloud/commdigital/digital/webmessaging/websocketapi#outbound-message-with-a-quick-reply
 */
export interface StructuredMessageStructuredBody {
  type: 'Structured';
  direction: 'Inbound' | 'Outbound';
  text: string;
  id: string;
  originatingEntity: string;
  channel: {
    time: string;
    messageId?: string;
    type?: string;
  };
  metadata: {
    /**
     * @see https://help.mypurecloud.com/articles/find-a-correlation-id/
     */
    correlationId: string;
  };
}

export interface StructuredMessageEventBody {
  type: 'Event';
  direction: 'Inbound' | 'Outbound';
  id: string;
  channel: {
    time: string;
    messageId?: string;
  };
  events: {
    eventType: 'Presence';
    presence: {
      type: 'Disconnect' | 'Join';
    };
  }[];
}

export interface StructuredMessage
  extends SuccessResponse<
    StructuredMessageTextBody | StructuredMessageStructuredBody | StructuredMessageEventBody
  > {
  type: 'message';
  class: 'StructuredMessage';
}
