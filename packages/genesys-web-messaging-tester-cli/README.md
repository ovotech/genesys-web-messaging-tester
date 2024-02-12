# Genesys Web Messaging Tester

[![npm](https://img.shields.io/npm/v/@ovotech/genesys-web-messaging-tester-cli)](https://www.npmjs.com/package/@ovotech/genesys-web-messaging-tester-cli)

<p align="center">
Automatically test your Web Messenger Deployments
</p>

Allows behaviour for Genesys Chatbots and Architect flows behind [Genesys' Web Messenger Deployments](https://help.mypurecloud.com/articles/web-messaging-overview/) to be automatically tested using:
* **Scripted Dialogue** - I say "X" and expect "Y" in response ([example](https://github.com/ovotech/genesys-web-messaging-tester/tree/main/examples/cli-scripted-tests/example-pass.yml))
* **Generative AI** - Converse with my chatbot and fail the test if it doesn't do "X" ([examples](https://github.com/ovotech/genesys-web-messaging-tester/tree/main/examples/cli-ai-tests/))

Why? Well it makes testing:

* **Fast** - spot problems with your chatbots sooner than manually testing
* **Repeatable** - scenarios in scripted dialogues are run exactly as defined. Any response that deviates is flagged
* **Customer focused** - expected behaviour can be defined as scenarios before development commences
* **Automatic** - being a CLI tool means it can be integrated into your CI/CD pipeline, or run on a scheduled basis e.g.
  to monitor production

![Demo of tool executing two scenarios that pass](https://github.com/ovotech/genesys-web-messaging-tester/blob/main/docs/assets/cli/demo.gif?raw=true)

The above test is using the test-script:

> [examples/cli-scripted-tests/example-pass.yml](https://github.com/ovotech/genesys-web-messaging-tester/tree/main/examples/cli-scripted-tests/example-pass.yml)

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

### Testing with scripted dialogues

Write a dialogue script containing all the scenarios you wish to run along with
the [ID and region of your Web Messenger Deployment](https://help.mypurecloud.com/articles/deploy-messenger/).

> [examples/cli-scripted-tests/example-pass.yml](https://github.com/ovotech/genesys-web-messaging-tester/tree/main/examples/cli-scripted-tests/example-pass.yml)

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

Then run the test by pointing to the dialogue script file in the terminal:

```shell
web-messaging-tester scripted tests/example.yml
```

### Testing with AI

This tool supports two GenAI providers:
* ChatGPT (`gpt-3.5-turbo` model by default)
* Google Vertex AI ([PaLM 2 Chat Bison model](https://console.cloud.google.com/vertex-ai/publishers/google/model-garden/chat-bison))

#### Using ChatGPT
Start by setting up an API key for ChatGPT:

1. [Create an API key for OpenAI](https://help.openai.com/en/articles/4936850-where-do-i-find-my-api-key)
2. Set the key in the environment variable: `OPENAI_API_KEY`

Write a scenario file containing all the scenarios you wish to run along with
the [ID and region of your Web Messenger Deployment](https://help.mypurecloud.com/articles/deploy-messenger/).

The scenarios are written as prompts, these can take some fine-tuning to get right ([see examples here](https://genesys-messenger-tester.makingchatbots.com/writing-tests/ai/example-prompts.html)).
The `terminatingPhrases` section defines the phrases you instruct ChatGPT to say to pass or fail a test.

> [examples/cli-ai-tests/chatgpt-example.yml](https://github.com/ovotech/genesys-web-messaging-tester/tree/main/examples/cli-ai-tests/chatgpt-example.yml)

```yaml
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
  ai:
    provider: chatgpt
    config:
      temperature: 1
scenarios:
  "Accept survey":
    setup:
      prompt: |
        I want you to play the role of a customer talking to a company's online chatbot. You must not
        break from this role, and all of your responses must be based on how a customer would realistically talk to a company's chatbot.

        To help you play the role of a customer consider the following points when writing a response:
        * Respond to questions with as few words as possible
        * Answer with the exact word when given options e.g. if asked to answer with either 'yes' or 'no' answer with either 'yes' or 'no' without punctuation, such as full stops

        As a customer you would like to leave feedback of a recent purchase of a light bulb you made where a customer service
        rep was very helpful in finding the bulb with the correct fitting.

        If at any point in the company's chatbot repeats itself then say the word 'FAIL'.

        If you have understood your role and the purpose of your conversation with the company's chatbot then say the word 'Hello'
        and nothing else.
      terminatingPhrases:
        pass: ["PASS"]
        fail: ["FAIL"]
```

Then run the AI test by pointing to the scenario file in the terminal:

```shell
web-messaging-tester ai tests/example.yml
```

For a slightly more detailed guide see: [Let's test a Genesys chatbot with AI](https://www.linkedin.com/pulse/lets-test-genesys-chatbot-ai-lucas-woodward-dvrpc).

#### Using Google Vertex AI

1. Create a Google Cloud Platform (GCP) account and enabled AI access to Vertex AI
2. Authenticate the machine running this testing tool, with GCP
   * The easiest way is [setting up Application Default Credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc#local-dev)
3. Define a prompt to provide the model with context on how to behave during testing
   * Learn more in [Google's Introduction to prompt design](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/introduction-prompt-design)

The `terminatingPhrases` section defines the phrases you instruct PaLM 2 to say to pass or fail a test.

> [examples/cli-ai-tests/google-vertex-ai-example.yml](https://github.com/ovotech/genesys-web-messaging-tester/tree/main/examples/cli-ai-tests/google-vertex-ai-example.yml)

```yaml
config:
  deploymentId: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  region: xxxx.pure.cloud
  ai:
    provider: google-vertex-ai
    config:
      location: example-location
      project: example-gcp-project
      modelVersion: 002
scenarios:
  "Accept survey":
    setup:
      prompt: |
        I want you to play the role of a customer talking to a company's online chatbot. You must not
        break from this role, and all of your responses must be based on how a customer would realistically talk to a company's chatbot.

        To help you play the role of a customer consider the following points when writing a response:
        * Respond to questions with as few words as possible
        * Answer with the exact word when given options e.g. if asked to answer with either 'yes' or 'no' answer with either 'yes' or 'no' without punctuation, such as full stops

        As a customer you would like to leave feedback of a recent purchase of a light bulb you made where a customer service
        rep was very helpful in finding the bulb with the correct fitting.

        If at any point in the company's chatbot repeats itself then say the word 'FAIL'.

        If you have understood your role and the purpose of your conversation with the company's chatbot then say the word 'Hello'
        and nothing else.
      terminatingPhrases:
        pass: ["PASS"]
        fail: ["FAIL"]
```

Then run the AI test by pointing to the scenario file in the terminal:

```shell
web-messaging-tester ai tests/example.yml
```

For a slightly more detailed guide see: [Let's test a Genesys chatbot with AI](https://www.linkedin.com/pulse/lets-test-genesys-chatbot-ai-lucas-woodward-dvrpc).

## Example commands

```
$ web-messaging-tester scripted --help
Usage: web-messaging-tester scripted [options] <filePath>

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
web-messaging-tester scripted test-script.yaml -id 00000000-0000-0000-0000-000000000000 -r xxxx.pure.cloud
```

Run 10 scenarios in parallel:

```shell
web-messaging-tester scripted test-script.yaml --parallel 10
```

## Support

If you have any questions then please feel free to:

* Raise an issue on this [project's GitHub repository](https://github.com/ovotech/genesys-web-messaging-tester)
* [Drop me a message](https://www.linkedin.com/in/lucas-woodward-the-dev/)

## Development

* [Release Strategy](https://github.com/ovotech/genesys-web-messaging-tester/tree/main/docs/release-strategy.md)
