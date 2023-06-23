import { TestScriptScenario } from './testScript/parseTestScript';
import {
  TimeoutWaitingForResponseError,
  TranscribedMessage,
} from '@ovotech/genesys-web-messaging-tester';
import { createConversationIdGetter } from '../genesysPlatform/messageIdToConversationIdFactory';

export interface ScenarioResult {
  scenario: TestScriptScenario;
  transcription: TranscribedMessage[];
  conversationId:
    | {
        associateId: false;
      }
    | { associateId: true; conversationIdGetter: ReturnType<typeof createConversationIdGetter> };
}

export interface ScenarioError extends ScenarioResult {
  reasonForError: Error | TimeoutWaitingForResponseError;
  hasPassed: false;
}

export interface ScenarioSuccess extends ScenarioResult {
  hasPassed: true;
}
