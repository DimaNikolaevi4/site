# SITE_V2_CHECKLIST.md

# Чек-лист следующего этапа после внешней сборки V2

Дата начала: 2026-09-29  
Ветка: site-v2  
Статус: завершён 2026-09-30

Завершённый полный чек-лист V2 сохранён в архиве:  
[docs/archive/SITE_V2_CHECKLIST_COMPLETED_2026-09-29.md](docs/archive/SITE_V2_CHECKLIST_COMPLETED_2026-09-29.md)

## 0. Зафиксированный результат

- [x] Предыдущий полный SITE_V2_CHECKLIST.md завершён и перенесён в историю.
- [x] Внешняя сборка V2 выполнена владельцем проекта и подтверждена как рабочая.
- [x] Результаты нового этапа подтверждены чистой установкой через npm ci в зелёном CI.

## 1. Front matter lint по типам страниц

- [x] Зафиксированы типы материалов и их обязательные поля: новости, разделы, статические страницы, категории и документы.
- [x] Создан scripts/check-frontmatter.mjs с проверкой YAML/front matter, обязательных полей, типов значений и дубликатов permalink.
- [x] Линтер учитывает допустимые исключения по типам страниц и не требует одинаковую схему от всех Markdown-файлов.
- [x] Добавлена команда npm run check:frontmatter.
- [x] Линтер выполнен на всём src/content/; исключения и причины записаны.
- [x] Линтер включён в GitHub Actions.

## 2. GitHub Actions: build → checks

- [x] Создан .github/workflows/site-v2.yml.
- [x] Workflow запускается на pull request и push в site-v2.
- [x] Порядок шагов: checkout → setup Node → npm ci → npm run build:v2 → проверки сгенерированного output.
- [x] В workflow включены check:frontmatter, check:v2:source-boundary, check:urls:unique, check:urls:generated:v2, check:links:v2 и проверка формы маршрутов.
- [x] Первый запуск GitHub Actions завершился успешно: [run 36568819903](https://github.com/DimaNikolaevi4/site/actions/runs/36568819903).
- [x] Порядок и команды CI зафиксированы в этом чек-листе; используется Node.js 18.

## 3. Очистка attached_assets/Pasted--*.txt

Выполнено 30 сентября 2026 года по подтверждению владельца; удаление и проверки описаны в docs/reports/PASTED_DUMPS_REVIEW_2026-09-29.md.

- [x] Проверен список 22 pasted-дампов и отсутствие ссылок на них из сборки, скриптов и документации; полный обзор: docs/reports/PASTED_DUMPS_REVIEW_2026-09-29.md.
- [x] Удалены ровно 22 неиспользуемых attached_assets/Pasted--*.txt (коммит 40ec6a7).
- [x] В .gitignore добавлено правило для новых pasted-дампов.
- [x] После очистки сохранены необходимые изображения и рабочие ассеты; diff затрагивает только эти дампы и .gitignore.
- [x] Сборка и проверки проходят после очистки; результаты приведены в отчёте.

## 4. История большого CHECKLIST.md

- [x] Определена граница между текущими задачами и историей изменений.
- [x] Историческая часть сохранена в docs/archive/ без потери содержания.
- [x] CHECKLIST.md сокращён до актуального рабочего списка или указателя на архив.
- [x] Ссылки на старый файл и исторические решения проверены: пути из CHECKLIST.md и SITE_V2_CHECKLIST.md существуют в docs/archive/.

## 5. Финальная проверка этапа

- [x] npm ci проходит в чистом checkout — 194 пакета; 5 audit advisories (1 moderate, 4 high) остаются без изменений.
- [x] npm run check:frontmatter проходит — проверено 121 Markdown-файл.
- [x] npm run build:v2 проходит — 150 HTML-файлов.
- [x] check:v2:source-boundary проходит.
- [x] check:urls:unique проходит — 144 URL.
- [x] check:links:v2 проходит — 150 страниц, 19 544 ссылки.
- [x] Проверка формы сгенерированных маршрутов проходит — 150 файлов и 150 уникальных URL.
- [x] GitHub Actions зелёный для head PR #124 — run 36677886089 (успешный, событие push).
- [x] Изменения и исключения описаны в docs/reports/PASTED_DUMPS_REVIEW_2026-09-29.md.
