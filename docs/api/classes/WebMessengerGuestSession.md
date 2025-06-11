[**Genesys Web Messaging Tester**](../README.md)

***

[Genesys Web Messaging Tester](../README.md) / WebMessengerGuestSession

# Class: WebMessengerGuestSession

Defined in: [packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:45](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L45)

## See

https://developer.genesys.cloud/api/digital/webmessaging/websocketapi#configure-a-guest-session

## Extends

- `EventEmitter`

## Constructors

### Constructor

> **new WebMessengerGuestSession**(`config`, `participantData`, `messageDelayer`, `wsFactory`): `WebMessengerGuestSession`

Defined in: [packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:51](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L51)

#### Parameters

##### config

[`SessionConfig`](../interfaces/SessionConfig.md)

##### participantData

`Record`\<`string`, `string`\> = `{}`

##### messageDelayer

[`MessageDelayer`](../interfaces/MessageDelayer.md) = `...`

##### wsFactory

(`url`, `options?`) => `WebSocket`

#### Returns

`WebMessengerGuestSession`

#### Overrides

`EventEmitter.constructor`

## Properties

### wsFactory()

> `readonly` **wsFactory**: (`url`, `options?`) => `WebSocket`

Defined in: [packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:55](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L55)

#### Parameters

##### url

`string`

##### options?

`ClientOptions` | `ClientRequestArgs`

#### Returns

`WebSocket`

***

### captureRejections

> `static` **captureRejections**: `boolean`

Defined in: node\_modules/@types/node/events.d.ts:44

Sets or gets the default captureRejection value for all emitters.

#### Inherited from

`EventEmitter.captureRejections`

***

### captureRejectionSymbol

> `readonly` `static` **captureRejectionSymbol**: *typeof* [`captureRejectionSymbol`](#capturerejectionsymbol)

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

> `readonly` `static` **errorMonitor**: *typeof* [`errorMonitor`](#errormonitor)

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

### messageDelayInMs

#### Get Signature

> **get** **messageDelayInMs**(): `number`

Defined in: [packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:71](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L71)

##### Returns

`number`

## Methods

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

### close()

> **close**(): `void`

Defined in: [packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:147](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L147)

#### Returns

`void`

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

### sendText()

> **sendText**(`message`): `void`

Defined in: [packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:124](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L124)

#### Parameters

##### message

`string`

#### Returns

`void`

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
