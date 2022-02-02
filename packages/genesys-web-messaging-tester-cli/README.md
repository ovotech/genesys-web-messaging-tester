# Genesys Web Messaging Tester CLI

[![npm](https://img.shields.io/npm/v/@ovotech/genesys-web-messaging-tester-cli)](https://www.npmjs.com/package/@ovotech/genesys-web-messaging-tester-cli)

<p align="center">
Automatically test your Web Messenger flows
</p>

This tool automatically tests [Genesys' Web Messenger](https://help.mypurecloud.com/articles/web-messaging-overview/)
flows against scenarios in a YAML file. This makes testing:

* **Fast** - spot problems with your flow sooner than manually testing
* **Repeatable** - scenarios in test scripts ([example below](#quick-start)) are run exactly as defined. Any response
  that deviates is flagged
* **Customer focused** - scenarios can be created prior to development. Flows are then tested to ensure they handle
  scenarios.
* **Automatic** - being a CLI tool means it can be integrated into your CI/CD pipeline, or run on a scheduled basis e.g.
  if you wanted to monitor production

![Demo of tool executing two scenarios that pass](docs/demo.gif)

The above test is using the test script:

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

## Quick Start

Prepare your system by installing [node](https://nodejs.org/en/download/)

Install the CLI tool using [`npm`](https://www.npmjs.com/package/@ovotech/genesys-web-messaging-tester-cli):

```bash
npm install -g @ovotech/genesys-web-messaging-tester-cli
```

Write a test-script containing all the scenarios you wish to run along with
the [ID and region of your Web Messenger Deployment](https://help.mypurecloud.com/articles/deploy-messenger/).

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
