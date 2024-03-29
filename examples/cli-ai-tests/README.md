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
export VERTEX_AI_PROJECT=example-project
export VERTEX_AI_LOCATION=example-location
```

```shell
export $(cat .env | xargs) && ./google-vertex-ai-run.sh
```

# Troubleshooting

## Permission denied during script running

If experiencing a permission denied error when running a script then try reinstalling the node version:

```shell
nvm uninstall <version in .nvm>
nvm install <version in .nvm>
```
