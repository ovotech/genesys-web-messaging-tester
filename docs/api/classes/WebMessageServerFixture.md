[Genesys Web Messaging Tester](../README.md) / WebMessageServerFixture

# Class: WebMessageServerFixture

## Table of contents

### Constructors

- [constructor](WebMessageServerFixture.md#constructor)

### Properties

- [port](WebMessageServerFixture.md#port)

### Methods

- [close](WebMessageServerFixture.md#close)
- [waitForConnection](WebMessageServerFixture.md#waitforconnection)

## Constructors

### constructor

• **new WebMessageServerFixture**(`port`): [`WebMessageServerFixture`](WebMessageServerFixture.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `port` | `number` |

#### Returns

[`WebMessageServerFixture`](WebMessageServerFixture.md)

#### Defined in

[packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerFixture.ts:8](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerFixture.ts#L8)

## Properties

### port

• `Readonly` **port**: `number`

#### Defined in

[packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerFixture.ts:8](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerFixture.ts#L8)

## Methods

### close

▸ **close**(): `void`

#### Returns

`void`

#### Defined in

[packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerFixture.ts:23](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerFixture.ts#L23)

___

### waitForConnection

▸ **waitForConnection**(): `Promise`\<[`WebMessageServerConnectionFixture`](WebMessageServerConnectionFixture.md)\>

#### Returns

`Promise`\<[`WebMessageServerConnectionFixture`](WebMessageServerConnectionFixture.md)\>

#### Defined in

[packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerFixture.ts:17](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/packages/genesys-web-messaging-tester/src/testFixtures/WebMessageServerFixture.ts#L17)
