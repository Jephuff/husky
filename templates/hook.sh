#!/bin/sh
{huskyIdentifier}
# v{version} {platform}

export HUSKY_GIT_PARAMS="$*"

if [ "$HUSKY_ONLY_RUN_ON_BRANCH" ] && [ "$(git rev-parse --abbrev-ref HEAD)" != "$HUSKY_ONLY_RUN_ON_BRANCH" ]; then
  exit 0
fi

{node} {script} `basename "$0"`
