# Baseline screenshot report

## Результат

Контрольные скриншоты baseline пересняты 15.09.2026 из свежей сборки ветки
`site-v2`. Все 10 файлов созданы браузером Chromium через Puppeteer и
проверены как PNG по сигнатуре файла и заголовку `IHDR`.

## Сборка и запуск

- Установка: `npm ci`
- Сборка: `npm run build`
- Локальный сервер: `npm run dev -- --port=5000`
- Съёмка: `node baseline-capture.mjs`
- Сервер ответил HTTP 200 для всех 10 маршрутов.

## Маршруты и файлы

| Состояние | URL | Desktop | Mobile |
| --- | --- | --- | --- |
| Главная | `/` | `home-desktop.png` — 1920×5172 | `home-mobile.png` — 780×19436 |
| Type B | `/abiturientam/` | `abiturientam-desktop.png` — 1920×5304 | `abiturientam-mobile.png` — 780×19136 |
| Type C | `/news/den-pamyati-zhertv-genocida/` | `news-den-pamyati-zhertv-genocida-desktop.png` — 1920×3260 | `news-den-pamyati-zhertv-genocida-mobile.png` — 780×13364 |
| Документы | `/svedenija/` | `svedenija-desktop.png` — 1920×5844 | `svedenija-mobile.png` — 780×2385 |
| 404 | `/404.html` | `404-desktop.png` — 1920×2767 | `404-mobile.png` — 780×9284 |

## Проверка файлов

- Всего файлов: 10.
- Валидных PNG: 10.
- Невалидных файлов: 0.
- Каждый файл содержит PNG signature и `IHDR`.
- Вариант mobile снят с viewport 390×844 и device scale factor 2
  (итоговая ширина изображения — 780 px).
- Вариант desktop снят с viewport 1920×1080 и device scale factor 1.

SHA-256:

```text
404-desktop.png 119a34f61b9b0c5c2c04efa8182c5ddaf9dc8cc390dc7005d4853998925a57b9
404-mobile.png  69f66ded983078cd7ad8a0d6a90d67f5aa7fe68d1badb9d1dd2096023615f95
abiturientam-desktop.png 11f2e052609e2128864e14c82089e3e0862a1fae676173cb2d4df85ccdafbe
abiturientam-mobile.png 654df7e1063c1b5e82e6e59a369837013877a23daaecb2b5af80243fc2dc80683b
home-desktop.png 2a4b3c3cda0dc9c044c0c4f700122587c0306eacb8d5b442619b317aea26bbbe
home-mobile.png 69b1b36d5166cd115a32901ac132fe3850ef6ca99e74e2a49790d431a39b5d09e
news-den-pamyati-zhertv-genocida-desktop.png 6f97a3f3faa03a1e6ec34e971ac607a6bed4de25d8f32b47077dd2eaaa941f5b
news-den-pamyati-zhertv-genocida-mobile.png 3d24ba9044e782e132e175b1addce5f38c27c7f12aa7232ca3c5eeb0758b87
svedenija-desktop.png 4a96d642e481a2ff2c7c830b116233d0509efb2b454baa833fc9d659f21b49a0f
svedenija-mobile.png 2b865346d7c21a806b44ac5505257e18ac733abb1903bc7fdf5ad7f6e8a0ca1c7
```