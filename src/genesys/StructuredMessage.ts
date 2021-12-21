import {SuccessResponse} from './Response';

export interface StructuredMessageBody {
  type: 'Text';
  direction: 'Inbound' | 'Outbound';
  text: string;
  id: string;
  channel: {
    time: string;
    messageId: string;
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
