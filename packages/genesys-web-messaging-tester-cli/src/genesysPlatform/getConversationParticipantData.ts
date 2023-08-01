import * as platformClient from 'purecloud-platform-client-v2';
import { ConversationIdGetter } from './messageIdToConversationIdFactory';

type PreflightResult = Record<string, unknown>;

export interface PreflightError extends PreflightResult {
  reasonForError: string;
  errorType: 'missing-permissions' | 'unknown';
  ok: false;
}

export interface PreflightSuccess extends PreflightResult {
  ok: true;
}

export interface GetParticipantDataClient {
  get(conversationIdGetter: ConversationIdGetter): Promise<Record<string, string>>;
  preflightCheck(): Promise<PreflightSuccess | PreflightError>;
}

interface GenesysError {
  message: string;
  code: 'missing.any.permissions' | string;
  status: number;
}

function isGenesysError(obj: unknown): obj is GenesysError {
  return (
    (obj as GenesysError).message !== undefined &&
    typeof (obj as GenesysError).message === 'string' &&
    (obj as GenesysError).code !== undefined &&
    typeof (obj as GenesysError).code === 'string' &&
    (obj as GenesysError).status !== undefined &&
    typeof (obj as GenesysError).status === 'number'
  );
}

export function getParticipantDataClientFactory({
  convoApi,
}: {
  convoApi: platformClient.ConversationsApi;
}): GetParticipantDataClient {
  return {
    async get(conversationIdGetter): Promise<Record<string, string>> {
      const conversationId = await conversationIdGetter();
      if (!conversationId.successful) {
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Failed to get conversation ID: ${conversationId.reason}, ${conversationId.error}`,
        );
      }

      const abc = await convoApi.getConversation(conversationId.id);
      console.log(abc);
      return {};
    },
    async preflightCheck(): Promise<PreflightSuccess | PreflightError> {
      try {
        await convoApi.getConversation('wm-tester-preflight-check');
      } catch (err) {
        if (isGenesysError(err)) {
          switch (err.code) {
            case 'missing.any.permissions':
              return { ok: false, errorType: 'missing-permissions', reasonForError: err.message };
            case 'not.found':
              return { ok: true };
            default:
              return { ok: false, errorType: 'unknown', reasonForError: err.message };
          }
        }
        return {
          ok: false,
          errorType: 'unknown',
          reasonForError: (err as Error).message || 'unknown error',
        };
      }
      return { ok: true };
    },
  };
}
