[Genesys Web Messaging Tester](../README.md) / Transcriber

# Class: Transcriber

Transcribes a Web Messenger session into an array of transcribed messages.

## Hierarchy

- `EventEmitter`

  ↳ **`Transcriber`**

## Table of contents

### Constructors

- [constructor](Transcriber.md#constructor)

### Properties

- [captureRejectionSymbol](Transcriber.md#capturerejectionsymbol)
- [captureRejections](Transcriber.md#capturerejections)
- [defaultMaxListeners](Transcriber.md#defaultmaxlisteners)
- [errorMonitor](Transcriber.md#errormonitor)

### Methods

- [addListener](Transcriber.md#addlistener)
- [emit](Transcriber.md#emit)
- [eventNames](Transcriber.md#eventnames)
- [getMaxListeners](Transcriber.md#getmaxlisteners)
- [getTranscript](Transcriber.md#gettranscript)
- [listenerCount](Transcriber.md#listenercount)
- [listeners](Transcriber.md#listeners)
- [off](Transcriber.md#off)
- [on](Transcriber.md#on)
- [once](Transcriber.md#once)
- [prependListener](Transcriber.md#prependlistener)
- [prependOnceListener](Transcriber.md#prependoncelistener)
- [rawListeners](Transcriber.md#rawlisteners)
- [removeAllListeners](Transcriber.md#removealllisteners)
- [removeListener](Transcriber.md#removelistener)
- [setMaxListeners](Transcriber.md#setmaxlisteners)
- [listenerCount](Transcriber.md#listenercount-1)
- [on](Transcriber.md#on-1)
- [once](Transcriber.md#once-1)

## Constructors

### constructor

• **new Transcriber**(`messengerSession`, `__namedParameters?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `messengerSession` | [`WebMessengerSession`](../interfaces/WebMessengerSession.md) |
| `__namedParameters` | `Object` |
| `__namedParameters.nameForClient?` | `string` |
| `__namedParameters.nameForServer?` | `string` |

#### Defined in

[packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts:28](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts#L28)

## Properties

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](WebMessengerGuestSession.md#capturerejectionsymbol)

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:38

___

### captureRejections

▪ `Static` **captureRejections**: `boolean`

Sets or gets the default captureRejection value for all emitters.

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:44

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:45

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](WebMessengerGuestSession.md#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:37

## Methods

### addListener

▸ **addListener**(`event`, `listener`): [`Transcriber`](Transcriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Transcriber`](Transcriber.md)

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:57

___

### emit

▸ **emit**(`event`, ...`args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:67

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:72

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:64

___

### getTranscript

▸ **getTranscript**(): [`TranscribedMessage`](../interfaces/TranscribedMessage.md)[]

#### Returns

[`TranscribedMessage`](../interfaces/TranscribedMessage.md)[]

#### Defined in

[packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts:65](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts#L65)

___

### listenerCount

▸ **listenerCount**(`event`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`number`

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:68

___

### listeners

▸ **listeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:65

___

### off

▸ **off**(`event`, `listener`): [`Transcriber`](Transcriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Transcriber`](Transcriber.md)

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:61

___

### on

▸ **on**(`event`, `listener`): [`Transcriber`](Transcriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"messageTranscribed"`` |
| `listener` | (`event`: [`TranscribedMessage`](../interfaces/TranscribedMessage.md)) => `void` |

#### Returns

[`Transcriber`](Transcriber.md)

#### Defined in

[packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts:14](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts#L14)

▸ **on**(`event`, `listener`): [`Transcriber`](Transcriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `listener` | `Function` |

#### Returns

[`Transcriber`](Transcriber.md)

#### Defined in

[packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts:16](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts#L16)

___

### once

▸ **once**(`event`, `listener`): [`Transcriber`](Transcriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Transcriber`](Transcriber.md)

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:59

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`Transcriber`](Transcriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Transcriber`](Transcriber.md)

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:70

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`Transcriber`](Transcriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Transcriber`](Transcriber.md)

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:71

___

### rawListeners

▸ **rawListeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:66

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`Transcriber`](Transcriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`Transcriber`](Transcriber.md)

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:62

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`Transcriber`](Transcriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Transcriber`](Transcriber.md)

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:60

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`Transcriber`](Transcriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`Transcriber`](Transcriber.md)

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:63

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `event`): `number`

**`Deprecated`**

since v4.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` \| `symbol` |

#### Returns

`number`

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:26

___

### on

▸ `Static` **on**(`emitter`, `event`): `AsyncIterableIterator`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` |

#### Returns

`AsyncIterableIterator`<`any`\>

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:23

___

### once

▸ `Static` **once**(`emitter`, `event`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `event` | `string` \| `symbol` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:21

▸ `Static` **once**(`emitter`, `event`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `event` | `string` |

#### Returns

`Promise`<`any`[]\>

#### Defined in

node_modules/@types/node/ts4.8/events.d.ts:22
