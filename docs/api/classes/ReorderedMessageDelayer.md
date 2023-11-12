[Genesys Web Messaging Tester](../README.md) / ReorderedMessageDelayer

# Class: ReorderedMessageDelayer

Reorders messages with a timestamp, being sure to maintain the overall order of messages with/without
timestamps.

> All messaging follows a request/response pattern. However, web messaging is an asynchronous
> channel and therefore no guarantee to ordering is provided.
> Source: https://developer.genesys.cloud/commdigital/digital/webmessaging/websocketapi#messaging

## Hierarchy

- `EventEmitter`

  ↳ **`ReorderedMessageDelayer`**

## Implements

- [`MessageDelayer`](../interfaces/MessageDelayer.md)

## Table of contents

### Constructors

- [constructor](ReorderedMessageDelayer.md#constructor)

### Properties

- [captureRejectionSymbol](ReorderedMessageDelayer.md#capturerejectionsymbol)
- [captureRejections](ReorderedMessageDelayer.md#capturerejections)
- [defaultMaxListeners](ReorderedMessageDelayer.md#defaultmaxlisteners)
- [errorMonitor](ReorderedMessageDelayer.md#errormonitor)

### Accessors

- [delay](ReorderedMessageDelayer.md#delay)
- [unorderdMessageDetected](ReorderedMessageDelayer.md#unorderdmessagedetected)

### Methods

- [add](ReorderedMessageDelayer.md#add)
- [addListener](ReorderedMessageDelayer.md#addlistener)
- [emit](ReorderedMessageDelayer.md#emit)
- [eventNames](ReorderedMessageDelayer.md#eventnames)
- [getMaxListeners](ReorderedMessageDelayer.md#getmaxlisteners)
- [listenerCount](ReorderedMessageDelayer.md#listenercount)
- [listeners](ReorderedMessageDelayer.md#listeners)
- [off](ReorderedMessageDelayer.md#off)
- [on](ReorderedMessageDelayer.md#on)
- [once](ReorderedMessageDelayer.md#once)
- [prependListener](ReorderedMessageDelayer.md#prependlistener)
- [prependOnceListener](ReorderedMessageDelayer.md#prependoncelistener)
- [rawListeners](ReorderedMessageDelayer.md#rawlisteners)
- [removeAllListeners](ReorderedMessageDelayer.md#removealllisteners)
- [removeListener](ReorderedMessageDelayer.md#removelistener)
- [setMaxListeners](ReorderedMessageDelayer.md#setmaxlisteners)
- [listenerCount](ReorderedMessageDelayer.md#listenercount-1)
- [on](ReorderedMessageDelayer.md#on-1)
- [once](ReorderedMessageDelayer.md#once-1)

## Constructors

### constructor

• **new ReorderedMessageDelayer**(`delayBeforeEmittingInMs?`, `intervalInMs?`, `intervalSet?`, `intervalClear?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `delayBeforeEmittingInMs` | `number` | `1000` |
| `intervalInMs` | `number` | `1000` |
| `intervalSet` | (`callback`: (...`args`: `any`[]) => `void`, `ms?`: `number`, ...`args`: `any`[]) => `NodeJS.Timeout` | `setInterval` |
| `intervalClear` | (`intervalId`: `undefined` \| `string` \| `number` \| `Timeout`) => `void` | `clearInterval` |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts:34](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts#L34)

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

## Accessors

### delay

• `get` **delay**(): `number`

#### Returns

`number`

#### Implementation of

MessageDelayer.delay

#### Defined in

[packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts:142](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts#L142)

___

### unorderdMessageDetected

• `get` **unorderdMessageDetected**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts:69](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts#L69)

## Methods

### add

▸ **add**(`message`, `received`): `void`

Add a message to the pool. Each message added reset a timer to wait for any other messages
before releasing the oldest message.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`Response`](../README.md#response)\<`unknown`\> |
| `received` | `Date` |

#### Returns

`void`

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[add](../interfaces/MessageDelayer.md#add)

#### Defined in

[packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts:77](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts#L77)

___

### addListener

▸ **addListener**(`event`, `listener`): [`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[addListener](../interfaces/MessageDelayer.md#addlistener)

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

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[emit](../interfaces/MessageDelayer.md#emit)

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/events.d.ts:67

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[eventNames](../interfaces/MessageDelayer.md#eventnames)

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/events.d.ts:72

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[getMaxListeners](../interfaces/MessageDelayer.md#getmaxlisteners)

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:64

___

### listenerCount

▸ **listenerCount**(`event`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`number`

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[listenerCount](../interfaces/MessageDelayer.md#listenercount)

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

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[listeners](../interfaces/MessageDelayer.md#listeners)

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/events.d.ts:65

___

### off

▸ **off**(`event`, `listener`): [`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[off](../interfaces/MessageDelayer.md#off)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:61

___

### on

▸ **on**(`event`, `listener`): [`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[on](../interfaces/MessageDelayer.md#on)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:58

___

### once

▸ **once**(`event`, `listener`): [`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[once](../interfaces/MessageDelayer.md#once)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:59

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[prependListener](../interfaces/MessageDelayer.md#prependlistener)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/events.d.ts:70

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[prependOnceListener](../interfaces/MessageDelayer.md#prependoncelistener)

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

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[rawListeners](../interfaces/MessageDelayer.md#rawlisteners)

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/events.d.ts:66

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[removeAllListeners](../interfaces/MessageDelayer.md#removealllisteners)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/events.d.ts:62

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[removeListener](../interfaces/MessageDelayer.md#removelistener)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/events.d.ts:60

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`ReorderedMessageDelayer`](ReorderedMessageDelayer.md)

#### Implementation of

[MessageDelayer](../interfaces/MessageDelayer.md).[setMaxListeners](../interfaces/MessageDelayer.md#setmaxlisteners)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:63

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `event`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` \| `symbol` |

#### Returns

`number`

**`Deprecated`**

since v4.0.0

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:26

___

### on

▸ `Static` **on**(`emitter`, `event`): `AsyncIterableIterator`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` |

#### Returns

`AsyncIterableIterator`\<`any`\>

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:23

___

### once

▸ `Static` **once**(`emitter`, `event`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `event` | `string` \| `symbol` |

#### Returns

`Promise`\<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:21

▸ `Static` **once**(`emitter`, `event`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `event` | `string` |

#### Returns

`Promise`\<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:22
