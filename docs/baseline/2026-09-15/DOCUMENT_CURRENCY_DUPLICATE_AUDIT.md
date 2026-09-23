# Аудит актуальности и дублей документов

- Ветка: `site-v2`
- Дата проверки: 2026-09-23
- Источник проверки доступности: опубликованный сайт `https://сит-сальск.рф/`
- Реестр GitHub: `docs/baseline/2026-09-15/DOCUMENT_MANIFEST.tsv`

## Важное ограничение источника

Репозиторий не является полным зеркалом документного фонда: значительная часть файлов загружалась непосредственно на хостинг. Поэтому отсутствие файла в ветке `site-v2` не трактуется как отсутствие документа на опубликованном сайте. Для этого аудита разделены:

1. наличие и контрольные суммы файлов в репозитории;
2. доступность и фактическое содержимое URL на хостинге;
3. содержательная актуальность документа.

## Проверенный результат

- В манифесте: 430 записей, из них 428 документов.
- Страница документов `/svedenija/dokumenty/` отвечает HTTP 200 и содержит 8 ссылок на файлы документов.
- Страница Центра карьеры `/svedenija/employment/` отвечает HTTP 200 и содержит 16 ссылок на документы.
- Проверены все 68 URL, вошедшие в 25 групп одинаковых файлов.
- Все 68 URL отвечают HTTP 200.
- Для всех 25 групп SHA-256 файла, фактически скачанного с хостинга, совпадает с SHA-256 из манифеста и совпадает у всех URL внутри группы.
- У проверенных дубликатов типы ответа соответствуют фактическим опубликованным файлам, за исключением уже зафиксированной группы с одинаковым PDF, опубликованным также под расширением DOCX.
- Заголовок `Last-Modified` у проверенных копий: Thu, 21 May 2026 11:17:32 GMT.

## Дубли

Дубли не удалялись. Оба URL в каждой группе оставлены рабочими: удаление одной копии без анализа входящих ссылок может сломать старые страницы и внешние ссылки. Для новых ссылок рекомендуется использовать путь из текущего контента страницы, а старые пути считать совместимыми алиасами до отдельного решения.

| № | URL-копии | Размер, байт | SHA-256 фактического файла на хостинге |
|---:|---|---:|---|
| 1 | `assets/uploads/employment/gotovimsya-k-sobesedovaniyu.docx`<br>`assets/uploads/vypusknikam/centr-karjery-7.docx` | 18214 | `64947af7af4fdfb29b59e5c655ccbfdacb621a419d3440e384b9317dee3e8425` |
| 2 | `assets/uploads/employment/grafik-kursov-dpo-2025-2026.pdf`<br>`assets/uploads/vypusknikam/centr-karjery-16.pdf` | 375216 | `32ebe1e3c37242a6b1e97086f617843399f6aac1975ffab0b92e7a5fdfa2a15f` |
| 3 | `assets/uploads/employment/individualnyy-plan-karyery.docx`<br>`assets/uploads/vypusknikam/centr-karjery-8.docx` | 18606 | `b39356e8182f2cd1d2953df79b0301e408e96c893d74fd79b3835b5d747de978` |
| 4 | `assets/uploads/employment/informatsionnye-resursy-dlya-poiska-raboty.docx`<br>`assets/uploads/vypusknikam/centr-karjery-15.docx` | 15356 | `9a1047d09843f5d06974c2e491e60aebd1e06fe9b9a6613a8906b0feba861802` |
| 5 | `assets/uploads/employment/kak-sostavit-avtobiografiyu.docx`<br>`assets/uploads/vypusknikam/centr-karjery-9.docx` | 19680 | `fc86c55b71e10ca9b11ca19c2af983443f0b0e3b59ca3bc7501609b38ca66e70` |
| 6 | `assets/uploads/employment/kak-sostavit-karyernyy-plan.docx`<br>`assets/uploads/vypusknikam/centr-karjery-10.docx` | 24252 | `7025555cf3ddb6d0e71c33d407423f9e148efb074b0845ffa05b9c0fd1d51225` |
| 7 | `assets/uploads/employment/metodika-poiska-raboty.docx`<br>`assets/uploads/vypusknikam/centr-karjery-11.docx` | 16127 | `12e4d73f389c3225385236c2c99c9fe14b555dde4280e1ef9b11db3fdd0c47c1` |
| 8 | `assets/uploads/employment/obschaya-informatsiya.docx`<br>`assets/uploads/vypusknikam/centr-karjery-1.docx` | 18480 | `b28f6600b60ec8bd562bb6cc134928edc33e91abd6b8b1fe4bcfaac03c143316` |
| 9 | `assets/uploads/employment/pamyatka-individualnaya-karyernaya-traektoriya.docx`<br>`assets/uploads/vypusknikam/centr-karjery-14.docx` | 15970 | `594765efec1e33d79525bffabefd8d03eec5dea369b40e9042896462d20d1220` |
| 10 | `assets/uploads/employment/pamyatka-pervaya-vstrecha.docx`<br>`assets/uploads/vypusknikam/centr-karjery-13.docx` | 16510 | `835faeee189bef000af3aaa9a6ac32a85f76f666c9e3cc1240d438e2b7fed7d7` |
| 11 | `assets/uploads/employment/pamyatka-po-trudoustroystvu.docx`<br>`assets/uploads/vypusknikam/centr-karjery-12.docx` | 18511 | `0ab1de746701157b881897385f357e5637c192dd9de56c585ba16221aae05097` |
| 12 | `assets/uploads/employment/perechen-partnerov.docx`<br>`assets/uploads/vypusknikam/centr-karjery-4.docx` | 14248 | `02cbc1d8e7a75e02fb39716527498e6eb79fd08ee0a9bdf4cc93c36b8b32a0c2` |
| 13 | `assets/uploads/employment/polozhenie-o-tsentre-karyery-prikaz-89-2025.pdf`<br>`assets/uploads/vypusknikam/centr-karjery-2.pdf` | 4740617 | `3fa860e40b4065ed3bc935c8f5f35cfb712afbd1dedbff4c53c6805e700c7585` |
| 14 | `assets/uploads/employment/soglashenie-s-tszn-salsk-2025.pdf`<br>`assets/uploads/vypusknikam/centr-karjery-3.pdf`<br>`assets/uploads/Соглашение.pdf` | 4965705 | `d246926f44f0571399654e35491beb12b6e0d58007836afdebf7d63f361ae2fd` |
| 15 | `assets/uploads/employment/sostavlyaem-rezyume.doc`<br>`assets/uploads/vypusknikam/centr-karjery-6.doc` | 46592 | `a6ca831d6e03c3da1f124b7ca0e7feb57cb47ea2dd70af9eea952fac2a2cc788` |
| 16 | `assets/uploads/employment/spisok-vakansiy.pdf`<br>`assets/uploads/vypusknikam/centr-karjery-5.pdf` | 5690300 | `f94ecaf5dfe750c2b79996cf3304c2c8e48f40212ef806b96f8cbee293f3b2aa` |
| 17 | `assets/uploads/mto/biblioteka/Litsenzionnyy-dogovor-43-2025.pdf`<br>`assets/uploads/mto/biblioteka/Prilozhenie-1-2025.pdf`<br>`assets/uploads/mto/biblioteka/Prilozhenie-2-2025.pdf`<br>`assets/uploads/mto/biblioteka/Prilozhenie-3-2025.pdf`<br>`assets/uploads/mto/biblioteka/Rukovodstvo_mob_pril_LANY.pdf`<br>`assets/uploads/mto/eor/08.01.07_perechen-EOR.pdf`<br>`assets/uploads/mto/eor/09.02.01_perechen-EOR.pdf`<br>`assets/uploads/mto/eor/13.01.10_Perechen-EOR.docx`<br>`assets/uploads/mto/eor/13.01.10_Perechen-EOR.pdf`<br>`assets/uploads/mto/eor/15.01.05_perechen-EOR.pdf`<br>`assets/uploads/mto/eor/15.02.07_perechen-EOR.pdf`<br>`assets/uploads/mto/eor/38.01.02_perechen-EOR.pdf`<br>`assets/uploads/mto/eor/38.02.01_perechen-EOR.pdf`<br>`assets/uploads/mto/eor/43.01.09_perechen-EOR.pdf`<br>`assets/uploads/mto/eor/Katalog-elektronnyh-resursov.pdf`<br>`assets/uploads/stipend/9.Polozhenie-o-poryadke-zachisleniya-na-polnoe-gosudarstvennoe-obespechenie-i-predostavlenie-dopolnitelnyh-garantiy-po-sotsialnoy-zashchite.pdf`<br>`assets/uploads/stipend/Izmeneniya-v-Polozhenie-ob-organizatsii-pitaniya-obuchayushchihsya-GBPOU-RO-SIT.pdf`<br>`assets/uploads/stipend/O-vnesenii-izmeneniy-v-Polozhenie-o-polnom-gos.obespechenii-i-dopolnitelnyh-garantiyah-po-sotsialnoy-podderzhke-detey-sirot.pdf`<br>`assets/uploads/stipend/Prikaz-34-O-vnesenii-izmeneniy-v-polozhenie-o-stipendialnom-obespechenii-studentov-GBPOU-RO-SIT-12.03.2025.pdf` | 64254 | `976a6897b044a3734bc90d5ded68181757638fc4cdaed41b2674af85aab7c3de` |
| 18 | `assets/uploads/mto/main/Dogovor-Rostelekom-internet.pdf`<br>`docs/dokumenty/Договор-Ростелеком-интернет.pdf` | 236356 | `de786aa952b75dd041e7a226359544fe4ff1f3bfd32e9adabae649c2fbfaca77` |
| 19 | `assets/uploads/stipend/Polozhenie-na-odezhdu-i-obuv-detyam-sirotam.pdf`<br>`docs/dokumenty/Положение-на-одежду-и-обувь-детям-сиротам.pdf` | 415267 | `0f8f6f229eee2f07e430d39e2f5740bff4a40622d7eefb7356328d48ab0fdfb9` |
| 20 | `assets/uploads/stipend/Polozhenie-na-pitanie-i-prozhivanie-detey-sirot.pdf`<br>`docs/dokumenty/Положение-на-питание-и-проживание-детей-сирот.pdf` | 368282 | `5a5b8a6128a4d89da300346024423804d531023fcb7ecb156987d1bd638ce8be` |
| 21 | `assets/uploads/stipend/Polozhenie-na-proezd-detey-sirot.pdf`<br>`docs/dokumenty/Положение-на-проезд-детей-сирот.pdf` | 458426 | `27c39bd522a43f0d240fbdc9ac05822990e96ef52c538ca8aeb886190d12c863` |
| 22 | `assets/uploads/stipend/Polozhenie-o-dopolnitelnyh-platnyh-uslugah.pdf`<br>`docs/dokumenty/Положение-о-дополнительных-платных-услугах.pdf` | 452491 | `4e5d56b56f6355d8d9311100fc03695d8cdebe5bd05a18f44e0b61784cb298ee` |
| 23 | `assets/uploads/stipend/Polozhenie-po-denezhnym-vyplatam-detyam-sirotam.pdf`<br>`docs/dokumenty/Положение-по-денежным-выплатам-детям-сиротам.pdf` | 370098 | `e58c660a9144a5de9b037bfe53b6ac74203cabc7e8820f282a99f7cf610aa144` |
| 24 | `assets/uploads/stipend/Polozhenie-po-vypusku-detey-sirot.pdf`<br>`docs/dokumenty/Положение-по-выпуску-детей-сирот.pdf` | 423379 | `d86fa2b79cb4dbf5fa306bd5f9b26f3b4a084bea68f04a1da588d8cc3b65791c` |
| 25 | `assets/uploads/Обеспечение-психологической-безопасности.pdf`<br>`assets/uploads/метод-реком-для-педагогов.docx` | 1146378 | `27be6ca5213f8702e809ae7c2096db8b8f32a13e1e8c27e1fd557857576ad256` |

## Замечания по актуальности

Техническая доступность и совпадение содержимого не доказывают, что документ всё ещё содержательно актуален. На странице Центра карьеры опубликован файл `grafik-kursov-dpo-2025-2026.pdf`; на дату проверки 23.09.2026 учебный год 2025–2026 завершён, поэтому требуется решение владельца контента:

- **Вариант A — рекомендуемый:** предоставить/загрузить актуальный график на 2026–2027 учебный год и заменить ссылку, сохранив старый URL только при необходимости архива.
- **Вариант B:** оставить документ как архивный, но явно подписать его как материал за 2025–2026 учебный год.
- **Вариант C:** удалить ссылку и файл, если документ больше не должен быть доступен; перед этим проверить внешние ссылки и необходимость архива.

По остальным документам автоматическая проверка подтвердила наличие и целостность URL, но не подтверждает юридическую/содержательную актуальность без дат утверждения, срока действия или подтверждения ответственного лица.

## Статус пункта чек-листа

Пункт выполнен частично: дубли и публикационная доступность проверены и зафиксированы; содержательная актуальность одного явно датированного документа требует решения владельца контента. После решения по графику пункт можно перевести в `[x]` либо добавить отдельный пункт о плановой актуализации документов.