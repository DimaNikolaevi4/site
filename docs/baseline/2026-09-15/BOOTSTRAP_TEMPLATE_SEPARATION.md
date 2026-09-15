# Bootstrap-паттерны и уникальная разметка V2

> Ветка: site-v2. Дата аудита: 15.09.2026.
> Назначение: закрыть пункт 2.1 «Отделить стандартные Bootstrap-паттерны от уникальной разметки шаблона».

## Метод и границы

Сопоставлены актуальные Nunjucks-компоненты, layout и CSS V2 с реестром Mentor/BootstrapMade: docs/baseline/2026-09-15/MENTOR_BOOTSTRAPMADE_FRAGMENTS.md. Классификация описывает структуру и зависимость от Bootstrap; она не является юридическим выводом о самостоятельном происхождении или праве публикации.

Правило: совпадение имени класса, расположения блока или визуального паттерна с Mentor не считается доказательством происхождения. Прямые остатки Mentor/BootstrapMade остаются отдельными задачами пунктов 2.1.2, 2.2 и 5.

## 1. Стандартные Bootstrap-паттерны

Следующие элементы используются как библиотечные Bootstrap-паттерны и не считаются уникальной разметкой проекта:

| Группа | Примеры в V2 | Файлы | Решение |
| --- | --- | --- | --- |
| Контейнеры и сетка | container, container-fluid, container-xl, row, col-lg-6 | components/header.njk:2, components/hero.njk:44, components/about.njk:28, 92–106, components/footer.njk:41 | Bootstrap layout; содержимое и порядок блоков проекта — отдельный слой |
| Утилиты отображения и spacing | d-flex, d-none, d-lg-flex, d-lg-none, d-xl-none, d-xxl-none, align-items-*, justify-content-*, m-*, p-*, gap-*, order-* | header.njk:2, 11–12, 22, 60, 104; about.njk:51, 95, 106, 110, 116–119 | Bootstrap utilities; не считать их авторской разметкой |
| Изображения и типовые кнопки | img-fluid, rounded, shadow-sm, btn, btn-primary, btn-lg | about.njk:43, 69, 99, 143; hero.njk:77 | Bootstrap utility/component classes; соседние project-классы задают собственное поведение |
| Offcanvas | offcanvas, offcanvas-end, offcanvas-header, offcanvas-body, data-bs-toggle, data-bs-target, data-bs-dismiss | header.njk:91–106, 178–193, 302 | Bootstrap-механика; oc-* и содержимое меню — собственная реализация |
| Иконки | bi, bi-* | все основные компоненты | Bootstrap Icons; выбор и смысл иконок — контентное решение проекта |
| Доступность и reset utilities | visually-hidden, list-unstyled, text-center, flex-shrink-0 | base.njk:150–151, header.njk:12, about.njk:51, 116–119, footer.njk:66–84 | Библиотечные/utility-классы; не доказывают происхождение окружающего блока |

## 2. Уникальная разметка и стили проекта

Эти классы имеют проектную BEM-подобную схему, собственные состояния и содержимое. Они не являются стандартными Bootstrap-компонентами:

| Область | Уникальные классы/структура | Файлы | Основание классификации |
| --- | --- | --- | --- |
| Шапка | main-nav, main-nav__link, main-nav__icon, header-icons, header-icon-btn, a11y-wrap | components/header.njk:11–110; styles/critical.css:78–90 | Собственная информационная архитектура, иконки, активные состояния и responsive-правила |
| Hero | section-hero, page-hero, page-hero__bg, page-hero__overlay, page-hero__credit, page-hero__org, page-hero__divider, page-hero__rubric | components/hero.njk:29–77; styles/critical.css:93–105 | Собственная композиция баннера, градиент, авторство и логика H1 |
| Поиск | search-modal, search-modal__* | components/header.njk:117–171; styles/main.css:5543–5842 | Проектный modal search с двумя режимами, результатами и отдельным JS |
| Навигация offcanvas | oc-*, offcanvas-quicklinks__*, offcanvas-actions, a11y-panel | components/header.njk:178–390; styles/main.css:4793–5417 | Bootstrap даёт только контейнер offcanvas; многоуровневые панели, split-row и доступность — код проекта |
| Хлебные крошки | breadcrumbs, component-breadcrumbs, breadcrumb-list, breadcrumb-item--current | components/breadcrumbs.njk:29–138; styles/main.css:6623–6675 | Собственная логика источников меток, URL-сегментов и Schema.org; базовое имя breadcrumb-item не меняет вывод |
| Контентные компоненты | component-about, component-about--*, narodfront-*, component-pobeda-banner, component-news, component-popular, component-sidebar | components/about.njk:27–143; styles/main.css:2436–2615, 7767–8031 | Собственные композиции, данные и responsive grid поверх Bootstrap utilities |
| Подвал | site-footer, footer-*, footer-resources, footer-resource, footer-bottom, brand-divider | components/footer.njk:38–269; styles/main.css:2725–3270 | Собственная структура корпусов, официальных ресурсов, лицензий и авторства; Bootstrap используется только точечно |

## 3. Смешанные и спорные фрагменты

| Фрагмент | Классификация | Что следует делать дальше |
| --- | --- | --- |
| header / logo / about / footer / hero | Смешанный: общие имена и часть структуры исторически похожи на Mentor, но актуальная композиция содержит проектные классы и контент | Не считать самостоятельное переименование доказательством происхождения; выполнить отдельную проверку остаточных Mentor-файлов и CSS |
| critical.css: container и минимальные utilities | Совместимость Bootstrap, реализованная локально до загрузки Bootstrap | Считать локальным compatibility layer, но не заменой лицензии Bootstrap |
| main.css: старые .header .navmenu, .hero, .about .content, .pricing и связанные селекторы | Исторический/legacy слой, не относящийся автоматически к новой V2-разметке | Не считать его уникальным V2; проверить удаление или изоляцию в пунктах 2.2, 5 и 6 |
| form-validation/validate.js и селектор .php-email-form | Прямой остаток, зафиксированный в реестре F-10/F-11/F-17 | Не закрывать этим документом; решить отдельно в пункте 2.2 |

## 4. Реестр решений

1. Bootstrap-классы и Bootstrap Icons остаются внешними библиотечными зависимостями; их наличие не делает окружающую разметку шаблонной или самостоятельной.
2. Проектные классы выделены по собственному префиксу/схеме и по наличию уникальной логики, данных и состояний.
3. Для классов с общими именами сохранена осторожная маркировка «смешанный», а не утверждение об авторстве.
4. Никакие vendor-файлы, фотографии, документы или старые CSS-селекторы этим пунктом не объявляются очищенными; это следующие пункты чеклиста.

## Результат

Пункт 2.1 выполнен: стандартные Bootstrap-паттерны, уникальная V2-разметка и смешанные/legacy-фрагменты разделены с указанием файлов и дальнейших действий. Следующий невыполненный пункт — «Удалить Mentor-названия, пути и код из V2 после завершения миграции»; к нему переходить после фиксации этого документа.