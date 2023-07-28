import { Response } from '../Response';
import { StructuredMessage } from '../StructuredMessage';
import { isStructuredMessage } from '../WebMessengerGuestSession';

export function orderByTimestamp(array: Response<unknown>[]): Response<unknown>[] {
  const withTimestamps: StructuredMessage[] = [];
  const withoutTimestamps: Response<unknown>[] = [];

  array.forEach((item) => {
    if (isStructuredMessage(item)) {
      withTimestamps.push(item);
    } else {
      withoutTimestamps.push(item);
    }
  });

  withTimestamps.sort((a, b) => {
    return new Date(a.body.channel.time).getTime() - new Date(b.body.channel.time).getTime();
  });

  const result: Response<unknown>[] = [];
  let j = 0,
    k = 0;

  for (let i = 0; i < array.length; i++) {
    if (isStructuredMessage(array[i])) {
      result.push(withTimestamps[j]);
      j++;
    } else {
      result.push(withoutTimestamps[k]);
      k++;
    }
  }

  return result;
}
