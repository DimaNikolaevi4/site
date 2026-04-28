#!/usr/bin/env bash
# Push текущего состояния main в GitHub с использованием GITHUB_TOKEN из секретов Replit.
# Использование:  bash scripts/push-to-github.sh
#
# Требования:
#   - В секретах Replit задан GITHUB_TOKEN (Personal Access Token с правом repo)
#   - origin указывает на github.com/<user>/<repo>
#   - Все изменения уже закоммичены (Replit делает чекпойнты автоматически)

set -euo pipefail

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "❌ Переменная GITHUB_TOKEN не задана. Добавьте её в секреты Replit." >&2
  exit 1
fi

REMOTE_URL="$(git config --get remote.origin.url)"
if [ -z "$REMOTE_URL" ]; then
  echo "❌ Не настроен remote 'origin'." >&2
  exit 1
fi

# Превращаем https://github.com/USER/REPO[.git] в https://x-access-token:TOKEN@github.com/USER/REPO.git
AUTH_URL="$(echo "$REMOTE_URL" | sed -E "s#https://([^@]+@)?github.com/#https://x-access-token:${GITHUB_TOKEN}@github.com/#")"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "→ Push ветки '$BRANCH' в $REMOTE_URL ..."

git push "$AUTH_URL" "$BRANCH"

echo "✅ Готово. Изменения отправлены в GitHub."
