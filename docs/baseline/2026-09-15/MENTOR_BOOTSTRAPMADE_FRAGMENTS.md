# Реестр фрагментов Mentor / BootstrapMade

> Составлено 15.09.2026 для ветки site-v2.

## Назначение и границы

Этот документ фиксирует фрагменты, для которых в репозитории есть проверяемое свидетельство происхождения из темы Mentor или компонентов BootstrapMade. Сравнение выполнено между контрольной веткой main и рабочей веткой site-v2. Наличие фрагмента в Git не является доказательством права публикации; лицензионные выводы фиксируются отдельно.

Обозначения:

- **Подтверждено** — исходный файл содержит явную атрибуцию или сравнение веток показывает прямое удаление/переименование такого файла.
- **Кандидат** — структура или имя совпадает с типовой структурой Mentor, но одного этого недостаточно для утверждения происхождения.
- **Не включено в подтвержденные** — происхождение по текущим данным не устанавливается.

## 1. Подтверждённые фрагменты

### 1.1. Основной JavaScript Mentor

**Источник:** main:src/assets/js/mentor-main.js, строки 2–6.

В начале файла прямо указано:

- Template Name: Mentor;
- Template URL: https://bootstrapmade.com/mentor-free-education-bootstrap-theme/;
- Author: BootstrapMade.com;
- License: https://bootstrapmade.com/license/.

Функциональные блоки этого файла, занесённые в реестр как происходящие из Mentor:

| Фрагмент | Источник в main | Содержание | Состояние в site-v2 |
| --- | --- | --- | --- |
| Scroll state | 15–24 | переключение класса body.scrolled при прокрутке | исходный файл удалён |
| Mobile navigation | 29–50 | открытие/закрытие мобильного меню, закрытие по ссылке, dropdown | исходный файл удалён |
| Preloader | 69–73 | удаление #preloader после загрузки | исходный файл удалён |
| Scroll-to-top | 77–98 | кнопка .scroll-top, класс .active, плавная прокрутка | исходный файл удалён |
| AOS | 102–113 | инициализация Animate On Scroll | исходный файл удалён |
| GLightbox | 116–121 | инициализация lightbox по селектору .glightbox | исходный файл удалён |
| PureCounter | 125–129 | запуск PureCounter | исходный файл удалён |
| Swiper | 132–148 | инициализация слайдеров .init-swiper и .swiper-tab | исходный файл удалён |

Сравнение main...site-v2 показывает, что src/assets/js/mentor-main.js удалён из V2, а вместо него подключён src/assets/js/init-components.js. Это фиксирует происхождение исторического фрагмента, но не утверждает, что тот же код всё ещё присутствует в V2.

### 1.2. PHP Email Form от BootstrapMade

**Источник:** main:src/assets/vendor/php-email-form/validate.js, строки 2–4.

Файл содержит явную атрибуцию:

- PHP Email Form Validation v3.9;
- URL: https://bootstrapmade.com/php-email-form/;
- Author: BootstrapMade.com.

В рабочей ветке файл переименован в src/assets/vendor/form-validation/validate.js; в текущем коде сохраняется селектор .php-email-form (строка 5). Поэтому этот фрагмент считается прямым остатком BootstrapMade и требует отдельного решения в пункте 2.2 о переписывании, лицензировании или удалении.

### 1.3. Vendor-пути и подключения Mentor

**Источник:** main:src/_includes/layouts/base.njk, строки 46–58 и 155–160.

В исходном layout использовался namespace /assets/mentor/vendor/ для следующих компонентов:

- Bootstrap CSS/JS;
- Bootstrap Icons;
- AOS;
- GLightbox;
- Swiper;
- PHP Email Form;
- PureCounter;
- src/assets/js/mentor-main.js.

В site-v2 пути перенесены в /assets/vendor/, PHP Email Form заменён на form-validation, а mentor-main.js — на init-components.js. Само изменение пути не является доказательством самостоятельного происхождения библиотеки; оно только фиксирует миграцию старого подключения.

## 2. Кандидаты на отдельную ручную проверку

Следующие фрагменты присутствуют в V2 и похожи на структуру Mentor/Bootstrap, но в этом реестре не отмечаются как доказанно происходящие из BootstrapMade без построчного сравнения с исходным шаблоном:

| Файл | Фрагменты для сравнения |
| --- | --- |
| src/_includes/components/header.njk:1 | #header, классы .header, .navmenu, .mobile-nav-toggle, sticky header |
| src/_includes/layouts/base.njk:43–58 | preload/async-подключение CSS, Bootstrap utility-классы и vendor-набор |
| src/_includes/components/about.njk:91 | секция .about, layout изображения и текста |
| src/_includes/components/footer.njk | общая footer-композиция и Bootstrap Icons |
| src/styles/main.css и src/styles/critical.css | селекторы и визуальные паттерны, совпадающие с типовой темой Mentor; требуется сравнение с CSS оригинала |

Эти кандидаты не превращены в утверждение о происхождении и не закрывают пункты о лицензии.

## 3. Неизвестное происхождение

- Изображения src/assets/template/about.jpg и src/assets/template/hero-bg.jpg не считаются Mentor-ассетами только по имени каталога.
- Наличие Bootstrap, Bootstrap Icons, AOS, GLightbox, Swiper или PureCounter в подключениях не доказывает право публикации и не заменяет проверку лицензий.
- Источник каждой фотографии, логотипа и государственного символа должен фиксироваться в отдельном реестре ассетов.

## 4. Вывод по пункту 2.1.1

Список подтверждённых исторических фрагментов собран: mentor-main.js, PHP Email Form и Mentor vendor-пути с перечислением функциональных блоков и ссылками на файлы/строки. Пункты о лицензии, решении по каждому фрагменту и удалении остатков остаются открытыми.
