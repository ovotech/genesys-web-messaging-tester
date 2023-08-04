[Genesys Web Messaging Tester](../README.md) / SessionTranscriber

# Class: SessionTranscriber

Transcribes a Web Messenger session into an array of transcribed messages.

## Hierarchy

- `EventEmitter`

  ↳ **`SessionTranscriber`**

## Table of contents

### Constructors

- [constructor](SessionTranscriber.md#constructor)

### Properties

- [captureRejectionSymbol](SessionTranscriber.md#capturerejectionsymbol)
- [captureRejections](SessionTranscriber.md#capturerejections)
- [defaultMaxListeners](SessionTranscriber.md#defaultmaxlisteners)
- [errorMonitor](SessionTranscriber.md#errormonitor)

### Methods

- [addListener](SessionTranscriber.md#addlistener)
- [emit](SessionTranscriber.md#emit)
- [eventNames](SessionTranscriber.md#eventnames)
- [getMaxListeners](SessionTranscriber.md#getmaxlisteners)
- [getTranscript](SessionTranscriber.md#gettranscript)
- [listenerCount](SessionTranscriber.md#listenercount)
- [listeners](SessionTranscriber.md#listeners)
- [off](SessionTranscriber.md#off)
- [on](SessionTranscriber.md#on)
- [once](SessionTranscriber.md#once)
- [prependListener](SessionTranscriber.md#prependlistener)
- [prependOnceListener](SessionTranscriber.md#prependoncelistener)
- [rawListeners](SessionTranscriber.md#rawlisteners)
- [removeAllListeners](SessionTranscriber.md#removealllisteners)
- [removeListener](SessionTranscriber.md#removelistener)
- [setMaxListeners](SessionTranscriber.md#setmaxlisteners)
- [listenerCount](SessionTranscriber.md#listenercount-1)
- [on](SessionTranscriber.md#on-1)
- [once](SessionTranscriber.md#once-1)

## Constructors

### constructor

• **new SessionTranscriber**(`messengerSession`, `«destructured»?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `messengerSession` | [`WebMessengerSession`](../interfaces/WebMessengerSession.md) |
| `«destructured»` | `Object` |
| › `nameForClient?` | `string` |
| › `nameForServer?` | `string` |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts:27](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts#L27)

## Properties

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](WebMessengerGuestSession.md#capturerejectionsymbol)

#### Inherited from

EventEmitter.captureRejectionSymbol

#### Defined in

node_modules/@types/node/events.d.ts:38

___

### captureRejections

▪ `Static` **captureRejections**: `boolean`

Sets or gets the default captureRejection value for all emitters.

#### Inherited from

EventEmitter.captureRejections

#### Defined in

node_modules/@types/node/events.d.ts:44

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:45

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](WebMessengerGuestSession.md#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

#### Inherited from

EventEmitter.errorMonitor

#### Defined in

node_modules/@types/node/events.d.ts:37

## Methods

### addListener

▸ **addListener**(`event`, `listener`): [`SessionTranscriber`](SessionTranscriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`SessionTranscriber`](SessionTranscriber.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/events.d.ts:57

___

### emit

▸ **emit**(`event`, `...args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/events.d.ts:67

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/events.d.ts:72

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:64

___

### getTranscript

▸ **getTranscript**(): [`TranscribedMessage`](../interfaces/TranscribedMessage.md)[]

#### Returns

[`TranscribedMessage`](../interfaces/TranscribedMessage.md)[]

#### Defined in

[packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts:68](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts#L68)

___

### listenerCount

▸ **listenerCount**(`event`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:68

___

### listeners

▸ **listeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/events.d.ts:65

___

### off

▸ **off**(`event`, `listener`): [`SessionTranscriber`](SessionTranscriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`SessionTranscriber`](SessionTranscriber.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:61

___

### on

▸ **on**(`event`, `listener`): [`SessionTranscriber`](SessionTranscriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`SessionTranscriber`](SessionTranscriber.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:58

___

### once

▸ **once**(`event`, `listener`): [`SessionTranscriber`](SessionTranscriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`SessionTranscriber`](SessionTranscriber.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:59

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`SessionTranscriber`](SessionTranscriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`SessionTranscriber`](SessionTranscriber.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/events.d.ts:70

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`SessionTranscriber`](SessionTranscriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`SessionTranscriber`](SessionTranscriber.md)

#### Inherited from

EventEmitter.prependOnceListener

#### Defined in

node_modules/@types/node/events.d.ts:71

___

### rawListeners

▸ **rawListeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/events.d.ts:66

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`SessionTranscriber`](SessionTranscriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`SessionTranscriber`](SessionTranscriber.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/events.d.ts:62

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`SessionTranscriber`](SessionTranscriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`SessionTranscriber`](SessionTranscriber.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/events.d.ts:60

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`SessionTranscriber`](SessionTranscriber.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`SessionTranscriber`](SessionTranscriber.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:63

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

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:26

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

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:23

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

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:21

▸ `Static` **once**(`emitter`, `event`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `event` | `string` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:22
