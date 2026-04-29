---
title: Учебно-методическая работа
layout: layouts/page-full.njk
description: Раздел «Учебно-методическая работа» ГБПОУ РО «Сальский индустриальный техникум» — электронное обучение и ДОТ, дополнительное образование, практика.
rubric: "3"
permalink: /uchebno-metodicheskaja-rabota/
---

# 3. Учебно-методическая работа

> **Источник:** [sit-salsk.ru — рубрика «3. УЧЕБНО-МЕТОДИЧЕСКАЯ РАБОТА»](https://sit-salsk.ru/?cat=40). Раздел содержит три подраздела согласно структуре сайта техникума.

Раздел объединяет материалы по организации учебно-методической работы в техникуме. В соответствии со структурой сайта раздел включает три подраздела:

{% set newsMode = 'razdel' %}
{% set newsTitle = "Структура раздела" %}
{% set excludeUrls = none %}
{% set newsCards = [
  { url: "/uchebno-metodicheskaja-rabota/elektronnoe-obuchenie/", emoji: "💻", title: "3.1. ЭО и дистанционные образовательные технологии", description: "Применение электронного обучения (ЭО) и дистанционных образовательных технологий (ДОТ) в образовательном процессе." },
  { url: "/uchebno-metodicheskaja-rabota/dopolnitelnoe-obrazovanie/", emoji: "🎓", title: "3.2. Дополнительное образование", description: "Программы дополнительного образования для студентов и взрослых обучающихся." },
  { url: "/uchebno-metodicheskaja-rabota/praktika/", emoji: "🏭", title: "3.4. Практика", description: "Учебная и производственная практика, договоры с предприятиями, программы и отчёты." }
] %}
{% include "components/news.njk" %}

---

{% set newsMode = 'razdel' %}
{% set newsTitle = "Связанные разделы" %}
{% set excludeUrls = none %}
{% set newsCards = [
  { url: "/svedenija/education/", emoji: "📚", title: "Сведения → Образование", description: "Реализуемые образовательные программы, рабочие программы дисциплин и практик, программы ГИА." },
  { url: "/sotrudnichestvo/predprijatija/", emoji: "🏢", title: "Сотрудничество → Предприятия-партнёры", description: "Базы практики и социальные партнёры техникума." },
  { url: "/svedenija/employment/", emoji: "🧑‍💼", title: "Сведения → Центр Карьеры", description: "Содействие трудоустройству, дополнительное образование и курсы для студентов." }
] %}
{% include "components/news.njk" %}
