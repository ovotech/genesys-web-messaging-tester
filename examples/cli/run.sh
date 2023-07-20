#sh
set -e

RED='\033[0;31m'
NO_COLOUR='\033[0m'

npm install -g ../../packages/genesys-web-messaging-tester-cli

function cleanup {
  npm uninstall -g ../../packages/genesys-web-messaging-tester-cli
}
trap cleanup EXIT

## Passing test exits with code 0
web-messaging-tester example-pass.yml -id $DEPLOYMENT_ID -r $REGION -p 10
if [ $? -ne 0 ]
then
  echo "${RED}Passing test did not result in Exit Code of 0. Exit code was $?${NO_COLOUR}"
  exit 1
fi

## Failing test exists with code 1
web-messaging-tester example-fail.yml -id $DEPLOYMENT_ID -r $REGION -p 10
if [ $? -ne 1 ]
then
  echo "${RED}Failing test did not result in Exit Code of 1. Exit code was $?${NO_COLOUR}"
  exit 1
fi
