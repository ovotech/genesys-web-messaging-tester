[**Genesys Web Messaging Tester**](../README.md)

***

[Genesys Web Messaging Tester](../README.md) / ReorderedMessageDelayer

# Class: ReorderedMessageDelayer

Defined in: [packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts:23](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts#L23)

Reorders messages with a timestamp, being sure to maintain the overall order of messages with/without
timestamps.

> All messaging follows a request/response pattern. However, web messaging is an asynchronous
> channel and therefore no guarantee to ordering is provided.
> Source: https://developer.genesys.cloud/commdigital/digital/webmessaging/websocketapi#messaging

## Extends

- `EventEmitter`

## Implements

- [`MessageDelayer`](../interfaces/MessageDelayer.md)

## Constructors

### Constructor

> **new ReorderedMessageDelayer**(`delayBeforeEmittingInMs`, `intervalInMs`, `intervalSet`, `intervalClear`): `ReorderedMessageDelayer`

Defined in: [packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts:34](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts#L34)

#### Parameters

##### delayBeforeEmittingInMs

`number` = `1000`

##### intervalInMs

`number` = `1000`

##### intervalSet

(`callback`, `ms?`, ...`args`) => `Timeout`

##### intervalClear

(`intervalId`) => `void`

#### Returns

`ReorderedMessageDelayer`

#### Overrides

`EventEmitter.constructor`

## Properties

### captureRejections

> `static` **captureRejections**: `boolean`

Defined in: node\_modules/@types/node/events.d.ts:44

Sets or gets the default captureRejection value for all emitters.

#### Inherited from

`EventEmitter.captureRejections`

***

### captureRejectionSymbol

> `readonly` `static` **captureRejectionSymbol**: *typeof* [`captureRejectionSymbol`](WebMessengerGuestSession.md#capturerejectionsymbol)

Defined in: node\_modules/@types/node/events.d.ts:38

#### Inherited from

`EventEmitter.captureRejectionSymbol`

***

### defaultMaxListeners

> `static` **defaultMaxListeners**: `number`

Defined in: node\_modules/@types/node/events.d.ts:45

#### Inherited from

`EventEmitter.defaultMaxListeners`

***

### errorMonitor

> `readonly` `static` **errorMonitor**: *typeof* [`errorMonitor`](WebMessengerGuestSession.md#errormonitor)

Defined in: node\_modules/@types/node/events.d.ts:37

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

#### Inherited from

`EventEmitter.errorMonitor`

## Accessors

### delay

#### Get Signature

> **get** **delay**(): `number`

Defined in: [packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts:142](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts#L142)

##### Returns

`number`

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`delay`](../interfaces/MessageDelayer.md#delay)

***

### unorderdMessageDetected

#### Get Signature

> **get** **unorderdMessageDetected**(): `boolean`

Defined in: [packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts:69](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts#L69)

##### Returns

`boolean`

## Methods

### add()

> **add**(`message`, `received`): `void`

Defined in: [packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts:77](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/message-delayer/ReorderedMessageDelayer.ts#L77)

Add a message to the pool. Each message added reset a timer to wait for any other messages
before releasing the oldest message.

#### Parameters

##### message

[`Response`](../type-aliases/Response.md)\<`unknown`\>

##### received

`Date`

#### Returns

`void`

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`add`](../interfaces/MessageDelayer.md#add)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`addListener`](../interfaces/MessageDelayer.md#addlistener)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`emit`](../interfaces/MessageDelayer.md#emit)

#### Inherited from

`EventEmitter.emit`

***

### eventNames()

> **eventNames**(): (`string` \| `symbol`)[]

Defined in: node\_modules/@types/node/events.d.ts:72

#### Returns

(`string` \| `symbol`)[]

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`eventNames`](../interfaces/MessageDelayer.md#eventnames)

#### Inherited from

`EventEmitter.eventNames`

***

### getMaxListeners()

> **getMaxListeners**(): `number`

Defined in: node\_modules/@types/node/events.d.ts:64

#### Returns

`number`

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`getMaxListeners`](../interfaces/MessageDelayer.md#getmaxlisteners)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`listenerCount`](../interfaces/MessageDelayer.md#listenercount)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`listeners`](../interfaces/MessageDelayer.md#listeners)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`off`](../interfaces/MessageDelayer.md#off)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`on`](../interfaces/MessageDelayer.md#on)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`once`](../interfaces/MessageDelayer.md#once)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`prependListener`](../interfaces/MessageDelayer.md#prependlistener)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`prependOnceListener`](../interfaces/MessageDelayer.md#prependoncelistener)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`rawListeners`](../interfaces/MessageDelayer.md#rawlisteners)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`removeAllListeners`](../interfaces/MessageDelayer.md#removealllisteners)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`removeListener`](../interfaces/MessageDelayer.md#removelistener)

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

#### Implementation of

[`MessageDelayer`](../interfaces/MessageDelayer.md).[`setMaxListeners`](../interfaces/MessageDelayer.md#setmaxlisteners)

#### Inherited from

`EventEmitter.setMaxListeners`

***

### ~~listenerCount()~~

> `static` **listenerCount**(`emitter`, `event`): `number`

Defined in: node\_modules/@types/node/events.d.ts:26

#### Parameters

##### emitter

`EventEmitter`

##### event

`string` | `symbol`

#### Returns

`number`

#### Deprecated

since v4.0.0

#### Inherited from

`EventEmitter.listenerCount`

***

### on()

> `static` **on**(`emitter`, `event`): `AsyncIterableIterator`\<`any`\>

Defined in: node\_modules/@types/node/events.d.ts:23

#### Parameters

##### emitter

`EventEmitter`

##### event

`string`

#### Returns

`AsyncIterableIterator`\<`any`\>

#### Inherited from

`EventEmitter.on`

***

### once()

#### Call Signature

> `static` **once**(`emitter`, `event`): `Promise`\<`any`[]\>

Defined in: node\_modules/@types/node/events.d.ts:21

##### Parameters

###### emitter

`NodeEventTarget`

###### event

`string` | `symbol`

##### Returns

`Promise`\<`any`[]\>

##### Inherited from

`EventEmitter.once`

#### Call Signature

> `static` **once**(`emitter`, `event`): `Promise`\<`any`[]\>

Defined in: node\_modules/@types/node/events.d.ts:22

##### Parameters

###### emitter

`DOMEventTarget`

###### event

`string`

##### Returns

`Promise`\<`any`[]\>

##### Inherited from

`EventEmitter.once`
