# CLI AI Examples

## ChatGPT

```shell
# .env
export DEPLOYMENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
export REGION=xxxx.pure.cloud
export OPENAI_API_KEY=xx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

```shell
export $(cat .env | xargs) && ./chatgpt-run.sh
```

## Vertex AI

```shell
# .env
export DEPLOYMENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
export REGION=xxxx.pure.cloud
export GOOGLE_APPLICATION_CREDENTIALS=PATH/TO/JSON
```

```shell
export $(cat .env | xargs) && ./google-vertex-ai-run.sh
```
