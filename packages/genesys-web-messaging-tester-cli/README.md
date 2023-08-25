# Genesys Web Messaging Tester

[![npm](https://img.shields.io/npm/v/@ovotech/genesys-web-messaging-tester-cli)](https://www.npmjs.com/package/@ovotech/genesys-web-messaging-tester-cli)

<p align="center">
Automatically test your Web Messenger Deployments
</p>

This tool automatically
tests [Genesys' Web Messenger Deployments](https://help.mypurecloud.com/articles/web-messaging-overview/)
against scenarios in a YAML file. This makes testing:

* **Fast** - spot problems with your flow sooner than manually testing
* **Repeatable** - scenarios in test scripts are run exactly as defined. Any response that deviates is flagged
* **Customer focused** - expected behaviour can be defined as test-script scenarios before development commences
* **Automatic** - being a CLI tool means it can be integrated into your CI/CD pipeline, or run on a scheduled basis e.g.
  to monitor production

![Demo of tool executing two scenarios that pass](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/docs/assets/cli/demo.gif?raw=true)

The above test is using the test-script:

> [examples/cli-scripted/example-pass.yml](https://github.com/ovotech/genesys-web-messaging-tester/tree/implement-chatgpt/examples/cli-scenario/example-pass.yml)

```yaml
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
scenarios:
  "Accept Survey":
    - say: hi
    - waitForReplyContaining: Can we ask you some questions about your experience today?
    - say: Yes
    - waitForReplyMatching: Thank you! Now for the next question[\.]+
  "Decline Survey":
    - say: hi
    - waitForReplyContaining: Can we ask you some questions about your experience today?
    - say: No
    - waitForReplyContaining: Maybe next time. Goodbye
  "Provide Incorrect Answer to Survey Question":
    - say: hi
    - waitForReplyContaining: Can we ask you some questions about your experience today?
    - say: Not sure
    - waitForReplyContaining: Sorry I didn't understand you. Please answer with either 'yes' or 'no'
    - waitForReplyContaining: Can we ask you some questions about your experience today?
```

## How it works

The tool uses [Web Messenger's guest API](https://developer.genesys.cloud/api/digital/webmessaging/websocketapi) to
simulate a customer talking to a Web Messenger Deployment. Once the tool starts an interaction it follows instructions
defined in a file called a 'test-script', which tells it what to say and what it should expect in response. If the
response deviates from the test-script then the tool flags the test as a failure, otherwise the test passes.

![Tool using test-script file to test Web Messenger Deployment](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/docs/assets/cli/overview.png?raw=true)

## Quick Start

Prepare your system by installing [node](https://nodejs.org/en/download/)

Install the CLI tool using [`npm`](https://www.npmjs.com/package/@ovotech/genesys-web-messaging-tester-cli):

```bash
npm install -g @ovotech/genesys-web-messaging-tester-cli
```

Write a test-script containing all the scenarios you wish to run along with
the [ID and region of your Web Messenger Deployment](https://help.mypurecloud.com/articles/deploy-messenger/).

> [examples/cli-scripted/example-pass.yml](https://github.com/ovotech/genesys-web-messaging-tester/tree/implement-chatgpt/examples/cli-scenario/example-pass.yml)

```yaml
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
scenarios:
  "Accept Survey":
    - say: hi
    - waitForReplyContaining: Can we ask you some questions about your experience today?
    - say: Yes
    - waitForReplyMatching: Thank you! Now for the next question[\.]+
  "Decline Survey":
    - say: hi
    - waitForReplyContaining: Can we ask you some questions about your experience today?
    - say: No
    - waitForReplyContaining: Maybe next time. Goodbye
  "Provide Incorrect Answer to Survey Question":
    - say: hi
    - waitForReplyContaining: Can we ask you some questions about your experience today?
    - say: Not sure
    - waitForReplyContaining: Sorry I didn't understand you. Please answer with either 'yes' or 'no'
    - waitForReplyContaining: Can we ask you some questions about your experience today?
```

Then run the test by pointing to the test-script in the terminal:

```shell
web-messaging-tester tests/example.yml
```

## Examples

```
$ web-messaging-tester --help
Usage: web-messaging-tester [options] <filePath>

Arguments:
  filePath                             Path of the YAML test-script file

Options:
  -id, --deployment-id <deploymentId>  Web Messenger Deployment's ID
  -r, --region <region>                Region of Genesys instance that hosts the Web Messenger Deployment
  -o, --origin <origin>                Origin domain used for restricting Web Messenger Deployment
  -p, --parallel <number>              Maximum scenarios to run in parallel (default: 1)
  -a, --associate-id                   Associate tests their conversation ID.
                                       This requires the following environment variables to be set for an OAuth client
                                       with the role conversation:webmessaging:view:
                                       GENESYS_REGION
                                       GENESYSCLOUD_OAUTHCLIENT_ID
                                       GENESYSCLOUD_OAUTHCLIENT_SECRET (default: false)
  -fo, --failures-only                 Only output failures (default: false)
  -t, --timeout <number>               Seconds to wait for a response before
                                       failing the test (default: 10)
  -h, --help                           display help for command
```

Override Deployment ID and Region in test-script file:

```shell
web-messaging-tester test-script.yaml -id 00000000-0000-0000-0000-000000000000 -r xxxx.pure.cloud
```

Run 10 scenarios in parallel:

```shell
web-messaging-tester test-script.yaml --parallel 10
```

## Development

* [Release Strategy](https://github.com/ovotech/genesys-web-messaging-tester/tree/main/docs/release-strategy.md)
