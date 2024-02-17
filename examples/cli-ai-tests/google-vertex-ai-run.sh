#sh

# exit when any command fails
set -e

npm install -g ../../packages/genesys-web-messaging-tester-cli

function cleanup {
  npm uninstall -g ../../packages/genesys-web-messaging-tester-cli
}
trap cleanup EXIT

web-messaging-tester ai google-vertex-ai-example.yml -id $DEPLOYMENT_ID -r $REGION
if [ $? -ne 0 ]
then
  echo ""
  echo "========="
  echo "UNEXPECTED EXIT CODE $? - Example did not result in Exit Code of 0"
  exit 1
fi
