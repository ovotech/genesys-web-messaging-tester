# Genesys Web Messaging Tester CLI

[![npm](https://img.shields.io/npm/v/@ovotech/genesys-web-messaging-tester-cli)](https://www.npmjs.com/package/@ovotech/genesys-web-messaging-tester-cli)

<p align="center">
Automatically test your Web Messenger flows
</p>

This tool automatically tests [Genesys' Web Messenger](https://help.mypurecloud.com/articles/web-messaging-overview/)
flows against scenarios maintained in a YAML file.

The benefits of this tool are:

* Repeatable - each scenario in the test script (example below) are run exactly as defined. Any unexpected response is
  flagged
* Fast - quick feedback during the development of a flow allows you to spot problems sooner than if you manually test
* Automatic - Being a CLI tool means it can be integrated into your CI/CD pipeline, or run on a scheduled basis e.g. if
  you wanted to monitor production

![Demo of tool executing two scenarios that pass](docs/demo.gif)

The demo above is testing a Web Messenger flow against this YAML:

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
