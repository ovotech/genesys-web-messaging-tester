# Genesys Web Messaging Tester CLI

[![npm](https://img.shields.io/npm/v/@ovotech/genesys-web-messaging-tester-cli)](https://www.npmjs.com/package/@ovotech/genesys-web-messaging-tester-cli)

Tired of wasting time manually testing
your [Genesys' Web Messenger](https://help.mypurecloud.com/articles/web-messaging-overview/)
flows every time you make a change, or want a way to routinely check your flow is still working for customers?

This tool allows you to automatically run tests defined in a YAML file like below:

> [../../examples/cli/tests/example.yml](../../examples/cli/tests/example.yml)

```yaml
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
scenarios:
  "Accept Survey":
    - say: hi
    - waitForReplyContaining: Can we ask you some questions about your experience today?
    - say: Yes
    - waitForReplyContaining: Thank you! Now for the next question...
  "Decline Survey":
    - say: hi
    - waitForReplyContaining: Can we ask you some questions about your experience today?
    - say: No
    - waitForReplyContaining: Goodbye
```

![demo](docs/demo.gif)
![demo](docs/demo90.gif)
![demo](docs/demo110.gif)

## Getting Started

Install using [`npm`](https://www.npmjs.com/package/@ovotech/genesys-web-messaging-tester-cli):

```bash
npm install -g @ovotech/genesys-web-messaging-tester-cli
```

Write a test-script containing all the scenarios you wish to run:

> [../../examples/cli/tests/example.yml](../../examples/cli/tests/example.yml)

```yaml
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
scenarios:
  "Accept Survey":
    - say: hi
    - waitForReplyContaining: Can we ask you some questions about your experience today?
    - say: Yes
    - waitForReplyContaining: Thank you! Now for the next question...
  "Decline Survey":
    - say: hi
    - waitForReplyContaining: Can we ask you some questions about your experience today?
    - say: No
    - waitForReplyContaining: Goodbye
```

Then run the test by pointing to the test script in the command-prompt:

```shell
web-messaging-tester -s tests/example.yml
```
