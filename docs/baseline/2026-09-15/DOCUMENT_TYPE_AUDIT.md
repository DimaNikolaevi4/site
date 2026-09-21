# Аудит типов документов

- Ветка: `site-v2`
- Дата проверки: 2026-09-21
- Исходный реестр: `docs/baseline/2026-09-15/DOCUMENT_MANIFEST.tsv`

## Найдено

В реестре 428 записей с документными расширениями (PDF, DOC, DOCX, XLSX). При проверке содержимого всех файлов из подозрительной группы размером 64 254 байта обнаружены 19 несоответствий: расширение заявляет документ, но первые байты содержимого — HTML `<!doctype html>`.

Все 19 файлов имеют одинаковый размер и одинаковое HTML-содержимое, поэтому это не документы, а сохранённая HTML-страница приложения/ошибки:

- `src/assets/uploads/mto/biblioteka/Litsenzionnyy-dogovor-43-2025.pdf`
- `src/assets/uploads/mto/biblioteka/Prilozhenie-1-2025.pdf`
- `src/assets/uploads/mto/biblioteka/Prilozhenie-2-2025.pdf`
- `src/assets/uploads/mto/biblioteka/Prilozhenie-3-2025.pdf`
- `src/assets/uploads/mto/biblioteka/Rukovodstvo_mob_pril_LANY.pdf`
- `src/assets/uploads/mto/eor/08.01.07_perechen-EOR.pdf`
- `src/assets/uploads/mto/eor/09.02.01_perechen-EOR.pdf`
- `src/assets/uploads/mto/eor/13.01.10_Perechen-EOR.docx`
- `src/assets/uploads/mto/eor/13.01.10_Perechen-EOR.pdf`
- `src/assets/uploads/mto/eor/15.01.05_perechen-EOR.pdf`
- `src/assets/uploads/mto/eor/15.02.07_perechen-EOR.pdf`
- `src/assets/uploads/mto/eor/38.01.02_perechen-EOR.pdf`
- `src/assets/uploads/mto/eor/38.02.01_perechen-EOR.pdf`
- `src/assets/uploads/mto/eor/43.01.09_perechen-EOR.pdf`
- `src/assets/uploads/mto/eor/Katalog-elektronnyh-resursov.pdf`
- `src/assets/uploads/stipend/9.Polozhenie-o-poryadke-zachisleniya-na-polnoe-gosudarstvennoe-obespechenie-i-predostavlenie-dopolnitelnyh-garantiy-po-sotsialnoy-zashchite.pdf`
- `src/assets/uploads/stipend/Izmeneniya-v-Polozhenie-ob-organizatsii-pitaniya-obuchayushchihsya-GBPOU-RO-SIT.pdf`
- `src/assets/uploads/stipend/O-vnesenii-izmeneniy-v-Polozhenie-o-polnom-gos.obespechenii-i-dopolnitelnyh-garantiyah-po-sotsialnoy-podderzhke-detey-sirot.pdf`
- `src/assets/uploads/stipend/Prikaz-34-O-vnesenii-izmeneniy-v-polozhenie-o-stipendialnom-obespechenii-studentov-GBPOU-RO-SIT-12.03.2025.pdf`

В список входит файл, отдельно указанный в checklist: `src/assets/uploads/mto/eor/38.02.01_perechen-EOR.pdf`.

## Что подтверждено

- 19 файлов проверены по фактической сигнатуре содержимого;
- у всех 19 сигнатура HTML, а не PDF/OOXML;
- исходные документы для замены в ветке не обнаружены;
- переименование расширения не является исправлением и не выполняется.

## Ограничение текущего прохода

Остальные 409 документных файлов не попали в группу одинакового подозрительного размера. Для полного побайтного аудита всех 428 файлов нужен локальный checkout/скрипт с чтением первых байтов каждого файла либо доступ к GitHub Raw с byte-range запросами. Через текущий GitHub API-контур большие бинарные файлы нельзя безопасно читать целиком в одном проходе.

До получения источников оригиналов удаление или замена 19 файлов будет деструктивным: вместе с ними могут исчезнуть рабочие ссылки на документы. Поэтому следующий пункт про исправление `38.02.01_perechen-EOR.pdf` требует решения по источнику восстановления.
