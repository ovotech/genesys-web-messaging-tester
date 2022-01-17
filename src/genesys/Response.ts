export interface ResponseBase<T> {
  type: 'response' | 'message';
  class: string;
  code: number;
  body: T;
}

export interface SuccessResponse<T> extends ResponseBase<T> {
  code: 200;
}

export interface FailureResponse extends ResponseBase<string> {
  /**
   * @see https://developer.genesys.cloud/api/digital/webmessaging/websocketapi#error-codes
   */
  code: 400 | 4001 | 4002 | 4003 | 4004 | 4005 | 4006 | 4007 | 4008 | 4009 | 4010 | 4011;
}

export type Response<T> = SuccessResponse<T> | FailureResponse;
