import * as platformClient from 'purecloud-platform-client-v2';
import { StructuredMessage, WebMessengerSession } from '@ovotech/genesys-web-messaging-tester';

type PreflightResult = Record<string, unknown>;

export interface PreflightError extends PreflightResult {
  reasonForError: string;
  errorType: 'missing-permissions' | 'unknown';
  ok: false;
}

export interface PreflightSuccess extends PreflightResult {
  ok: true;
}

export interface MessageIdToConvoIdClient {
  get(messageId: string): Promise<string | undefined>;
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

export function messageIdToConversationIdFactory({
  convoApi,
}: {
  convoApi: platformClient.ConversationsApi;
}): MessageIdToConvoIdClient {
  return {
    async get(messageId): Promise<string | undefined> {
      const response = await convoApi.getConversationsMessageDetails(messageId);
      return response?.conversationId;
    },
    async preflightCheck(): Promise<PreflightSuccess | PreflightError> {
      try {
        await convoApi.getConversationsMessageDetails('wm-tester-preflight-check');
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

interface ConversationIdGetterSuccess {
  successful: true;
  id: string;
}

export interface ConversationIdGetterFailure {
  successful: false;
  reason: 'not-received-message' | 'convo-id-not-in-response' | 'unknown-error';
  error?: unknown;
}

export type ConversationIdGetterResponse =
  | ConversationIdGetterSuccess
  | ConversationIdGetterFailure;

export type ConversationIdGetter = () => Promise<ConversationIdGetterResponse>;

export function createConversationIdGetter(
  session: WebMessengerSession,
  client: MessageIdToConvoIdClient,
): ConversationIdGetter {
  let messageId: string | undefined;

  session.once('structuredMessage', (msg: StructuredMessage) => {
    messageId = msg.body.id;
  });

  let conversationId: string | undefined = undefined;
  return async (): Promise<ConversationIdGetterResponse> => {
    if (!messageId) {
      return {
        successful: false,
        reason: 'not-received-message',
      };
    }

    try {
      if (!conversationId) {
        conversationId = await client.get(messageId);
      }
      if (conversationId) {
        return { successful: true, id: conversationId };
      } else {
        return { successful: false, reason: 'convo-id-not-in-response' };
      }
    } catch (error) {
      return { successful: false, reason: 'unknown-error', error };
    }
  };
}
