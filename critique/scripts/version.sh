#!/bin/bash
set -e

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" == "main" ]]; then
  echo 'Error: Branch: main'
  exit 1
fi

if [[ "$#" -ne 1 ]]; then
  echo 'Usage: ./scripts/version.sh [patch|minor|major]'
  exit 1
fi

VERSION_TYPE="$1"
if [[ "$VERSION_TYPE" != "patch"
  && "$VERSION_TYPE" != "minor"
  && "$VERSION_TYPE" != "major"
]]; then
  echo 'Error: Version types: patch, minor, major.'
  exit 1
fi

pushd "$(dirname "$0")/.." > /dev/null
NEW_VERSION=$(npm version "$VERSION_TYPE" --no-git-tag-version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')
popd > /dev/null

git add critique/package.json critique/package-lock.json
git commit -m "Version critique v$NEW_VERSION"
git tag "v$NEW_VERSION" -m "Release critique v$NEW_VERSION"
git push origin "$CURRENT_BRANCH:$CURRENT_BRANCH" "v$NEW_VERSION"

