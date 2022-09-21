import { TestScriptScenario } from './testScript/parseTestScript';
import {
  TimeoutWaitingForResponseError,
  TranscribedMessage,
} from '@ovotech/genesys-web-messaging-tester';

export interface ScenarioResult {
  scenario: TestScriptScenario;
  transcription: TranscribedMessage[];
}

export interface ScenarioError extends ScenarioResult {
  reasonForError: Error | TimeoutWaitingForResponseError;
  hasPassed: false;
}

export interface ScenarioSuccess extends ScenarioResult {
  hasPassed: true;
}
