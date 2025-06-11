[**Genesys Web Messaging Tester**](../README.md)

***

[Genesys Web Messaging Tester](../README.md) / WebMessageServerConnectionFixture

# Class: WebMessageServerConnectionFixture

Defined in: [packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:4](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L4)

## Constructors

### Constructor

> **new WebMessageServerConnectionFixture**(`ws`): `WebMessageServerConnectionFixture`

Defined in: [packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:5](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L5)

#### Parameters

##### ws

`WebSocket`

#### Returns

`WebMessageServerConnectionFixture`

## Methods

### simulateInboundTextStructuredMessage()

> **simulateInboundTextStructuredMessage**(`text`, `date`): `void`

Defined in: [packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:43](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L43)

#### Parameters

##### text

`string`

##### date

`Date` = `...`

#### Returns

`void`

***

### simulateOutboundDisconnectEventStructuredMessage()

> **simulateOutboundDisconnectEventStructuredMessage**(`date`): `void`

Defined in: [packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:38](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L38)

#### Parameters

##### date

`Date` = `...`

#### Returns

`void`

***

### simulateOutboundTextStructuredMessage()

> **simulateOutboundTextStructuredMessage**(`text`, `date`): `void`

Defined in: [packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:33](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L33)

#### Parameters

##### text

`string`

##### date

`Date` = `...`

#### Returns

`void`

***

### simulateSessionResponseMessage()

> **simulateSessionResponseMessage**(): `void`

Defined in: [packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:28](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L28)

#### Returns

`void`

***

### waitForConnectionToClose()

> **waitForConnectionToClose**(): `Promise`\<`void`\>

Defined in: [packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:24](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L24)

#### Returns

`Promise`\<`void`\>

***

### waitForMessage()

> **waitForMessage**(): `Promise`\<`any`\>

Defined in: [packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:8](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L8)

#### Returns

`Promise`\<`any`\>
