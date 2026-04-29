---
title: Нашим выпускникам
layout: layouts/page-full.njk
category: vypusknikam
rubric: "9.5"
permalink: /vypusknikam/
description: 'Информация для выпускников техникума'
---

# Нашим выпускникам

<div class="category-description">
  <p>Раздел для выпускников Сальского индустриального техникума</p>
</div>

<div class="materials-list">
  {% for page in collections.all %}
    {% if page.data.category == 'vypusknikam' %}
      {% if page.url != '/vypusknikam/' %}
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

