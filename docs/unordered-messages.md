# Handling unordered messages

The Web Messenger server can sometimes return responses out of order, as [mentioned in the documentation](https://developer.genesys.cloud/commdigital/digital/webmessaging/websocketapi#messaging):
> All messaging follows a request/response pattern. However, web messaging is an asynchronous
> channel and therefore no guarantee to ordering is provided.

I suspect the official embeddable client deals with this by re-ordering the messages on the fly in the UI. However,
this approach is problematic for this tool, as it asserts on the order of messages being received:

```yaml
#...
scenarios:
  "Convo starts with welcome message":
    - waitForReplyContaining: Welcome to our company's chatbot
    - waitForReplyContaining: How can I help you?
```

This tool handles out-of-order messages by delaying their propagation into the rest of the tool. During this delay messages
can then be re-reordered.

The delay, detection and re-ordering of messages all happens in the [`ReorderedMessageDelayer`](./api/classes/ReorderedMessageDelayer.md) class.

## How the CLI handles out-of-order messages

The approach guaranteed to address the issue of out-of-order messages is to configure a long delay when instantiating [`ReorderedMessageDelayer`](./api/classes/ReorderedMessageDelayer.md).
However, a longer delay between messages results in longer tests, at OVO this meant a suite of tests that usually took 14 mins taking 54 mins.

The CLI addresses this problem by starting all tests with a very short delay. Should a test fail then it will check to see if
the conversation contained any unordered messages and if so will retry the test with a long delay. This means the majority of tests
will continue to run at normal speed, and only those that have deemed to have failed due to unordered messages are forced to endure a
long delay between messages.
