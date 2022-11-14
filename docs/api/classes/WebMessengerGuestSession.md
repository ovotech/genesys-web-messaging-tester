[Genesys Web Messaging Tester](../README.md) / WebMessengerGuestSession

# Class: WebMessengerGuestSession

**`See`**

https://developer.genesys.cloud/api/digital/webmessaging/websocketapi#configure-a-guest-session

## Hierarchy

- `EventEmitter`

  ↳ **`WebMessengerGuestSession`**

## Table of contents

### Constructors

- [constructor](WebMessengerGuestSession.md#constructor)

### Properties

- [wsFactory](WebMessengerGuestSession.md#wsfactory)
- [captureRejectionSymbol](WebMessengerGuestSession.md#capturerejectionsymbol)
- [captureRejections](WebMessengerGuestSession.md#capturerejections)
- [defaultMaxListeners](WebMessengerGuestSession.md#defaultmaxlisteners)
- [errorMonitor](WebMessengerGuestSession.md#errormonitor)

### Methods

- [addListener](WebMessengerGuestSession.md#addlistener)
- [close](WebMessengerGuestSession.md#close)
- [emit](WebMessengerGuestSession.md#emit)
- [eventNames](WebMessengerGuestSession.md#eventnames)
- [getMaxListeners](WebMessengerGuestSession.md#getmaxlisteners)
- [listenerCount](WebMessengerGuestSession.md#listenercount)
- [listeners](WebMessengerGuestSession.md#listeners)
- [off](WebMessengerGuestSession.md#off)
- [on](WebMessengerGuestSession.md#on)
- [once](WebMessengerGuestSession.md#once)
- [prependListener](WebMessengerGuestSession.md#prependlistener)
- [prependOnceListener](WebMessengerGuestSession.md#prependoncelistener)
- [rawListeners](WebMessengerGuestSession.md#rawlisteners)
- [removeAllListeners](WebMessengerGuestSession.md#removealllisteners)
- [removeListener](WebMessengerGuestSession.md#removelistener)
- [sendText](WebMessengerGuestSession.md#sendtext)
- [setMaxListeners](WebMessengerGuestSession.md#setmaxlisteners)
- [listenerCount](WebMessengerGuestSession.md#listenercount-1)
- [on](WebMessengerGuestSession.md#on-1)
- [once](WebMessengerGuestSession.md#once-1)

## Constructors

### constructor

• **new WebMessengerGuestSession**(`config`, `participantData?`, `wsFactory?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`SessionConfig`](../interfaces/SessionConfig.md) |
| `participantData` | `Record`<`string`, `string`\> |
| `wsFactory` | (`url`: `string`, `options?`: `ClientRequestArgs` \| `ClientOptions`) => `WebSocket` |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:31](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L31)

## Properties

### wsFactory

• `Readonly` **wsFactory**: (`url`: `string`, `options?`: `ClientRequestArgs` \| `ClientOptions`) => `WebSocket`

#### Type declaration

▸ (`url`, `options?`): `WebSocket`

##### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `options?` | `ClientRequestArgs` \| `ClientOptions` |

##### Returns

`WebSocket`

#### Defined in

[packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:34](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L34)

___

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

▸ **addListener**(`event`, `listener`): [`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/events.d.ts:57

___

### close

▸ **close**(): `void`

#### Returns

`void`

#### Defined in

[packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:120](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L120)

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

▸ **off**(`event`, `listener`): [`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:61

___

### on

▸ **on**(`event`, `listener`): [`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:58

___

### once

▸ **once**(`event`, `listener`): [`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:59

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/events.d.ts:70

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`WebMessengerGuestSession`](WebMessengerGuestSession.md)

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

▸ **removeAllListeners**(`event?`): [`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/events.d.ts:62

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/events.d.ts:60

___

### sendText

▸ **sendText**(`message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

#### Returns

`void`

#### Defined in

[packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:97](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L97)

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`WebMessengerGuestSession`](WebMessengerGuestSession.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`WebMessengerGuestSession`](WebMessengerGuestSession.md)

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
