import { GenesysMessengerSession } from './genesys/GenesysMessengerSession';

export interface Then {
  readonly describe: string;
  do(
    messengerSession: Pick<GenesysMessengerSession, 'sendText'>,
  ): { endOfScenario: boolean } | void;
}

export function reply(message: string): Then {
  return {
    describe: message,
    do(session) {
      session.sendText(message);
    },
  };
}

export function scenarioSuccessful(): Then {
  return {
    describe: 'Nothing (test successful)',
    do() {
      return { endOfScenario: true };
    },
  };
}
