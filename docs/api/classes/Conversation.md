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
- [waitForResponse](Conversation.md#waitforresponse)
- [waitForResponseContaining](Conversation.md#waitforresponsecontaining)

## Constructors

### constructor

• **new Conversation**(`messengerSession`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `messengerSession` | [`WebMessengerSession`](../interfaces/WebMessengerSession.md) |

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:63](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L63)

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

[packages/genesys-web-messaging-tester/src/Conversation.ts:91](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L91)

___

### waitForConversationToStart

▸ **waitForConversationToStart**(): `Promise`<[`Conversation`](Conversation.md)\>

Resolves when the conversation has started.

Starting a conversation is an automatic process that happens in the
background. This method allows you to wait for this process to finish.

#### Returns

`Promise`<[`Conversation`](Conversation.md)\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:74](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L74)

___

### waitForResponse

▸ **waitForResponse**(): `Promise`<`string`\>

Resolves on the next response from the other participant in the conversation.

If you want to wait for a specific message use [waitForResponseContaining](Conversation.md#waitforresponsecontaining).

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:104](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L104)

___

### waitForResponseContaining

▸ **waitForResponseContaining**(`text`, `__namedParameters?`): `Promise`<`string`\>

Resolves when a response is received that contains a specific piece of text.
If a response that contains the text isn't received within the timeout period then
an exception is thrown.

Case-insensitive by default.

If you want to wait for the next response, regardless of what it contains
use [waitForResponse](Conversation.md#waitforresponse).

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `__namedParameters` | `Object` |
| `__namedParameters.caseInsensitive?` | `boolean` |
| `__namedParameters.timeoutInSeconds?` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:124](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L124)
