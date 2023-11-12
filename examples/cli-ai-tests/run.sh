#sh

# exit when any command fails
set -e

npm install -g ../../packages/genesys-web-messaging-tester-cli

function cleanup {
  npm uninstall -g ../../packages/genesys-web-messaging-tester-cli
}
trap cleanup EXIT

web-messaging-tester ai example.yml -id $DEPLOYMENT_ID -r $REGION
