# Таблица redirect для V2

Дата проверки: 2026-09-23  
Ветка: site-v2  
Baseline: docs/baseline/2026-09-15/URL_MANIFEST.tsv

Сравнение HTML-маршрутов baseline и public-v2/:

- baseline: 144 маршрута;
- V2: 145 маршрутов;
- сохранены все 144 baseline-маршрута;
- добавлен новый маршрут /third-party-notices/;
- изменённых URL, для которых требуется redirect, не обнаружено.

| Старый URL | Новый URL | Действие | Причина |
|---|---|---|---|
| — | — | redirect не требуется | Все baseline-маршруты сохранены без изменения URL |
| — | /third-party-notices/ | новый URL | Публичная страница notices не заменяет существующий маршрут |
