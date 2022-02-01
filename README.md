# Genesys Web Messaging Tester

Easily write automated tests for
[Genesys' Web Messenger](https://help.mypurecloud.com/articles/web-messaging-overview/) flows.

This monorepo contains two packages:

| Name                                                                                                                                                   |                                                                            NPM                                                                            | Description                                                                                                   |
|:-------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------|
| [genesys-web-messaging-tester](https://github.com/ovotech/genesys-web-messaging-tester/tree/main/packages/genesys-web-messaging-tester#readme)         |     [![npm](https://img.shields.io/npm/v/@ovotech/genesys-web-messaging-tester)](https://www.npmjs.com/package/@ovotech/genesys-web-messaging-tester)     | Simple API for interacting with conversations, allowing you to send messages and set expectations on replies. |
| [genesys-web-messaging-tester-cli](https://github.com/ovotech/genesys-web-messaging-tester/tree/main/packages/genesys-web-messaging-tester-cli#readme) | [![npm](https://img.shields.io/npm/v/@ovotech/genesys-web-messaging-tester-cli)](https://www.npmjs.com/package/@ovotech/genesys-web-messaging-tester-cli) | CLI for running tests from YAML test scripts                                                                  |

## Support

The tooling in this repo currently only
supports [Guest Sessions](https://developer.genesys.cloud/api/digital/webmessaging/websocketapi#configure-a-guest-session)
, however support
for [Authenticated Sessions](https://developer.genesys.cloud/api/digital/webmessaging/websocketapi#configure-an-authenticated-session)
may be added in the near future.
