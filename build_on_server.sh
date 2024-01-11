#!/bin/bash
set -ex
VERSION=$(cat vss-extension.json | jq -r '.version')
PACKAGE_NAME=$(cat vss-extension.json | jq -r '[.publisher,.id] | join(".")')
OUT_BRANCH_NAME=$(echo $CI_COMMIT_BRANCH | tr / _)
OUT_PACKAGE_NAME="$CI_PROJECT_NAME-$VERSION.$CI_JOB_ID-$OUT_BRANCH_NAME.tar"
cd src
npm install -g "typescript@4.5.5"
npm i -g "tfx-cli@0.11.0"
npm install
tsc
cd ..
tfx extension create --manifest-globs vss-extension.json
tar -cf $OUT_PACKAGE_NAME $PACKAGE_NAME-$VERSION.vsix
echo "$OUT_PACKAGE_NAME;ai.snapshot/AI.Plugin.Azure/$OUT_PACKAGE_NAME" > upload_list.txt
