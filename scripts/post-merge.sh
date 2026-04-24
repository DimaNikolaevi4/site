#!/bin/bash
set -e

if [ -f package.json ]; then
  npm install --no-audit --no-fund
fi

if [ -n "$GITHUB_TOKEN" ]; then
  BRANCH="$(git rev-parse --abbrev-ref HEAD)"
  AHEAD="$(git rev-list --count "origin/${BRANCH}..HEAD" 2>/dev/null || echo 0)"
  if [ "$AHEAD" -gt 0 ]; then
    echo "Pushing ${AHEAD} commit(s) to origin/${BRANCH}..."
    git -c credential.helper= \
        -c credential.helper='!f() { echo "username=x-access-token"; echo "password=$GITHUB_TOKEN"; }; f' \
        push origin "$BRANCH"
  else
    echo "Nothing to push to origin/${BRANCH}."
  fi
else
  echo "GITHUB_TOKEN not set, skipping git push."
fi
