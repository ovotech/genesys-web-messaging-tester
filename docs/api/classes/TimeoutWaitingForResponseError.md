[**Genesys Web Messaging Tester**](../README.md)

***

[Genesys Web Messaging Tester](../README.md) / TimeoutWaitingForResponseError

# Class: TimeoutWaitingForResponseError

Defined in: [packages/genesys-web-messaging-tester/src/Conversation.ts:9](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L9)

## Extends

- `Error`

## Constructors

### Constructor

> **new TimeoutWaitingForResponseError**(`_timeoutInMs`, `_expectedResponse`, `_responsesReceived`): `TimeoutWaitingForResponseError`

Defined in: [packages/genesys-web-messaging-tester/src/Conversation.ts:10](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L10)

#### Parameters

##### \_timeoutInMs

`number`

##### \_expectedResponse

`string`

##### \_responsesReceived

readonly (`StructuredMessageTextBody` \| `StructuredMessageStructuredBody`)[] = `[]`

#### Returns

`TimeoutWaitingForResponseError`

#### Overrides

`Error.constructor`

## Properties

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/@types/node/globals.d.ts:11

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:13

#### Inherited from

`Error.stackTraceLimit`

## Accessors

### expectedResponse

#### Get Signature

> **get** **expectedResponse**(): `string`

Defined in: [packages/genesys-web-messaging-tester/src/Conversation.ts:43](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L43)

##### Returns

`string`

***

### responsesReceived

#### Get Signature

> **get** **responsesReceived**(): readonly (`StructuredMessageTextBody` \| `StructuredMessageStructuredBody`)[]

Defined in: [packages/genesys-web-messaging-tester/src/Conversation.ts:47](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L47)

##### Returns

readonly (`StructuredMessageTextBody` \| `StructuredMessageStructuredBody`)[]

***

### timeoutInMs

#### Get Signature

> **get** **timeoutInMs**(): `number`

Defined in: [packages/genesys-web-messaging-tester/src/Conversation.ts:53](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/Conversation.ts#L53)

##### Returns

`number`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/@types/node/globals.d.ts:4

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`
