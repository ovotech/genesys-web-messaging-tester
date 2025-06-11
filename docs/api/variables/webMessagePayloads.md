[**Genesys Web Messaging Tester**](../README.md)

***

[Genesys Web Messaging Tester](../README.md) / webMessagePayloads

# Variable: webMessagePayloads

> `const` **webMessagePayloads**: `object`

Defined in: [packages/genesys-web-messaging-tester/src/testFixtures/webMessagePayloads.ts:6](https://github.com/MakingChatbots/genesys-cloud-chatbot-tester-cli/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/webMessagePayloads.ts#L6)

Payloads taken from real interactions

## Type declaration

### inboundStructuredMessage()

> **inboundStructuredMessage**: (`text`, `date`) => [`StructuredMessage`](../interfaces/StructuredMessage.md)

#### Parameters

##### text

`string`

##### date

`Date`

#### Returns

[`StructuredMessage`](../interfaces/StructuredMessage.md)

### outboundDisconnectEventStructuredMessage()

> **outboundDisconnectEventStructuredMessage**: (`date`) => [`StructuredMessage`](../interfaces/StructuredMessage.md)

#### Parameters

##### date

`Date`

#### Returns

[`StructuredMessage`](../interfaces/StructuredMessage.md)

### outboundTextStructuredMessage()

> **outboundTextStructuredMessage**: (`text`, `date`) => [`StructuredMessage`](../interfaces/StructuredMessage.md)

#### Parameters

##### text

`string`

##### date

`Date`

#### Returns

[`StructuredMessage`](../interfaces/StructuredMessage.md)

### sessionResponse()

> **sessionResponse**: () => [`SessionResponse`](../interfaces/SessionResponse.md)

#### Returns

[`SessionResponse`](../interfaces/SessionResponse.md)
