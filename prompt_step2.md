# 🚀 Промпт для coder.qwen.ai — Шаг 2: Навигация и страницы

Скопируйте весь текст ниже и вставьте в чат coder.qwen.ai:

---

```markdown
🎯 ЗАДАЧА: Шаг 2 — Настроить навигацию и создать базовые страницы

📌 Контекст:
- ✅ Шаг 1 выполнен: проект инициализирован, сборка работает
- Репозиторий: https://github.com/DimaNikolaevi4/site 
- Архитектура: Eleventy 2.0.1 + Nunjucks + YAML-данные

🔧 ВЫПОЛНИ САМОСТОЯТЕЛЬНО (без вопросов, последовательно):

### 1️⃣ Создать файл навигации `src/_data/menu.yaml`:
```yaml
main:
  - title: Главная
    url: /
    key: home
  - title: О техникуме
    url: /about/
    key: about
  - title: Сведения
    url: /svedenija/
    key: svedenija
  - title: Новости
    url: /news/
    key: news
  - title: Контакты
    url: /contacts/
    key: contacts
```

### 2️⃣ Создать компонент шапки `src/_includes/header.njk`:
```njk
<header class="site-header">
  <div class="container">
    <a href="/" class="logo">{{ site.title }}</a>
    <nav class="main-nav">
      <ul>
        {% for item in menu.main %}
        <li><a href="{{ item.url }}" {% if page.url == item.url %}class="active"{% endif %}>{{ item.title }}</a></li>
        {% endfor %}
      </ul>
    </nav>
  </div>
</header>
```

### 3️⃣ Создать компонент подвала `src/_includes/footer.njk`:
```njk
<footer class="site-footer">
  <div class="container">
    <p>&copy; {{ site.title }} | {{ "now" | date: "%Y" }}</p>
    <p>{{ site.description }}</p>
  </div>
</footer>
```

### 4️⃣ Обновить `src/_includes/base.njk` — подключить header/footer:
Замени содержимое файла на:
```njk
<!DOCTYPE html>
<html lang="{{ site.lang }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ site.title }}{% if title %} | {{ title }}{% endif %}</title>
  <meta name="description" content="{{ site.description }}{% if description %} — {{ description }}{% endif %}">
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
  {% include "header.njk" %}
  <main class="site-main">
    {{ content | safe }}
  </main>
  {% include "footer.njk" %}
  <script src="/assets/js/main.js"></script>
</body>
</html>
```

### 5️⃣ Создать страницы разделов:

📄 `src/content/pages/about.md`:
```md
---
layout: base.njk
title: О техникуме
permalink: /about/
eleventyNavigation:
  key: about
  parent: main
---
# О техникуме

ГБПОУ РО "СИТ" — Сальский индустриальный техникум.

## Наша миссия
Подготовка квалифицированных специалистов для реального сектора экономики.

## Контакты
📍 г. Сальск, Ростовская область  
📞 +7 (86372) 2-00-00  
✉️ info@sit-salsk.ru
```

📄 `src/content/pages/contacts.md`:
```md
---
layout: base.njk
title: Контакты
permalink: /contacts/
eleventyNavigation:
  key: contacts
  parent: main
---
# Контакты

## Адрес
347900, Ростовская область, г. Сальск, ул. Ленина, 1

## Режим работы
Пн–Пт: 08:00–17:00  
Сб–Вс: выходные

## Форма связи
*Форма будет добавлена на следующем этапе.*
```

📄 `src/content/pages/svedenija/index.md`:
```md
---
layout: base.njk
title: Сведения об образовательной организации
permalink: /svedenija/
eleventyNavigation:
  key: svedenija
  parent: main
---
# Сведения об образовательной организации

Раздел содержит информацию в соответствии с требованиями Рособрнадзора:

- [Документы](./documents/)
- [Структура управления](./structure/)
- [Образование](./education/)
- [Руководство](./employees/)
- [Материально-техническое обеспечение](./objects/)
- [Стипендии и поддержка](./stipend/)
- [Финансово-хозяйственная деятельность](./finance/)
- [Вакантные места](./vacancies/)
- [Доступная среда](./access/)
- [Международное сотрудничество](./international/)

*Страницы подразделов будут созданы на следующем этапе.*
```

### 6️⃣ Обновить `src/index.md`:
Замени содержимое на:
```md
---
layout: base.njk
title: Главная
permalink: /
eleventyNavigation:
  key: home
  parent: main
---
# ГБПОУ РО "СИТ"

## Сальский индустриальный техникум

Добро пожаловать на официальный сайт техникума.

## Новости
*Список новостей появится после настройки коллекции.*

## Быстрые ссылки
- [Абитуриенту](/about/)
- [Студенту](/svedenija/)
- [Контакты](/contacts/)
```

### 7️⃣ Обновить стили `src/assets/css/style.css`:
Добавь/замени стили навигации:
```css
/* Базовые стили */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; background: #fff; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }

/* Шапка */
.site-header { background: #0d4a6b; color: #fff; padding: 1rem 0; }
.site-header .container { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
.logo { font-size: 1.5rem; font-weight: bold; color: #fff; text-decoration: none; }
.main-nav ul { list-style: none; display: flex; gap: 1.5rem; flex-wrap: wrap; }
.main-nav a { color: #fff; text-decoration: none; padding: 0.5rem; }
.main-nav a:hover, .main-nav a.active { border-bottom: 2px solid #ffd700; }

/* Основной контент */
.site-main { padding: 2rem 0; min-height: 60vh; }

/* Подвал */
.site-footer { background: #f5f5f5; padding: 1.5rem 0; text-align: center; color: #555; margin-top: 2rem; }

/* Адаптив */
@media (max-width: 768px) {
  .site-header .container { flex-direction: column; gap: 1rem; text-align: center; }
  .main-nav ul { justify-content: center; }
}
```

### 8️⃣ Проверка перед коммитом:
```bash
npm run build
ls -la public/
# Убедиться: public/index.html, public/about/index.html, public/contacts/index.html, public/svedenija/index.html
```

### 9️⃣ Закоммить и запушить:
```bash
git add .
git commit -m "feat: add navigation and base pages"
git push origin main
```

### 🔟 В ответе напиши ровно этот формат:
```
✅ Навигация настроена: menu.yaml, header.njk, footer.njk
✅ Страницы созданы: about.md, contacts.md, svedenija/index.md
✅ Главная обновлена: index.md
✅ Стили обновлены: адаптивная навигация
✅ Сборка: npm run build → OK
✅ Файлы в public/: [перечислить]
✅ Коммит отправлен: "feat: add navigation and base pages"
🔜 Следующий шаг: раздел "Сведения" (10 подразделов) + коллекция новостей
```

❗ ВАЖНО:
- Выполняй шаги ПОСЛЕДОВАТЕЛЬНО, без вопросов
- Если ошибка — покажи текст ошибки и предложи фикс
- Все пути к файлам — ТОЧНЫЕ, как указано выше
- Не пропускай ни один шаг

🚀 НАЧИНАЙ ПРЯМО СЕЙЧАС.
```

---

## 📋 Инструкция по использованию:

1. **Открой** чат в coder.qwen.ai
2. **Выдели** весь текст между тройными обратными кавычками (начиная с `🎯 ЗАДАЧА:` и заканчивая `🚀 НАЧИНАЙ ПРЯМО СЕЙЧАС.`)
3. **Скопируй** (Ctrl+C)
4. **Вставь** в чат (Ctrl+V)
5. **Нажми** кнопку "Опубликовать" или "Отправить"

## ✅ Ожидаемый результат:

ИИ выполнит все 10 шагов автоматически и вернёт отчёт в указанном формате.

## 🔍 Для проверки на GitHub:

После выполнения проверь репозиторий:
- Появились ли файлы в `src/_data/menu.yaml`
- Появились ли `src/_includes/header.njk`, `footer.njk`
- Обновлён ли `src/_includes/base.njk`
- Созданы ли `src/content/pages/about.md`, `contacts.md`, `svedenija/index.md`
- Обновлён ли `src/index.md`
- Обновлён ли `src/assets/css/style.css`

---

**Готово к копированию!** 🎯
