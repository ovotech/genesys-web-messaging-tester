import { SuccessResponse } from './Response';

export interface StructuredMessageBody {
  type: 'Text' | 'Structured';
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

export interface StructuredMessage extends SuccessResponse<StructuredMessageBody> {
  type: 'message';
  class: 'StructuredMessage';
}
