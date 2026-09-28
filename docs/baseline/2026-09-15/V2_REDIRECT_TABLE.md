# Таблица redirect для V2

Дата проверки: 2026-09-28  
Ветка: site-v2  
Baseline: docs/baseline/2026-09-15/URL_MANIFEST.tsv

Состояние после routing-коммитов `818dda5c432e18f6de3995453feffd001c4599b8` и `c6dae452c6189ec9ce1cd03b96afd61d20bcb359`:

- baseline: 144 маршрута;
- затронутая статическая карта: 71 каноническая страница;
- расхождения в статическом сопоставлении: 0;
- итоговый V2 output после этих коммитов ещё не пересобран; `npm run build:v2` и output-проверки не запускались;
- новый маршрут: `/third-party-notices/`;

- HTTP-диагностика 2026-09-28 выполнена для `https://сит-сальск.рф`: все 11 legacy URL ответили `200` без `Location`; это показывает, что на рабочем домене ещё не проверяется V2-карта redirect. Подробности: `docs/reports/V2_REDIRECT_HTTP_CHECK_2026-09-28.md`. До тестовой выкладки V2 пункт остаётся `[~]`.
- legacy flat URL сохранены отдельными redirect-страницами.

| Старый URL | Новый URL | Действие | Причина |
|---|---|---|---|
| `/studentam-i-roditeljam/biblioteka/` | `/studentam-i-roditeljam/resursy/biblioteka/` | redirect | Маршрут приведён к полной иерархии рубрики |
| `/svedenija/employees/` | `/svedenija/rukovodstvo/` | redirect | Канонический slug `rukovodstvo` |
| `/svedenija/employees/pedagogicheskiy-sostav/` | `/svedenija/rukovodstvo/pedagogicheskiy-sostav/` | redirect | Канонический slug `rukovodstvo` |
| `/vospitanie/dvizhenie-pervyh/` | `/vospitanie/kulturno-massovaja/dvizhenie-pervyh/` | redirect | Полная иерархия рубрики |
| `/vospitanie/mediacentr/` | `/vospitanie/kulturno-massovaja/mediacentr/` | redirect | Полная иерархия рубрики |
| `/vospitanie/pozdravlenija/` | `/vospitanie/kulturno-massovaja/pozdravlenija/` | redirect | Полная иерархия рубрики |
| `/vospitanie/raduga-dobra/` | `/vospitanie/volonterstvo/raduga-dobra/` | redirect | Полная иерархия рубрики |
| `/vospitanie/ssk-avangard/` | `/vospitanie/fizkultura-sport/ssk-avangard/` | redirect | Полная иерархия рубрики |
| `/vospitanie/teatralnyj-klub/` | `/vospitanie/kulturno-massovaja/teatralnyj-klub/` | redirect | Полная иерархия рубрики |
| `/vospitanie/velikaja-pobeda/` | `/vospitanie/patrioticheskoe/velikaja-pobeda/` | redirect | Полная иерархия рубрики |
| `/vospitanie/vitjaz/` | `/vospitanie/patrioticheskoe/vitjaz/` | redirect | Полная иерархия рубрики |
| — | `/third-party-notices/` | новый URL | Публичная страница notices не заменяет существующий маршрут |
