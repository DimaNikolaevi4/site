# Настройка Eleventy Collections для автоматической категоризации

## Обзор

В проекте настроена **автоматическая система коллекций** на основе структуры рубрик из файла `src/_data/rubrics.yaml`. Это позволяет динамически создавать коллекции для каждой рубрики сайта без ручного добавления в конфиг.

## Как это работает

### 1. Источник данных: `rubrics.yaml`

Файл `src/_data/rubrics.yaml` содержит полную иерархическую структуру рубрик сайта:

```yaml
main_rubrics:
  - code: "1"
    title: "АБИТУРИЕНТАМ"
    slug: abiturientam
    level: 0
    children:
      - code: "1.1"
        title: "Слово директора"
        slug: slovo-direktora
      - code: "1.2"
        title: "Специальности и профессии"
        slug: specialnosti
```

### 2. Автоматическая регистрация коллекций

При запуске сборки Eleventy:
1. Загружает `rubrics.yaml`
2. Рекурсивно обходит все рубрики (включая вложенные)
3. Для каждой рубрики создаёт коллекцию. **Дефисы в имени коллекции удаляются** (`slovo-direktora` → `slovodirektora`), но в `slug` и URL дефисы сохраняются
4. Коллекция включает `.md` файлы из соответствующих папок в `src/content/`

**Пример:**
- Рубрика slug: `abiturientam` → Коллекция: `abiturientam`
- Рубрика slug: `slovo-direktora` → Коллекция: `slovodirektora` (без дефиса)
- Путь к файлам: `src/content/abiturientam/slovo-direktora.md` или `src/content/categories/abiturientam/...`

> ℹ️ Контент рубрик в проекте размещён в нескольких местах: `src/content/abiturientam/`, `src/content/categories/`, `src/content/pages/svedenija/` и др. Это исторически сложившаяся структура — см. ROADMAP.md (Этап 1.3).

### 3. Специальные коллекции

Помимо автоматических, созданы дополнительные коллекции:

| Коллекция | Описание |
|-----------|----------|
| `allRubricated` | Все материалы с указанной категорией |
| `recent` | 10 последних материалов с датой |
| `tags` | Уникальный список всех тегов |

## Использование в шаблонах

### Доступ к коллекции рубрики

```njk
{# Вывод списка материалов рубрики "Абитуриентам" #}
{% for item in collections.abiturientam %}
  <article>
    <h2><a href="{{ item.url }}">{{ item.data.title }}</a></h2>
    <time>{{ item.date | dateRu }}</time>
  </article>
{% endfor %}
```

### Вложенные рубрики

```njk
{# Вывод материалов вложенной рубрики #}
{% for item in collections['slovo-direktora'] %}
  {{ item.data.title }}
{% endfor %}
```

### Фильтры для работы с рубриками

#### `getBreadcrumbs` - Хлебные крошки

```njk
{% set crumbs = currentPageSlug | getBreadcrumbs %}
<nav class="breadcrumbs">
  {% for crumb in crumbs %}
    <span>{{ crumb.title }}</span>
    {% if not crumb.isLast %} / {% endif %}
  {% endfor %}
</nav>
```

#### `getChildRubrics` - Дочерние рубрики

```njk
{# Получить все подразделы "Абитуриентам" #}
{% set children = "abiturientam" | getChildRubrics %}
<ul>
  {% for child in children %}
    <li><a href="/{{ child.fullPath }}/">{{ child.title }}</a></li>
  {% endfor %}
</ul>
```

#### `getParentRubric` - Родительская рубрика

```njk
{% set parent = currentSlug | getParentRubric %}
{% if parent %}
  <a href="/{{ parent.fullPath }}/">{{ parent.title }}</a>
{% endif %}
```

## Структура контента

Для корректной работы коллекций соблюдайте структуру папок:

```
src/
└── content/
    └── categories/                # Корневая папка для всех рубрик
        ├── abiturientam/          # Рубрика 1-го уровня (код "1")
        │   ├── slovo-direktora/   # Рубрика 2-го уровня (код "1.1")
        │   │   └── index.md       # Материал
        │   └── specialnosti/      # Рубрика 2-го уровня (код "1.2")
        │       └── index.md
        ├── svedenija/             # Другая рубрика 1-го уровня (код "2")
        │   ├── osnovnye-svedenija/
        │   └── dokumenty/
        └── news/                  # Новости (отдельная коллекция, жестко задана)
            └── post-1.md
```

> ℹ️ **Примечание:** Рекомендуемая структура — размещать материалы новых рубрик в `src/content/categories/{rubric-slug}/`. Однако в текущем проекте есть исторические исключения:
> - Раздел «Абитуриентам» — в `src/content/abiturientam/`
> - Раздел «Сведения» — в `src/content/pages/svedenija/`
> - Документы — в `src/content/documents/`
> - Новости — в `src/content/news/`
>
> При добавлении новых рубрик придерживайтесь схемы `src/content/categories/`.

## Front Matter

В каждом файле материала указывайте:

```yaml
---
title: "Заголовок материала"
description: "SEO описание"
date: 2024-01-15
category: "abiturientam"  # Должна совпадать с slug рубрики
tags:
  - "поступление"
  - "2025"
layout: "layouts/post.njk"
permalink: "/abiturientam/priemnaya-kampaniya/"
---
```

## Логирование

При сборке выводится подробный лог зарегистрированных коллекций:

```
📁 Регистрация коллекций для 82 рубрик...
  ✓ Коллекция "abiturientam" (abiturientam)
  ✓ Коллекция "slovodirektora" (abiturientam/slovo-direktora)
  ✓ Коллекция "specialnosti" (abiturientam/specialnosti)
  ...
✅ Конфигурация коллекций загружена
✅ Фильтры рубрик зарегистрированы
```

## Преимущества

✅ **Автоматизация**: Не нужно вручную добавлять новые рубрики в конфиг  
✅ **Иерархичность**: Поддержка вложенных структур любой глубины  
✅ **Единый источник**: Структура определяется в `rubrics.yaml`  
✅ **Гибкость**: Фильтры для навигации между рубриками  
✅ **Масштабируемость**: Легко добавлять новые разделы  

## Добавление новой рубрики

1. Откройте `src/_data/rubrics.yaml`
2. Добавьте новую рубрику в нужное место иерархии:
   ```yaml
   - code: "1.10"
     title: "Новый раздел"
     slug: novyj-razdel
   ```
3. Создайте папку `src/content/categories/abiturientam/novyj-razdel/`
4. Добавьте материалы в формате `.md`
5. Запустите сборку — коллекция создастся автоматически

> ⚠️ **Важно:** Путь должен включать `categories/`: `src/content/categories/{parent-slug}/{new-slug}/`

## Отладка

Для просмотра всех доступных коллекций добавьте в шаблон:

```njk
<pre>{{ collections | dump }}</pre>
```

Или проверьте логи сборки — там перечислены все зарегистрированные коллекции.

## Примечания

- Имена коллекций приводятся к нижнему регистру, **дефисы удаляются** (например, `slovo-direktora` → `slovodirektora`)
- В `slug` рубрики и URL страниц дефисы сохраняются
- Если в рубрике нет файлов, коллекция будет пустой
- Материалы без `category` не попадают в `allRubricated`
- Для новостей используется отдельная коллекция `news`, которая регистрируется вручную в конфиге Eleventy (файл `.eleventy.js`)
- Рекомендуемый путь для новых рубрик: `src/content/categories/{rubric-slug}/`. Существующие исключения см. выше.
- Метки рубрик для хлебных крошек агрегируются в `src/_data/sectionLabels.js` (объединяет `menu.yaml`, `svedenijaMenu.yaml`, `rubrics.yaml`)
