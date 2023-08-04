import { StructuredMessage } from '../StructuredMessage';
import { isStructuredMessage } from '../WebMessengerGuestSession';
import { ReceivedMsg } from './MessageDelayer';
import { Response } from '../Response';

export interface orderByTimestampResult {
  wasRearranged: boolean;
  responses: ReceivedMsg<Response<unknown>>[];
}

export function isReceivedResponseStructuredMsg(
  message: ReceivedMsg<Response<unknown> | StructuredMessage>,
): message is ReceivedMsg<StructuredMessage> {
  return isStructuredMessage(message.response);
}

export function orderByTimestamp(
  array: ReceivedMsg<Response<unknown> | StructuredMessage>[],
): orderByTimestampResult {
  const withTimestamps: ReceivedMsg<StructuredMessage>[] = [];
  const withoutTimestamps: ReceivedMsg<Response<unknown>>[] = [];

  array.forEach((item) => {
    if (isReceivedResponseStructuredMsg(item)) {
      withTimestamps.push(item);
    } else {
      withoutTimestamps.push(item);
    }
  });

  withTimestamps.sort((a, b) => {
    return (
      new Date(a.response.body.channel.time).getTime() -
      new Date(b.response.body.channel.time).getTime()
    );
  });

  const result: ReceivedMsg<Response<unknown>>[] = [];
  let j = 0,
    k = 0;

  for (let i = 0; i < array.length; i++) {
    if (isReceivedResponseStructuredMsg(array[i])) {
      result.push(withTimestamps[j]);
      j++;
    } else {
      result.push(withoutTimestamps[k]);
      k++;
    }
  }

  let wasRearranged = false;
  for (let i = 0; i < array.length; i++) {
    if (!Object.is(result[i], array[i])) {
      wasRearranged = true;
      break;
    }
  }

  return { wasRearranged, responses: result };
}
