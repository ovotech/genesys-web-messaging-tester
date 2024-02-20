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
await convo.sendText('hi');

await convo.waitForResponseContaining('Is this an example?');

await convo.sendText('yes');

const reply = await convo.waitForResponse();
console.log(reply);
```

## Table of contents

### Constructors

- [constructor](Conversation.md#constructor)

### Accessors

- [isDisconnected](Conversation.md#isdisconnected)

### Methods

- [sendText](Conversation.md#sendtext)
- [waitForConversationToClose](Conversation.md#waitforconversationtoclose)
- [waitForConversationToStart](Conversation.md#waitforconversationtostart)
- [waitForResponseText](Conversation.md#waitforresponsetext)
- [waitForResponseWithTextContaining](Conversation.md#waitforresponsewithtextcontaining)
- [waitForResponseWithTextMatchingPattern](Conversation.md#waitforresponsewithtextmatchingpattern)
- [waitForResponses](Conversation.md#waitforresponses)

## Constructors

### constructor

• **new Conversation**(`messengerSession`, `timeoutSet?`, `timeoutClear?`): [`Conversation`](Conversation.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `messengerSession` | [`WebMessengerSession`](../interfaces/WebMessengerSession.md) | `undefined` |
| `timeoutSet` | typeof `setTimeout` | `setTimeout` |
| `timeoutClear` | (`timeoutId`: `undefined` \| `string` \| `number` \| `Timeout`) => `void` | `clearTimeout` |

#### Returns

[`Conversation`](Conversation.md)

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:142](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L142)

## Accessors

### isDisconnected

• `get` **isDisconnected**(): `boolean`

Returns whether the conversation has been disconnected

#### Returns

`boolean`

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:203](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L203)

## Methods

### sendText

▸ **sendText**(`text`, `delayInMs?`): `Promise`\<`void`\>

Sends text to the conversation

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `text` | `string` | `undefined` | Text containing at least one character |
| `delayInMs` | `number` | `2000` | Delay in milliseconds between calling this method and the text being sent. Without a delay some messages are sent so quickly after the original message that Genesys Cloud doesn't acknowledge them. A delay of 0 will result in the text being sent immediately. |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:234](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L234)

___

### waitForConversationToClose

▸ **waitForConversationToClose**(`timeoutInMs?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `timeoutInMs` | `number` | `2000` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:168](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L168)

___

### waitForConversationToStart

▸ **waitForConversationToStart**(): `Promise`\<[`Conversation`](Conversation.md)\>

Resolves when the conversation has started.

Starting a conversation is an automatic process that happens in the
background. This method allows you to wait for this process to finish.

#### Returns

`Promise`\<[`Conversation`](Conversation.md)\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:213](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L213)

___

### waitForResponseText

▸ **waitForResponseText**(): `Promise`\<`string`\>

Resolves on the next response from the other participant in the conversation that contains text.

If you want to wait for a specific message use [waitForResponseWithTextContaining](Conversation.md#waitforresponsewithtextcontaining).

#### Returns

`Promise`\<`string`\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:260](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L260)

___

### waitForResponseWithTextContaining

▸ **waitForResponseWithTextContaining**(`text`, `«destructured»?`): `Promise`\<`string`\>

Resolves when a response is received that contains a specific piece of text.
If no response is received that contains the text within the timeout period
then an exception is thrown.

Case-insensitive by default.

If you want to wait for the next response, regardless of what it contains
use [waitForResponseText](Conversation.md#waitforresponsetext).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `text` | `string` | `undefined` |
| `«destructured»` | `Object` | `{}` |
| › `caseInsensitive?` | `boolean` | `true` |
| › `timeoutInSeconds?` | `number` | `10` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:318](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L318)

___

### waitForResponseWithTextMatchingPattern

▸ **waitForResponseWithTextMatchingPattern**(`pattern`, `«destructured»?`): `Promise`\<`string`\>

Resolves when a response is received that matches a regular expression.
If no response is received that matches the pattern within the timeout period
then an exception is thrown.

If you want to wait for the next response, regardless of what it contains
use [waitForResponseText](Conversation.md#waitforresponsetext).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pattern` | `string` \| `RegExp` | `undefined` |
| `«destructured»` | `Object` | `{}` |
| › `timeoutInSeconds?` | `number` | `10` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:349](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L349)

___

### waitForResponses

▸ **waitForResponses**(`timeToWaitAfterLastMessageInMs?`): `Promise`\<`string`[]\>

Wait for all responses until there is a predefined amount of 'silence'.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `timeToWaitAfterLastMessageInMs` | `number` | `2000` |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:276](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L276)
