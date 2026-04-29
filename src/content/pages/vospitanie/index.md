---
title: Воспитательная работа
layout: layouts/page-full.njk
description: Раздел «Воспитательная работа» ГБПОУ РО «Сальский индустриальный техникум» — штаб, план, волонтёрство, патриотическое и культурно-массовое воспитание, спорт, защита прав ребёнка.
category: vospitanie
rubric: "4"
permalink: /vospitanie/
---

# 4. Воспитательная работа

> **Источник:** [sit-salsk.ru — рубрика «4. ВОСПИТАТЕЛЬНАЯ РАБОТА»](https://sit-salsk.ru/?cat=26). Структура раздела перенесена со страницы-источника без изменений.

Раздел объединяет направления воспитательной работы техникума: организацию воспитательного процесса, студенческое самоуправление, волонтёрское и патриотическое движение, культурно-массовую работу, физическую культуру и спорт, защиту прав обучающихся.

{% set newsMode = 'razdel' %}
{% set newsTitle = "Структура раздела" %}
{% set excludeUrls = none %}
{% set newsCards = [
  { url: "/vospitanie/shtab/", emoji: "🏛️", title: "4.1. Штаб воспитательной работы", description: "Координирующий орган воспитательной работы техникума." },
  { url: "/vospitanie/plan/", emoji: "📋", title: "4.2. План воспитательной работы", description: "Годовой план мероприятий и направлений воспитательной деятельности." },
  { url: "/vospitanie/mo-rukovoditelej/", emoji: "👨‍🏫", title: "4.3. МО руководителей учебных групп", description: "Методическое объединение кураторов и классных руководителей." },
  { url: "/vospitanie/samoupravlenie/", emoji: "🗳️", title: "4.4. Студенческое самоуправление", description: "Студенческий совет, активы групп, выборные органы обучающихся." },
  { url: "/vospitanie/volonterstvo/", emoji: "🤝", title: "4.5. Волонтёрское движение", description: "Включает: 4.5.1 Волонтёрский отряд «Радуга добра»." },
  { url: "/vospitanie/patrioticheskoe/", emoji: "🎖️", title: "4.6. Патриотическое воспитание", description: "Включает: 4.6.1 Великая Победа · 4.6.2 ВПК «Витязь»." },
  { url: "/vospitanie/kulturno-massovaja/", emoji: "🎭", title: "4.7. Культурно-массовая работа", description: "Включает: 4.7.1 Театральный клуб «Мираж» · 4.7.2 Медиацентр «Новости СИТ» · 4.7.3 Поздравления · 4.7.4 «Движение Первых»." },
  { url: "/vospitanie/fizkultura-sport/", emoji: "⚽", title: "4.8. Физическая культура и спорт", description: "Включает: 4.8.1 ССК «Авангард»." },
  { url: "/vospitanie/upolnomochennyj-prava/", emoji: "⚖️", title: "4.9. Уполномоченный по правам ребёнка", description: "Защита прав и законных интересов обучающихся." }
] %}
{% include "components/news.njk" %}

---

{% set newsMode = 'razdel' %}
{% set newsTitle = "Связанные разделы" %}
{% set excludeUrls = none %}
{% set newsCards = [
  { url: "/studentam-i-roditeljam/", emoji: "🎓", title: "Студентам и родителям", description: "Расписание, библиотека, образовательные ресурсы." },
  { url: "/psihologicheskoe/", emoji: "🧠", title: "Психологическое сопровождение", description: "Раздел 6 — психолого-педагогическая помощь обучающимся." },
  { url: "/svedenija/dokumenty/", emoji: "📜", title: "Сведения → Документы", description: "Нормативные локальные акты по воспитательной работе." }
] %}
{% include "components/news.njk" %}
