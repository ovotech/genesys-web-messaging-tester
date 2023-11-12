[Genesys Web Messaging Tester](../README.md) / MessageDelayer

# Interface: MessageDelayer

Provides the ability to delay messages for the purpose of re-ordering them.
This is useful for reordering messages that are received out of order, presumably
due to it  being async and not guaranteeing order.

## Hierarchy

- `EventEmitter`

  ↳ **`MessageDelayer`**

## Implemented by

- [`ReorderedMessageDelayer`](../classes/ReorderedMessageDelayer.md)

## Table of contents

### Accessors

- [delay](MessageDelayer.md#delay)

### Methods

- [add](MessageDelayer.md#add)
- [addListener](MessageDelayer.md#addlistener)
- [emit](MessageDelayer.md#emit)
- [eventNames](MessageDelayer.md#eventnames)
- [getMaxListeners](MessageDelayer.md#getmaxlisteners)
- [listenerCount](MessageDelayer.md#listenercount)
- [listeners](MessageDelayer.md#listeners)
- [off](MessageDelayer.md#off)
- [on](MessageDelayer.md#on)
- [once](MessageDelayer.md#once)
- [prependListener](MessageDelayer.md#prependlistener)
- [prependOnceListener](MessageDelayer.md#prependoncelistener)
- [rawListeners](MessageDelayer.md#rawlisteners)
- [removeAllListeners](MessageDelayer.md#removealllisteners)
- [removeListener](MessageDelayer.md#removelistener)
- [setMaxListeners](MessageDelayer.md#setmaxlisteners)

## Accessors

### delay

• `get` **delay**(): `number`

#### Returns

`number`

#### Defined in

[packages/genesys-web-messaging-tester/src/genesys/message-delayer/MessageDelayer.ts:10](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/MessageDelayer.ts#L10)

## Methods

### add

▸ **add**(`message`, `whenReceived`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`Response`](../README.md#response)<`unknown`\> |
| `whenReceived` | `Date` |

#### Returns

`void`

#### Defined in

[packages/genesys-web-messaging-tester/src/genesys/message-delayer/MessageDelayer.ts:11](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/MessageDelayer.ts#L11)

___

### addListener

▸ **addListener**(`event`, `listener`): [`MessageDelayer`](MessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MessageDelayer`](MessageDelayer.md)

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

▸ **off**(`event`, `listener`): [`MessageDelayer`](MessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MessageDelayer`](MessageDelayer.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:61

___

### on

▸ **on**(`event`, `listener`): [`MessageDelayer`](MessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MessageDelayer`](MessageDelayer.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:58

___

### once

▸ **once**(`event`, `listener`): [`MessageDelayer`](MessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MessageDelayer`](MessageDelayer.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:59

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`MessageDelayer`](MessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MessageDelayer`](MessageDelayer.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/events.d.ts:70

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`MessageDelayer`](MessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MessageDelayer`](MessageDelayer.md)

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

▸ **removeAllListeners**(`event?`): [`MessageDelayer`](MessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`MessageDelayer`](MessageDelayer.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/events.d.ts:62

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`MessageDelayer`](MessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`MessageDelayer`](MessageDelayer.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/events.d.ts:60

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`MessageDelayer`](MessageDelayer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`MessageDelayer`](MessageDelayer.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:63
