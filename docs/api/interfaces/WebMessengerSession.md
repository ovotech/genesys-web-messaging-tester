[**Genesys Web Messaging Tester**](../README.md)

***

[Genesys Web Messaging Tester](../README.md) / WebMessengerSession

# Interface: WebMessengerSession

Defined in: [packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:12](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L12)

## Extends

- `EventEmitter`

## Accessors

### messageDelayInMs

#### Get Signature

> **get** **messageDelayInMs**(): `number`

Defined in: [packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:21](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L21)

The Web Messenger server can sometimes return responses out of order. To cater for this
we have to have a delay after every message is received before passing it to any listeners
of the implementation. This delay hopefully provides enough time for any messages that should
have preceded the other to be received and ordered.

This delay should be taken into account for any timeout values of downstream functionality.

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

Defined in: [packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:25](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L25)

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

Defined in: [packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts:23](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/genesys/WebMessengerGuestSession.ts#L23)

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
