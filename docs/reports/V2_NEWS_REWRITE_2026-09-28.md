# Аудит самостоятельной структуры news V2

Дата: 2026-09-28  
Ветка: `site-v2`  
Файл: `src/_includes/components/news.njk`

## Выполнено

- Компонент получил собственные оболочки `site-news`, `site-news--home`, `site-news--section` и `site-news__*`.
- Сохранены два режима: карточки последних новостей (`newsMode=home`) и сетка ресурсов раздела (`newsMode=razdel`).
- Сохранены фильтрация новостей без изображения, лимит `newsCount`, fallback описания и пустое состояние.
- Сохранён whitespace-control в режиме `razdel`, чтобы Markdown не оборачивал список ресурсов в лишние `<p>`.
- Тексты, URL, коллекция `collections.news` и формат `newsCards` не изменялись.
- В компоненте нет строк `mentor-main`, `BootstrapMade` или Mentor-путей.

## Статическая проверка

- home-ветка имеет отдельный `data-component="news"`;
- resource-ветка имеет отдельный `data-component="news-links"`;
- карточка новости получила семантический `<article>`;
- CSS-классы `course-item` и `rubric-resources-grid` сохранены для совместимости.

Браузерный прогон и проверка пустого состояния относятся к отдельным пунктам интерактивности и доступности.