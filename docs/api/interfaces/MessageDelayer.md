[**Genesys Web Messaging Tester**](../README.md)

***

[Genesys Web Messaging Tester](../README.md) / MessageDelayer

# Interface: MessageDelayer

Defined in: [packages/genesys-web-messaging-tester/src/genesys/message-delayer/MessageDelayer.ts:9](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/MessageDelayer.ts#L9)

Provides the ability to delay messages for the purpose of re-ordering them.
This is useful for reordering messages that are received out of order, presumably
due to it  being async and not guaranteeing order.

## Extends

- `EventEmitter`

## Accessors

### delay

#### Get Signature

> **get** **delay**(): `number`

Defined in: [packages/genesys-web-messaging-tester/src/genesys/message-delayer/MessageDelayer.ts:10](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/MessageDelayer.ts#L10)

##### Returns

`number`

## Methods

### add()

> **add**(`message`, `whenReceived`): `void`

Defined in: [packages/genesys-web-messaging-tester/src/genesys/message-delayer/MessageDelayer.ts:11](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/MessageDelayer.ts#L11)

#### Parameters

##### message

[`Response`](../type-aliases/Response.md)\<`unknown`\>

##### whenReceived

`Date`

#### Returns

`void`

***

### addListener()

> **addListener**(`event`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:57

#### Parameters

##### event

`string` | `symbol`

##### listener

(...`args`) => `void`

#### Returns

`this`

#### Inherited from

`EventEmitter.addListener`

***

### emit()

> **emit**(`event`, ...`args`): `boolean`

Defined in: node\_modules/@types/node/events.d.ts:67

#### Parameters

##### event

`string` | `symbol`

##### args

...`any`[]

#### Returns

`boolean`

#### Inherited from

`EventEmitter.emit`

***

### eventNames()

> **eventNames**(): (`string` \| `symbol`)[]

Defined in: node\_modules/@types/node/events.d.ts:72

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

`EventEmitter.eventNames`

***

### getMaxListeners()

> **getMaxListeners**(): `number`

Defined in: node\_modules/@types/node/events.d.ts:64

#### Returns

`number`

#### Inherited from

`EventEmitter.getMaxListeners`

***

### listenerCount()

> **listenerCount**(`event`): `number`

Defined in: node\_modules/@types/node/events.d.ts:68

#### Parameters

##### event

`string` | `symbol`

#### Returns

`number`

#### Inherited from

`EventEmitter.listenerCount`

***

### listeners()

> **listeners**(`event`): `Function`[]

Defined in: node\_modules/@types/node/events.d.ts:65

#### Parameters

##### event

`string` | `symbol`

#### Returns

`Function`[]

#### Inherited from

`EventEmitter.listeners`

***

### off()

> **off**(`event`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:61

#### Parameters

##### event

`string` | `symbol`

##### listener

(...`args`) => `void`

#### Returns

`this`

#### Inherited from

`EventEmitter.off`

***

### on()

> **on**(`event`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:58

#### Parameters

##### event

`string` | `symbol`

##### listener

(...`args`) => `void`

#### Returns

`this`

#### Inherited from

`EventEmitter.on`

***

### once()

> **once**(`event`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:59

#### Parameters

##### event

`string` | `symbol`

##### listener

(...`args`) => `void`

#### Returns

`this`

#### Inherited from

`EventEmitter.once`

***

### prependListener()

> **prependListener**(`event`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:70

#### Parameters

##### event

`string` | `symbol`

##### listener

(...`args`) => `void`

#### Returns

`this`

#### Inherited from

`EventEmitter.prependListener`

***

### prependOnceListener()

> **prependOnceListener**(`event`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:71

#### Parameters

##### event

`string` | `symbol`

##### listener

(...`args`) => `void`

#### Returns

`this`

#### Inherited from

`EventEmitter.prependOnceListener`

***

### rawListeners()

> **rawListeners**(`event`): `Function`[]

Defined in: node\_modules/@types/node/events.d.ts:66

#### Parameters

##### event

`string` | `symbol`

#### Returns

`Function`[]

#### Inherited from

`EventEmitter.rawListeners`

***

### removeAllListeners()

> **removeAllListeners**(`event?`): `this`

Defined in: node\_modules/@types/node/events.d.ts:62

#### Parameters

##### event?

`string` | `symbol`

#### Returns

`this`

#### Inherited from

`EventEmitter.removeAllListeners`

***

### removeListener()

> **removeListener**(`event`, `listener`): `this`

Defined in: node\_modules/@types/node/events.d.ts:60

#### Parameters

##### event

`string` | `symbol`

##### listener

(...`args`) => `void`

#### Returns

`this`

#### Inherited from

`EventEmitter.removeListener`

***

### setMaxListeners()

> **setMaxListeners**(`n`): `this`

Defined in: node\_modules/@types/node/events.d.ts:63

#### Parameters

##### n

`number`

#### Returns

`this`

#### Inherited from

`EventEmitter.setMaxListeners`
