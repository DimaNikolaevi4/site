---
title: Абитуриентам
layout: layouts/page-full.njk
category: abiturientam
description: 'Информация для абитуриентов: правила приема, специальности, день открытых дверей'
---

# Абитуриентам

<div class="category-description">
  <p>Информация для поступающих в Сальский индустриальный техникум</p>
</div>

<div class="materials-list">
  {% for page in collections.all %}
    {% if page.data.category == 'abiturientam' or page.data.tags and page.data.tags.includes("Абитуриентам") %}
      {% if page.url != '/abiturientam/' %}
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
          
          <a href="{{ page.url }}" class="material-preview-link">Читать далее →</a>
        </article>
      {% endif %}
    {% endif %}
  {% endfor %}
</div>
