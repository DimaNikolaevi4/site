# Чеклист разрешений и источников внешних текстов V2

Дата: 2026-09-23  
Ветка: `site-v2`  
Связанный пункт: 2.4.2 из `SITE_V2_CHECKLIST.md`.  
Основной реестр: `docs/baseline/2026-09-15/EXTERNAL_TEXT_SOURCE_REVIEW.md`.

## Статус и правило классификации

Аудит выполнен по гибридному правилу, согласованному в рабочем обсуждении:

- `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` — материал с доменов СИТ, ЭОС СИТ или заявленного официального аккаунта; это фиксация заявленного внутреннего происхождения, а не независимое юридическое заключение.
- `OFFICIAL_REFERENCE / FACTS_ONLY` — нормативный или официальный внешний источник, используемый для факта, требования или ссылки; это не разрешение на копирование текста.
- `LINK_ONLY` — внешняя страница только указана ссылкой, её текст в V2 не воспроизводится.
- `LICENSE_REFERENCE` — страница используется для сведений о лицензии зависимости.
- `PERMISSION_REQUIRED` — в V2 есть описание или формулировки, которые нельзя считать автоматически разрешёнными только из-за ссылки на внешнюю страницу.

Факт наличия ссылки не доказывает право воспроизведения текста. Реестр фиксирует рабочую позицию и требует отдельного подтверждения для спорных материалов.

## Материалы, требующие отдельной отработки

### 1. `src/content/news/2026-02-13-pobeda-za-nami.md`\n\nСтатус: **`OFFICIAL_REFERENCE / FACTS_ONLY`**  \nОснование: текущая страница ONF является официальным справочным источником. В тексте новости V2 оставлены собственное описание акции и ссылка на источник; дословного совпадения с доступным содержимым страницы не обнаружено. Это не утверждение о юридическом статусе отдельных слоганов и не заменяет проверку исторических версий страницы.\n\nСтраница-источник:\n\n- https://pobeda.onf.ru/requirements/rostovskaya\n\nПроверка:\n\n- [x] Зафиксирован официальный источник ONF.\n- [x] В V2 сохранена ссылка на официальный источник.\n- [x] Текущая версия страницы сопоставлена с текстом новости; дословное воспроизведение не выявлено.\n- [x] Материал классифицирован как фактическая справка, а не как воспроизведение внешней статьи.\n\n## Классификация остальных материалов

| № | Файл V2 | Решение | Действие |
|---:|---|---|---|
| 1 | `src/content/abiturientam/kontakty-grafik.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Проверить внутреннее происхождение и актуальность реквизитов; разрешение третьей стороны не требуется при подтверждённом авторстве СИТ. |
| 2 | `src/content/abiturientam/priemnaya-kampaniya-2026.md` | `OWNER_STATED + OFFICIAL_REFERENCE / FACTS_ONLY` | Официальные документы и нормативные ссылки оставить как источники фактов; не копировать тексты документов дословно без отдельного основания. |
| 3 | `src/content/news/2026-02-13-pobeda-za-nami.md` | `PERMISSION_REQUIRED` | Выполнить отдельный чеклист выше. |
| 4 | `src/content/pages/bezopasnost/antinarko.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов старого официального сайта и актуальность текста. |
| 5 | `src/content/pages/bezopasnost/extremizm.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов старого официального сайта и актуальность текста. |
| 6 | `src/content/pages/bezopasnost/pozharnaya.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов старого официального сайта и актуальность текста. |
| 7 | `src/content/pages/psihologicheskoe/podderzhka-ovz.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов старого официального сайта и актуальность текста. |
| 8 | `src/content/pages/psihologicheskoe/profilaktika-narkotikov.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов старого официального сайта и актуальность текста. |
| 9 | `src/content/pages/psihologicheskoe/rezultaty-testirovanij.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов старого официального сайта и актуальность текста. |
| 10 | `src/content/pages/psihologicheskoe/sovety-prepodavatelyam.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов старого официального сайта и актуальность текста. |
| 11 | `src/content/pages/psihologicheskoe/sovety-roditelyam.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов старого официального сайта и актуальность текста. |
| 12 | `src/content/pages/psihologicheskoe/sovety-studentam.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов старого официального сайта и актуальность текста. |
| 13 | `src/content/pages/sotrudnichestvo/zanyatost.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов старого официального сайта и актуальность текста. |
| 14 | `src/content/pages/studentam-i-roditeljam/prikaz-zachislenie.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов старого официального сайта и актуальность текста. |
| 15 | `src/content/pages/studentam-i-roditeljam/raspisanie.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | ЭОС и страницы СИТ оставить как внутренние источники; проверить актуальность ссылок и расписания. |
| 16 | `src/content/pages/studentam-i-roditeljam/resursy.md` | `LINK_ONLY / OFFICIAL_REFERENCE` | Внешние образовательные ресурсы используются ссылками; не переносить их тексты в V2. |
| 17 | `src/content/pages/studentam-i-roditeljam/roditeljam.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов старого официального сайта и актуальность текста. |
| 18 | `src/content/pages/svedenija/basic/index.md` | `OWNER_STATED + OFFICIAL_REFERENCE / FACTS_ONLY` | Сведения СИТ оставить как внутренние; данные регионального ведомства использовать только как проверяемые факты и ссылки. |
| 19 | `src/content/pages/svedenija/documents/vsoko/index.md` | `LINK_ONLY / OWNER_STATED_INTERNAL_FORMS` | Формы оставить ссылками; отдельно подтвердить, что формы принадлежат СИТ и доступны для публикации. |
| 20 | `src/content/pages/svedenija/employment/index.md` | `LINK_ONLY` | Внешние ресурсы оставить ссылками; их тексты в V2 не воспроизводятся. |
| 21 | `src/content/pages/svedenija/finance/index.md` | `OFFICIAL_REFERENCE / FACTS_ONLY` | Использовать bus.gov.ru как источник проверяемых сведений, не копировать страницу целиком. |
| 22 | `src/content/pages/svedenija/index.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материалов официальной группы СИТ и актуальность сведений. |
| 23 | `src/content/pages/third-party-notices.md` | `LICENSE_REFERENCE` | Оставить ссылки на лицензии зависимостей; это отдельный лицензионный реестр, не воспроизведение внешней редакционной статьи. |
| 24 | `src/content/pages/vospitanie/plan.md` | `OWNER_STATED / INTERNAL_OFFICIAL_SOURCE` | Подтвердить внутреннее происхождение материала старого официального сайта и актуальность текста. |

## Итог пункта 2.4.2

- Классификация всех 24 материалов вынесена в отдельный рабочий чеклист.
- Материал ONF переведён в `OFFICIAL_REFERENCE / FACTS_ONLY`; ссылка и результат сопоставления сохранены выше.
- Пункт 2.4.2 может быть отмечен выполненным: для каждого материала зафиксирован источник или режим использования; для ONF сохранены ссылка и результат сопоставления с текущей страницей.
