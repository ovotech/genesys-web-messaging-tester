/**
 * This error is thrown when you want to fail a command, but not have an error
 * message or stack trace printed out by the entrypoint code.
 */
export class CommandExpectedlyFailedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, CommandExpectedlyFailedError.prototype);
  }
}
