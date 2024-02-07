[Genesys Web Messaging Tester](../README.md) / BotDisconnectedWaitingForResponseError

# Class: BotDisconnectedWaitingForResponseError

## Hierarchy

- `Error`

  ↳ **`BotDisconnectedWaitingForResponseError`**

## Table of contents

### Constructors

- [constructor](BotDisconnectedWaitingForResponseError.md#constructor)

### Properties

- [message](BotDisconnectedWaitingForResponseError.md#message)
- [name](BotDisconnectedWaitingForResponseError.md#name)
- [stack](BotDisconnectedWaitingForResponseError.md#stack)
- [prepareStackTrace](BotDisconnectedWaitingForResponseError.md#preparestacktrace)
- [stackTraceLimit](BotDisconnectedWaitingForResponseError.md#stacktracelimit)

### Accessors

- [expectedResponse](BotDisconnectedWaitingForResponseError.md#expectedresponse)
- [responsesReceived](BotDisconnectedWaitingForResponseError.md#responsesreceived)

### Methods

- [captureStackTrace](BotDisconnectedWaitingForResponseError.md#capturestacktrace)

## Constructors

### constructor

• **new BotDisconnectedWaitingForResponseError**(`_expectedResponse`, `_responsesReceived?`): [`BotDisconnectedWaitingForResponseError`](BotDisconnectedWaitingForResponseError.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `_expectedResponse` | `string` | `undefined` |
| `_responsesReceived` | readonly (`StructuredMessageTextBody` \| `StructuredMessageStructuredBody`)[] | `[]` |

#### Returns

[`BotDisconnectedWaitingForResponseError`](BotDisconnectedWaitingForResponseError.md)

#### Overrides

Error.constructor

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:59](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L59)

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1076

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1075

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1077

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Accessors

### expectedResponse

• `get` **expectedResponse**(): `string`

#### Returns

`string`

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:89](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L89)

___

### responsesReceived

• `get` **responsesReceived**(): readonly (`StructuredMessageTextBody` \| `StructuredMessageStructuredBody`)[]

#### Returns

readonly (`StructuredMessageTextBody` \| `StructuredMessageStructuredBody`)[]

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:93](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L93)

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
