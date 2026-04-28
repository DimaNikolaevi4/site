---
title: Результаты изучения общественного мнения
layout: layouts/page-full.njk
category: obshestvennoe-mnenie
rubric: "9.4"
description: 'Результаты анкетирования, опросов и тестирования общественного мнения'
---

# Результаты изучения общественного мнения

<div class="category-description">
  <p>Анкетирование, опросы, тестирование — результаты изучения общественного мнения в техникуме</p>
</div>

<div class="materials-list">
  {% for page in collections.all %}
    {% if page.data.category == 'obshestvennoe-mnenie' %}
      {% if page.url != '/obshestvennoe-mnenie/' %}
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

