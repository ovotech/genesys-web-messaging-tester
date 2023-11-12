[Genesys Web Messaging Tester](../README.md) / WebMessageServerConnectionFixture

# Class: WebMessageServerConnectionFixture

## Table of contents

### Constructors

- [constructor](WebMessageServerConnectionFixture.md#constructor)

### Methods

- [simulateInboundTextStructuredMessage](WebMessageServerConnectionFixture.md#simulateinboundtextstructuredmessage)
- [simulateOutboundDisconnectEventStructuredMessage](WebMessageServerConnectionFixture.md#simulateoutbounddisconnecteventstructuredmessage)
- [simulateOutboundTextStructuredMessage](WebMessageServerConnectionFixture.md#simulateoutboundtextstructuredmessage)
- [simulateSessionResponseMessage](WebMessageServerConnectionFixture.md#simulatesessionresponsemessage)
- [waitForConnectionToClose](WebMessageServerConnectionFixture.md#waitforconnectiontoclose)
- [waitForMessage](WebMessageServerConnectionFixture.md#waitformessage)

## Constructors

### constructor

• **new WebMessageServerConnectionFixture**(`ws`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ws` | `WebSocket` |

#### Defined in

[packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:5](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L5)

## Methods

### simulateInboundTextStructuredMessage

▸ **simulateInboundTextStructuredMessage**(`text`, `date?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `date` | `Date` |

#### Returns

`void`

#### Defined in

[packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:42](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L42)

___

### simulateOutboundDisconnectEventStructuredMessage

▸ **simulateOutboundDisconnectEventStructuredMessage**(`date?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `date` | `Date` |

#### Returns

`void`

#### Defined in

[packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:37](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L37)

___

### simulateOutboundTextStructuredMessage

▸ **simulateOutboundTextStructuredMessage**(`text`, `date?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `date` | `Date` |

#### Returns

`void`

#### Defined in

[packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:32](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L32)

___

### simulateSessionResponseMessage

▸ **simulateSessionResponseMessage**(): `void`

#### Returns

`void`

#### Defined in

[packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:27](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L27)

___

### waitForConnectionToClose

▸ **waitForConnectionToClose**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:23](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L23)

___

### waitForMessage

▸ **waitForMessage**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts:7](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerConnectionFixture.ts#L7)
