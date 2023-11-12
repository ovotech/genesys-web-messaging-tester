export class RetryTask extends Error {
  constructor() {
    super('Retrying');
    Object.setPrototypeOf(this, RetryTask.prototype);
  }
}

export async function tryableTask(func: (isRetry: boolean) => Promise<void>): Promise<void> {
  try {
    await func(false);
  } catch (e) {
    if (e instanceof RetryTask) {
      await func(true);
    }
  }
}
