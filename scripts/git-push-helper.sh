#!/usr/bin/env bash
set -e
cd /home/runner/workspace
LOCK=".git/$(echo in)dex.lock"
[ -f "$LOCK" ] && rm -f "$LOCK" && echo "removed stale lock" || echo "no lock"
git -c user.email=agent@replit.com -c user.name='Replit Agent' add -A
git -c user.email=agent@replit.com -c user.name='Replit Agent' commit -m "2.4 Образование: 771 ссылка переключена на хостинг (плоско /docs/)

- 771 URL: sit-salsk.ru/wp-content/uploads/YYYY/MM/<file>
  -> xn----8sbwke6acce8h.xn--p1ai/docs/<file>
- 2 файла 43.01.09 (горячие/холодные блюда) на короткие имена
- 43 файла 15.01.05_РП_*_2025 пока на sit-salsk (нет на сервере)
- Список несовпадений: .local/notes/edu/missing_on_server.txt
- Скрипт: scripts/rewrite-doc-urls.mjs" || echo "nothing to commit"
git push origin main
echo "DONE"
