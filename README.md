# Genesys Web Messaging Tester

Easily write automated, and repeatable tests
for [Genesys' Web Messenger](https://help.mypurecloud.com/articles/web-messaging-overview/)
flows. The library provides a simple API for interacting with conversations, allowing you to send messages and set
expectations on replies. It has been designed to run in test frameworks
(e.g. [Jest](https://jestjs.io/)) and standalone scripts.

[Documentation](docs/README.md)

```typescript
const session = new WebMessengerGuestSession({
  deploymentId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  region: 'xxxx.pure.cloud',
});

const convo = new Conversation(session);
await convo.waitForConversationToStart();

convo.sendText('hi');

await convo.waitForResponseContaining('Please enter your account number');

convo.sendText('123');

await convo.waitForResponseContaining('Your account number is too short. It is the 6 digit number on your bills');
```

## Getting Started

Install using [`npm`](https://www.npmjs.com/package/@ovotech/genesys-web-messaging-tester):

```bash
npm install -g @ovotech/genesys-web-messaging-tester
```

Then write a test. In the example below we test the validation of an account number:

> [examples/node-script-tests/src/js-script.js:(test-section)](examples/node-script-tests/src/js-script.js#L3-L27)

```javascript
const WebMsgTester = require('@ovotech/genesys-web-messaging-tester');

(async () => {
  const session = new WebMsgTester.WebMessengerGuestSession({
    deploymentId: process.env.DEPLOYMENT_ID,
    region: process.env.REGION,
  });

  const convo = new WebMsgTester.Conversation(session);
  await convo.waitForConversationToStart();

  convo.sendText('hi');

  await convo.waitForResponseContaining('Please enter your account number');

  convo.sendText('123');

  await convo.waitForResponseContaining(
    'Your account number is too short. It is the 6 digit number on your bills',
  );
})().catch((e) => {
  throw e;
});
```

Finally, run the test by executing the script:

```shell
node examples/standalone-js-script.js
```

## Support

Currently
supports [Guest Sessions](https://developer.genesys.cloud/api/digital/webmessaging/websocketapi#configure-a-guest-session)
, however support
for [Authenticated Sessions](https://developer.genesys.cloud/api/digital/webmessaging/websocketapi#configure-an-authenticated-session)
may be added in the near future.

## Debugging

Messages sent between the client and Genesys' server can be output by setting the environment variable:

```shell
DEBUG=WebMessengerGuestSession
```
