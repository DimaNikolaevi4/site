---
title: Новости
layout: layouts/page.njk
eleventyExcludeFromCollections: true
---

# Новости

<div class="news-list">
  {% for newsItem in collections.news | reverse %}
    {% include "news-item.njk" %}
  {% endfor %}
</div>
