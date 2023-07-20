#sh

npm install -g ../../packages/genesys-web-messaging-tester-cli

function cleanup {
  npm uninstall -g ../../packages/genesys-web-messaging-tester-cli
}
trap cleanup EXIT

## Passing example exits with exit code 0
web-messaging-tester example-pass.yml -id $DEPLOYMENT_ID -r $REGION -p 10
if [ $? -ne 0 ]
then
  echo "========="
  echo "UNEXPECTED EXIT CODE $? - Passing example did not result in Exit Code of 0"
  exit 1
fi

## Failing example exits with exit code 1
web-messaging-tester example-fail.yml -id $DEPLOYMENT_ID -r $REGION -p 10
if [ $? -ne 1 ]
then
  echo "========="
  echo "UNEXPECTED EXIT CODE $? - Intentionally failing example did not result in Exit Code of 1"
  exit 1
fi

exit 0
