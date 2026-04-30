---
title: Безопасность
layout: layouts/page-full.njk
description: Раздел «Безопасность» ГБПОУ РО «Сальский индустриальный техникум» — противодействие коррупции, профилактика экстремизма и терроризма, антинаркотическая деятельность, пожарная безопасность.
permalink: /bezopasnost/
section: bezopasnost
sectionTitle: Безопасность
suppressSubrubrics: true
---

# Безопасность

В этом разделе собраны материалы по ключевым направлениям обеспечения безопасности образовательной деятельности техникума.

{% set newsMode = 'razdel' %}
{% set newsTitle = "Подразделы" %}
{% set excludeUrls = none %}
{% set newsCards = [
  { url: "/bezopasnost/antikorrupcija/", emoji: "⚖️", title: "Противодействие коррупции", description: "Нормативные документы, план мероприятий, формы обращений, контактные лица." },
  { url: "/bezopasnost/extremizm/", emoji: "🛡️", title: "Профилактика экстремизма и терроризма", description: "Памятки, телефоны экстренной связи, нормативно-правовая база." },
  { url: "/bezopasnost/antinarko/", emoji: "🚫", title: "Антинаркотическая деятельность", description: "Профилактика употребления психоактивных веществ, помощь и поддержка." },
  { url: "/bezopasnost/pozharnaya/", emoji: "🔥", title: "Пожарная безопасность", description: "Инструкции, схемы эвакуации, правила поведения при пожаре." }
] %}
{% include "components/news.njk" %}
