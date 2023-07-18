#sh

# exit when any command fails
set -e

npm install -g ../../packages/genesys-web-messaging-tester-cli

function cleanup {
  npm uninstall -g ../../packages/genesys-web-messaging-tester-cli
}
trap cleanup EXIT

# Useful to run here so I can copy/paste when updating CLI help in docs
web-messaging-tester --help

web-messaging-tester example.yml -id $DEPLOYMENT_ID -r $REGION -p 10
