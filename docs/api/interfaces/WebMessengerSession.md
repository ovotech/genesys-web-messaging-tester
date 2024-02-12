[Genesys Web Messaging Tester](../README.md) / WebMessengerSession

# Interface: WebMessengerSession

## Hierarchy

- `EventEmitter`

  ↳ **`WebMessengerSession`**

## Table of contents

### Accessors

- [messageDelayInMs](WebMessengerSession.md#messagedelayinms)

### Methods

- [addListener](WebMessengerSession.md#addlistener)
- [close](WebMessengerSession.md#close)
- [emit](WebMessengerSession.md#emit)
- [eventNames](WebMessengerSession.md#eventnames)
- [getMaxListeners](WebMessengerSession.md#getmaxlisteners)
- [listenerCount](WebMessengerSession.md#listenercount)
- [listeners](WebMessengerSession.md#listeners)
- [off](WebMessengerSession.md#off)
- [on](WebMessengerSession.md#on)
- [once](WebMessengerSession.md#once)
- [prependListener](WebMessengerSession.md#prependlistener)
- [prependOnceListener](WebMessengerSession.md#prependoncelistener)
- [rawListeners](WebMessengerSession.md#rawlisteners)
- [removeAllListeners](WebMessengerSession.md#removealllisteners)
- [removeListener](WebMessengerSession.md#removelistener)
- [sendText](WebMessengerSession.md#sendtext)
- [setMaxListeners](WebMessengerSession.md#setmaxlisteners)

## Accessors

### messageDelayInMs

• `get` **messageDelayInMs**(): `number`

The Web Messenger server can sometimes return responses out of order. To cater for this
we have to have a delay after every message is received before passing it to any listeners
of the implementation. This delay hopefully provides enough time for any messages that should
have preceded the other to be received and ordered.

This delay should be taken into account for any timeout values of downstream functionality.

#### Returns

`number`

#### Defined in

[packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:21](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L21)

## Methods

### addListener

▸ **addListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

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

[packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:25](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L25)

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

▸ **off**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:61

___

### on

▸ **on**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:58

___

### once

▸ **once**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:59

___

### prependListener

▸ **prependListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/events.d.ts:70

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

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

▸ **removeAllListeners**(`event?`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

`this`

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/events.d.ts:62

___

### removeListener

▸ **removeListener**(`event`, `listener`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

`this`

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

[packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:23](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L23)

___

### setMaxListeners

▸ **setMaxListeners**(`n`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

`this`

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:63
