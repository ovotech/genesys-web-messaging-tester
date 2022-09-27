[Genesys Web Messaging Tester](../README.md) / TimeoutWaitingForResponseError

# Class: TimeoutWaitingForResponseError

## Hierarchy

- `Error`

  ↳ **`TimeoutWaitingForResponseError`**

## Table of contents

### Constructors

- [constructor](TimeoutWaitingForResponseError.md#constructor)

### Properties

- [message](TimeoutWaitingForResponseError.md#message)
- [name](TimeoutWaitingForResponseError.md#name)
- [stack](TimeoutWaitingForResponseError.md#stack)
- [prepareStackTrace](TimeoutWaitingForResponseError.md#preparestacktrace)
- [stackTraceLimit](TimeoutWaitingForResponseError.md#stacktracelimit)

### Accessors

- [expectedResponse](TimeoutWaitingForResponseError.md#expectedresponse)
- [responsesReceived](TimeoutWaitingForResponseError.md#responsesreceived)
- [timeoutInMs](TimeoutWaitingForResponseError.md#timeoutinms)

### Methods

- [captureStackTrace](TimeoutWaitingForResponseError.md#capturestacktrace)

## Constructors

### constructor

• **new TimeoutWaitingForResponseError**(`_timeoutInMs`, `_expectedResponse`, `_responsesReceived?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `_timeoutInMs` | `number` | `undefined` |
| `_expectedResponse` | `string` | `undefined` |
| `_responsesReceived` | readonly [`StructuredMessage`](../interfaces/StructuredMessage.md)[] | `[]` |

#### Overrides

Error.constructor

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:5](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L5)

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1041

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1040

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1042

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

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

[packages/genesys-web-messaging-tester/src/Conversation.ts:36](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L36)

___

### responsesReceived

• `get` **responsesReceived**(): readonly [`StructuredMessage`](../interfaces/StructuredMessage.md)[]

#### Returns

readonly [`StructuredMessage`](../interfaces/StructuredMessage.md)[]

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:40](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L40)

___

### timeoutInMs

• `get` **timeoutInMs**(): `number`

#### Returns

`number`

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:44](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L44)

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

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
