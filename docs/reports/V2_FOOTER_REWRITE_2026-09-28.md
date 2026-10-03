# Аудит самостоятельной структуры footer V2

Дата: 2026-09-28  
Ветка: `site-v2`  
Файл: `src/_includes/components/footer.njk`

## Выполнено

- Компонент получил самостоятельную оболочку `component-footer` и namespace `site-footer__*` для декора, контейнера, верхнего блока, бренда, корпусов, навигации, ресурсов, legal и нижнего блока.
- Сохранены источники данных `site`, `contacts` и `social`, циклы по `contacts.corps` и условный вывод license/accreditation.
- Сохранены 12 официальных ресурсов, политика конфиденциальности, sitemap, admin и `/third-party-notices/`.
- Для внешних ссылок приведён к единому виду `rel="noopener noreferrer"`; тексты, реквизиты, URL и изображения не изменялись.
- В компоненте нет строк `mentor-main`, `BootstrapMade` или Mentor-путей.

## Статическая проверка

- корневой элемент остаётся `<footer role="contentinfo">`;
- присутствует `aria-labelledby="footer-resources-title"`;
- сохранены условия `social.vk`, `social.rutube`, `contacts.email`, `contacts.phone_link`, `site.license` и `site.accreditation`;
- notices-ссылка присутствует в нижнем блоке.

Браузерная проверка полного footer и внешних ссылок относится к следующим пунктам.