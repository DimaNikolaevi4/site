# Проверка остатков Mentor в V2

> Дата: 15.09.2026
> Ветка: site-v2

## Результат

Проверены исходные шаблоны, JavaScript, CSS, конфигурация Eleventy и дерево файлов V2 на наличие явных имён и путей Mentor/BootstrapMade.

- Файл src/assets/js/mentor-main.js в V2 отсутствует; используется отдельный src/assets/js/init-components.js.
- Явные строки Mentor, BootstrapMade и mentor-main в проверенных рабочих исходниках V2 не обнаружены.
- Каталог src/assets/template переименован в src/assets/site; fallback-ссылки и копирование статики обновлены.
- Изображения сохранены без изменения содержимого: about.jpg и hero-bg.jpg.
- src/assets/vendor/form-validation/validate.js намеренно оставлен для отдельного аудита в пункте 2.2; его происхождение и лицензирование этим отчётом не закрываются.

## Изменённые файлы

- .eleventy.js
- src/_includes/components/about.njk
- src/_includes/components/hero.njk
- src/assets/site/about.jpg
- src/assets/site/hero-bg.jpg

Проверка выходных HTML/CSS/JS после чистой V2-сборки выполняется отдельно в разделе 9 чеклиста.