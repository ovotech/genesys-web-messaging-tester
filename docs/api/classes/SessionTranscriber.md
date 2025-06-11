[**Genesys Web Messaging Tester**](../README.md)

***

[Genesys Web Messaging Tester](../README.md) / SessionTranscriber

# Class: SessionTranscriber

Defined in: [packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts:21](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts#L21)

Transcribes a Web Messenger session into an array of transcribed messages.

## Extends

- `EventEmitter`

## Constructors

### Constructor

> **new SessionTranscriber**(`messengerSession`, `__namedParameters`): `SessionTranscriber`

Defined in: [packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts:27](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts#L27)

#### Parameters

##### messengerSession

[`WebMessengerSession`](../interfaces/WebMessengerSession.md)

##### \_\_namedParameters

###### nameForClient?

`string` = `'You'`

###### nameForServer?

`string` = `'Them'`

#### Returns

`SessionTranscriber`

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

### getTranscript()

> **getTranscript**(): [`TranscribedMessage`](../interfaces/TranscribedMessage.md)[]

Defined in: [packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts:68](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/transcribe/Transcriber.ts#L68)

#### Returns

[`TranscribedMessage`](../interfaces/TranscribedMessage.md)[]

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
