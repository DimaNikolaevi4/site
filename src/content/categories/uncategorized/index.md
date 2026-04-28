---
title: Без рубрики
layout: layouts/page-full.njk
category: uncategorized
rubric: "0"
description: 'Материалы, не вошедшие в основную структуру рубрик'
---

# Без рубрики

<div class="category-description">
  <p>Материалы, которые пока не распределены по основным рубрикам сайта</p>
</div>

<div class="materials-list">
  {% for page in collections.all %}
    {% if page.data.category == 'uncategorized' or (not page.data.category and not page.data.rubric) %}
      {% if page.url != '/uncategorized/' %}
        <article class="material-preview">
          <header class="material-preview-header">
            <h2>
              <a href="{{ page.url }}">{{ page.data.title }}</a>
            </h2>
            {% if page.date %}
            <time class="material-preview-date" datetime="{{ page.date }}">{{ page.date | date("%d.%m.%Y") }}</time>
            {% endif %}
          </header>
          
          {% if page.data.description %}
          <p class="material-preview-description">{{ page.data.description }}</p>
          {% endif %}
          
          <a href="{{ page.url }}" class="read-more" aria-label="Читать полностью — {{ page.data.title }}">
            <span>Читать полностью</span>
            <i class="bi bi-arrow-right" aria-hidden="true"></i>
          </a>
        </article>
      {% endif %}
    {% endif %}
  {% endfor %}
</div>

