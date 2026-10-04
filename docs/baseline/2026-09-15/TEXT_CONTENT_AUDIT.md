# Аудит текстового контента V2

Дата проверки: 2026-09-21  
Ветка: site-v2  
Связанный блок: 2.4 — тексты.

## Методика

Проверены 112 файлов в src/content/, их front matter, каталоги, категории, даты, поля source/source_url, внешние URL и дубли нормализованного текста. Сборка Eleventy использует src как входной каталог; отдельного зеркала Markdown-контента в дереве V2 не обнаружено.

## Классификация

| Класс | Количество | Основание |
| --- | ---: | --- |
| Новости | 11 | Каталог src/content/news/ или category: news |
| Официальные и регламентированные сведения | 38 | Разделы svedenija, документы, безопасность, контакты, privacy, consent, about и обязательные образовательные сведения |
| Авторские и редакционные материалы | 63 | Категории, абитуриентам, воспитание, психологическое сопровождение, сотрудничество и материалы для студентов/родителей |

Разделение основано на структуре источника и front matter; это не меняет авторство текста и не является юридическим заключением.

## Источники и разрешения

- 41 файл содержит внешние URL.
- В 17 файлах есть явное поле source или source_url.
- В 24 файлах внешние ссылки присутствуют в тексте, но отдельное поле источника/разрешения не зафиксировано. Их нельзя считать полностью закрытыми по пункту 2.4.2 до отдельного решения.

Файлы для дозаполнения источника или разрешения:

- `src/content/abiturientam/kontakty-grafik.md`
- `src/content/abiturientam/priemnaya-kampaniya-2026.md`
- `src/content/news/2026-02-13-pobeda-za-nami.md`
- `src/content/pages/bezopasnost/antinarko.md`
- `src/content/pages/bezopasnost/extremizm.md`
- `src/content/pages/bezopasnost/pozharnaya.md`
- `src/content/pages/psihologicheskoe/podderzhka-ovz.md`
- `src/content/pages/psihologicheskoe/profilaktika-narkotikov.md`
- `src/content/pages/psihologicheskoe/rezultaty-testirovanij.md`
- `src/content/pages/psihologicheskoe/sovety-prepodavatelyam.md`
- `src/content/pages/psihologicheskoe/sovety-roditelyam.md`
- `src/content/pages/psihologicheskoe/sovety-studentam.md`
- `src/content/pages/sotrudnichestvo/zanyatost.md`
- `src/content/pages/studentam-i-roditeljam/prikaz-zachislenie.md`
- `src/content/pages/studentam-i-roditeljam/raspisanie.md`
- `src/content/pages/studentam-i-roditeljam/resursy.md`
- `src/content/pages/studentam-i-roditeljam/roditeljam.md`
- `src/content/pages/svedenija/basic/index.md`
- `src/content/pages/svedenija/documents/vsoko/index.md`
- `src/content/pages/svedenija/employment/index.md`
- `src/content/pages/svedenija/finance/index.md`
- `src/content/pages/svedenija/index.md`
- `src/content/pages/third-party-notices.md`
- `src/content/pages/vospitanie/plan.md`

## Даты, названия и реквизиты

- Парные поля date/updated не содержат случаев, где updated раньше date.
- Формат проверенных ISO-дат корректен.
- Встречаются сокращения ГБПОУ РО «СИТ»/ГБПОУ РО СИТ и полное наименование; они отмечены как варианты одного учреждения, но фактические реквизиты и актуальность внешних сведений требуют содержательной проверки ответственным владельцем.

## Единый источник V2

- В .eleventy.js входом указана директория src, а контент подключается из src/content/.
- Дубли нормализованного текста среди 112 проверенных файлов не обнаружены.
- Это подтверждает текущий источник сборки, но не доказывает историческое происхождение каждой редакции и не заменяет ревизию CMS/деплоя.

## Открытые решения

1. Для 24 файлов выше указать официальный источник или разрешение; рабочий реестр: `docs/baseline/2026-09-15/EXTERNAL_TEXT_SOURCE_REVIEW.md`.
2. Назначить правило для материалов, которые нельзя менять без согласования: роль согласующего, перечень разделов и способ фиксации решения. Рабочее правило: `docs/baseline/2026-09-15/CONTENT_APPROVAL_POLICY.md`; конкретные владельцы ещё не назначены.
3. Выполнить содержательную проверку актуальности реквизитов и внешних документов; автоматическая проверка дат этого не заменяет. Найденные случаи: `docs/baseline/2026-09-15/CONTENT_FACTS_REVIEW.md`.
