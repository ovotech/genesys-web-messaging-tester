import { SuccessResponse } from './Response';

export interface SessionResponseSuccessBody {
  connected: boolean;
  newSession: boolean;
}

export interface SessionResponse extends SuccessResponse<SessionResponseSuccessBody> {
  type: 'response';
  class: 'SessionResponse';
}
