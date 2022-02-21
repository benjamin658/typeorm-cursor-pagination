#!/bin/bash

PUSH_TO_ORIGIN=false

while getopts "v:p" argv
do
  case $argv in
    v)
      RELEASE_VERSION=$OPTARG
      ;;
    p)
      PUSH_TO_ORIGIN=true
      ;;
  esac
done

if [ -z "$RELEASE_VERSION" ]; then
  echo -e "\033[0;31m[ERROR]: Missing release version -v option.\033[0m"
  exit 1
fi

SEMVER_REGEX="^(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)\\.(0|[1-9][0-9]*)(\\-[0-9A-Za-z-]+(\\.[0-9A-Za-z-]+)*)?(\\+[0-9A-Za-z-]+(\\.[0-9A-Za-z-]+)*)?$"

if [[ $RELEASE_VERSION =~ $SEMVER_REGEX ]]; then
  echo -e "\033[0;32m[INFO]: Start to release version $RELEASE_VERSION."
else
  echo -e "\033[0;31m[ERROR]: Version $RELEASE_VERSION doesn't match the semver scheme $SEMVER_REGEX.\033[0m"
  exit 1
fi

git checkout develop && git pull --rebase
git checkout master && git pull --rebase
git merge develop
npx standard-version --release-as $RELEASE_VERSION
git checkout develop
git merge master

if $PUSH_TO_ORIGIN ; then
  echo -e "\033[0;32m[INFO]: Push to origin"
  git push origin develop
  git push origin master
  git push --tags
fi

echo -e "\033[0;32m[INFO]: Version $RELEASE_VERSION has been successfully released."
