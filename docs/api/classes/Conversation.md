[Genesys Web Messaging Tester](../README.md) / Conversation

# Class: Conversation

Provides an API to simplify sending and receiving messages in a Web Messenger
session.

```typescript
const convo = new Conversation(
  new WebMessengerGuestSession({
    deploymentId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    region: 'xxxx.pure.cloud',
  }),
);

await convo.waitForConversationToStart();
convo.sendText('hi');

await convo.waitForResponseContaining('Is this an example?');

convo.sendText('yes');

const reply = await convo.waitForResponse();
console.log(reply);
```

## Table of contents

### Constructors

- [constructor](Conversation.md#constructor)

### Methods

- [sendText](Conversation.md#sendtext)
- [waitForConversationToStart](Conversation.md#waitforconversationtostart)
- [waitForResponseText](Conversation.md#waitforresponsetext)
- [waitForResponseWithTextContaining](Conversation.md#waitforresponsewithtextcontaining)
- [waitForResponses](Conversation.md#waitforresponses)

## Constructors

### constructor

• **new Conversation**(`messengerSession`, `timeoutSet?`, `timeoutClear?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `messengerSession` | [`WebMessengerSession`](../interfaces/WebMessengerSession.md) | `undefined` |
| `timeoutSet` | typeof `setTimeout` | `setTimeout` |
| `timeoutClear` | (`timeoutId`: `undefined` \| `string` \| `number` \| `Timeout`) => `void` | `clearTimeout` |

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:126](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L126)

## Methods

### sendText

▸ **sendText**(`text`): `void`

Sends text to the conversation

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | Text containing at least one character |

#### Returns

`void`

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:162](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L162)

___

### waitForConversationToStart

▸ **waitForConversationToStart**(): `Promise`<[`Conversation`](Conversation.md)\>

Resolves when the conversation has started.

Starting a conversation is an automatic process that happens in the
background. This method allows you to wait for this process to finish.

#### Returns

`Promise`<[`Conversation`](Conversation.md)\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:145](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L145)

___

### waitForResponseText

▸ **waitForResponseText**(): `Promise`<`string`\>

Resolves on the next response from the other participant in the conversation that contains text.

If you want to wait for a specific message use [waitForResponseWithTextContaining](Conversation.md#waitforresponsewithtextcontaining).

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:175](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L175)

___

### waitForResponseWithTextContaining

▸ **waitForResponseWithTextContaining**(`text`, `«destructured»?`): `Promise`<`string`\>

Resolves when a response is received that contains a specific piece of text.
If a response that contains the text isn't received within the timeout period then
an exception is thrown.

Case-insensitive by default.

If you want to wait for the next response, regardless of what it contains
use [waitForResponseText](Conversation.md#waitforresponsetext).

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `«destructured»` | `Object` |
| › `caseInsensitive?` | `boolean` |
| › `timeoutInSeconds?` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:233](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L233)

___

### waitForResponses

▸ **waitForResponses**(`timeToWaitAfterLastMessageInMs?`): `Promise`<`string`[]\>

Wait for all responses until there is a predefined amount of 'silence'.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `timeToWaitAfterLastMessageInMs` | `number` | `2000` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:191](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L191)
