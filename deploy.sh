#! /bin/sh
set -eux

test ! -z $TRAVIS
test ! -z $AWS_ACCESS_KEY_ID
test ! -z $AWS_SECRET_ACCESS_KEY
test ! -z $CC_TEST_REPORTER_ID

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
