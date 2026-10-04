# HTTP-проверка legacy redirect V2

Дата: 2026-09-28  
Ветка: `site-v2`  
Проверяемый host: `https://сит-сальск.рф`

## Результат

Проверены 11 legacy URL из таблицы `docs/baseline/2026-09-15/V2_REDIRECT_TABLE.md`. Каждый запрос вернул `HTTP/2 200` без заголовка `Location`:

| Legacy URL | Ожидаемый V2 URL | Фактический ответ |
|---|---|---|
| `/studentam-i-roditeljam/biblioteka/` | `/studentam-i-roditeljam/resursy/biblioteka/` | 200, Location отсутствует |
| `/svedenija/employees/` | `/svedenija/rukovodstvo/` | 200, Location отсутствует |
| `/svedenija/employees/pedagogicheskiy-sostav/` | `/svedenija/rukovodstvo/pedagogicheskiy-sostav/` | 200, Location отсутствует |
| `/vospitanie/dvizhenie-pervyh/` | `/vospitanie/kulturno-massovaja/dvizhenie-pervyh/` | 200, Location отсутствует |
| `/vospitanie/mediacentr/` | `/vospitanie/kulturno-massovaja/mediacentr/` | 200, Location отсутствует |
| `/vospitanie/pozdravlenija/` | `/vospitanie/kulturno-massovaja/pozdravlenija/` | 200, Location отсутствует |
| `/vospitanie/raduga-dobra/` | `/vospitanie/volonterstvo/raduga-dobra/` | 200, Location отсутствует |
| `/vospitanie/ssk-avangard/` | `/vospitanie/fizkultura-sport/ssk-avangard/` | 200, Location отсутствует |
| `/vospitanie/teatralnyj-klub/` | `/vospitanie/kulturno-massovaja/teatralnyj-klub/` | 200, Location отсутствует |
| `/vospitanie/velikaja-pobeda/` | `/vospitanie/patrioticheskoe/velikaja-pobeda/` | 200, Location отсутствует |
| `/vospitanie/vitjaz/` | `/vospitanie/patrioticheskoe/vitjaz/` | 200, Location отсутствует |

## Интерпретация

Это не подтверждает корректность V2 redirect: рабочий домен пока отдаёт старые страницы, а тестовая выкладка V2 ещё не выполнена. Поэтому пункт 4 остаётся `[~]` до тестовой выкладки и повторной проверки ответов с `Location`.
