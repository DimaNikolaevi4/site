---
layout: svedenija-page.njk
title: Противодействие коррупции
permalink: /svedenija/documents/anti-corruption/
eleventyNavigation:
  key: anti-corruption
  parent: documents
breadcrumb:
  - title: Сведения
    url: /svedenija/
  - title: Документы
    url: /svedenija/documents/
  - title: Противодействие коррупции
---

{% set antiCorruption = collections["anti-corruption-data"][0].data.sections %}
{% include "components/anti-corruption-content.njk" %}
