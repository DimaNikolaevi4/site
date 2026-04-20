---
title: Новости
layout: layouts/page.njk
category: news
tags:
  - Новости
description: Все новости Сальского индустриального техникума
---<div class="category-description">
  <p>Последние события и новости нашего техникума</p>
</div>

<div class="materials-list">
  {% for page in collections.news | reverse %}
    <article class="material-preview">
      <header class="material-preview-header">
        <h2>
          <a href="{{ page.url }}">{{ page.data.title }}</a>
        </h2>
        <time class="material-preview-date" datetime="{{ page.date }}">{{ page.date | date("%d.%m.%Y") }}</time>
      </header>
      
      {% if page.data.description %}
      <p class="material-preview-description">{{ page.data.description }}</p>
      {% endif %}
      
      <a href="{{ page.url }}" class="material-preview-link">Читать далее →</a>
    </article>
  {% endfor %}
</div>
