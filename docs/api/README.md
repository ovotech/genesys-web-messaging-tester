Genesys Web Messaging Tester

# Genesys Web Messaging Tester

## Table of contents

### Classes

- [BotDisconnectedWaitingForResponseError](classes/BotDisconnectedWaitingForResponseError.md)
- [Conversation](classes/Conversation.md)
- [ReorderedMessageDelayer](classes/ReorderedMessageDelayer.md)
- [SessionTranscriber](classes/SessionTranscriber.md)
- [TimeoutWaitingForResponseError](classes/TimeoutWaitingForResponseError.md)
- [WebMessageServerConnectionFixture](classes/WebMessageServerConnectionFixture.md)
- [WebMessageServerFixture](classes/WebMessageServerFixture.md)
- [WebMessengerGuestSession](classes/WebMessengerGuestSession.md)

### Interfaces

- [MessageDelayer](interfaces/MessageDelayer.md)
- [SessionConfig](interfaces/SessionConfig.md)
- [SessionResponse](interfaces/SessionResponse.md)
- [StructuredMessage](interfaces/StructuredMessage.md)
- [TranscribedMessage](interfaces/TranscribedMessage.md)
- [WebMessengerSession](interfaces/WebMessengerSession.md)

### Type Aliases

- [Response](README.md#response)

### Variables

- [webMessagePayloads](README.md#webmessagepayloads)

## Type Aliases

### Response

Ƭ **Response**<`T`\>: `SuccessResponse`<`T`\> \| `FailureResponse`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/genesys-web-messaging-tester/src/genesys/Response.ts:19](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/Response.ts#L19)

## Variables

### webMessagePayloads

• `Const` **webMessagePayloads**: `Object`

Payloads taken from real interactions

#### Type declaration

| Name | Type |
| :------ | :------ |
| `inboundStructuredMessage` | (`text`: `string`, `date`: `Date`) => [`StructuredMessage`](interfaces/StructuredMessage.md) |
| `outboundDisconnectEventStructuredMessage` | (`date`: `Date`) => [`StructuredMessage`](interfaces/StructuredMessage.md) |
| `outboundTextStructuredMessage` | (`text`: `string`, `date`: `Date`) => [`StructuredMessage`](interfaces/StructuredMessage.md) |
| `sessionResponse` | () => [`SessionResponse`](interfaces/SessionResponse.md) |

#### Defined in

[packages/genesys-web-messaging-tester/src/testFixtures/webMessagePayloads.ts:6](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/webMessagePayloads.ts#L6)
