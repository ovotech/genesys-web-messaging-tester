[Genesys Web Messaging Tester](../README.md) / TimeoutWaitingForDisconnectionError

# Class: TimeoutWaitingForDisconnectionError

## Hierarchy

- `Error`

  ↳ **`TimeoutWaitingForDisconnectionError`**

## Table of contents

### Constructors

- [constructor](TimeoutWaitingForDisconnectionError.md#constructor)

### Properties

- [message](TimeoutWaitingForDisconnectionError.md#message)
- [name](TimeoutWaitingForDisconnectionError.md#name)
- [stack](TimeoutWaitingForDisconnectionError.md#stack)
- [prepareStackTrace](TimeoutWaitingForDisconnectionError.md#preparestacktrace)
- [stackTraceLimit](TimeoutWaitingForDisconnectionError.md#stacktracelimit)

### Methods

- [captureStackTrace](TimeoutWaitingForDisconnectionError.md#capturestacktrace)

## Constructors

### constructor

• **new TimeoutWaitingForDisconnectionError**(): [`TimeoutWaitingForDisconnectionError`](TimeoutWaitingForDisconnectionError.md)

#### Returns

[`TimeoutWaitingForDisconnectionError`](TimeoutWaitingForDisconnectionError.md)

#### Overrides

Error.constructor

#### Defined in

[packages/genesys-web-messaging-tester/src/Conversation.ts:101](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L101)

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
