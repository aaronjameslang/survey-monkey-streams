#! /bin/sh
set -eux

test ! -z $TRAVIS
test ! -z $AWS_ACCESS_KEY_ID
test ! -z $AWS_SECRET_ACCESS_KEY
test ! -z $CC_TEST_REPORTER_ID

commitlint-travis

curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
chmod +x ./cc-test-reporter
./cc-test-reporter before-build
./build.sh
# If build fails, this will never run, so can hard code 0
./cc-test-reporter after-build --exit-code 0

pip install awscli --upgrade --user

aws s3 sync --region us-west-2 \
  dist/doc \
  s3://aaronjameslang.com/survey-monkey-streams

aws s3 sync --region us-west-2 \
  coverage/lcov-report \
  s3://aaronjameslang.com/survey-monkey-streams/coverage

# If there's no version, exit
VERSION_GIT=$(git describe --exact-match) || exit 0
VERSION_PKG=$(node -e 'console.log(require("./package.json").version)')
VERSION_CHL=$(< CHANGELOG.md sed -n 's/## \[\(.*\)\].*/\1/p' | head -1)

test $VERSION_GIT = $VERSION_PKG
test $VERSION_GIT = $VERSION_CHL

cp package.json README.md ./dist/npm/
npm config set //registry.npmjs.org/:_authToken ${NPM_TOKEN}
npm publish dist/npm
