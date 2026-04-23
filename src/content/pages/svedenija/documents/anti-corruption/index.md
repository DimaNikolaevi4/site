---
layout: layouts/svedenija-page.njk
title: Противодействие коррупции
permalink: /svedenija/dokumenty/anti-corruption/
eleventyNavigation:
  key: anti-corruption
  parent: documents
breadcrumb:
  - title: Сведения
    url: /svedenija/
  - title: Документы
    url: /svedenija/dokumenty/
  - title: Противодействие коррупции
rubric: "0"
---

{% set antiCorruption = collections["anti-corruption-data"][0].data.sections %}
{% include "components/anti-corruption-content.njk" %}
