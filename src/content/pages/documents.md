---
layout: layouts/page-full.njk
title: Документы
permalink: /documents/
description: Официальные документы ГБПОУ РО «Сальский индустриальный техникум» — полный реестр документов размещён в разделе «Сведения об образовательной организации → Документы»
eleventyNavigation:
  key: documents
  parent: main
rubric: "0"
suppressSubrubrics: true
---

# Документы

Полный реестр официальных документов техникума размещён в разделе **«Сведения об образовательной организации → Документы»** в соответствии с приказом Рособрнадзора от 14.08.2020 № 831 и приказом Минобрнауки от 18.01.2024 № 36.

{% set newsMode = 'razdel' %}
{% set newsTitle = "Перейти к документам" %}
{% set excludeUrls = none %}
{% set newsCards = [
  { url: "/svedenija/dokumenty/", emoji: "📚", title: "Все документы", description: "Устав, лицензия, аккредитация, локальные нормативные акты, правила приёма, положения, отчёты — полный реестр." },
  { url: "/svedenija/dokumenty/vsoko/", emoji: "📊", title: "ВСОКО", description: "Внутренняя система оценки качества образования: положения, отчёты, результаты." },
  { url: "/svedenija/dokumenty/anti-corruption/", emoji: "⚖️", title: "Антикоррупционные документы", description: "Антикоррупционная политика, нормативные акты, формы документов, отчёты." }
] %}
{% include "components/news.njk" %}
