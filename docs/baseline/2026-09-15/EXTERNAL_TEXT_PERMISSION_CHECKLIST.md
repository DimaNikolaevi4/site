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

### 1. `src/content/news/2026-02-13-pobeda-za-nami.md`

Статус: **`PERMISSION_REQUIRED`**  
Основание: материал ссылается на внешний портал Народного фронта и содержит самостоятельное описание акции, её формулировки и слоган. Пока авторство и разрешение на воспроизведение/адаптацию не подтверждены.

Страницы для проверки:

- https://pobeda.onf.ru/requirements/rostovskaya

Чеклист:

- [ ] Установить правообладателя текста и условия использования материалов на странице ONF.
- [ ] Проверить, есть ли разрешение на публикацию описания акции на сайте СИТ.
- [ ] Если разрешение есть — сохранить подтверждение в рабочем протоколе и зафиксировать объём разрешения: сайт, срок, атрибуция, возможность редактирования.
- [ ] Если разрешения нет — переписать описание своими словами, оставить только проверяемые факты и ссылку на официальный портал; удалить неподтверждённые авторские формулировки и слоганы.
- [ ] После решения проверить итоговый текст, выполнить сборку и обновить этот реестр.

## Классификация остальных материалов

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
- Один материал переведён в отдельную очередь `PERMISSION_REQUIRED` с прямой ссылкой на страницу текста и пошаговой отработкой.
- Пункт 2.4.2 нельзя отмечать полностью выполненным, пока по материалу ONF не будет сохранено разрешение либо не будет опубликована самостоятельная редакция без неподтверждённого воспроизведения.
