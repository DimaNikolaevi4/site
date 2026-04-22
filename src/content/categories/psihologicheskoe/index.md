---
title: Психологическое сопровождение образовательного процесса
layout: layouts/page-full.njk
category: psihologicheskoe
rubric: "6"
description: 'Психологическое сопровождение: тестирования, советы преподавателям, родителям, студентам, профилактика'
---

# Психологическое сопровождение образовательного процесса

<div class="category-description">
  <p>Раздел посвящен работе педагога-психолога в техникуме</p>
</div>

<div class="rubrics-list">
  <h2>Подразделы:</h2>
  <ul>
    <li><a href="/psihologicheskoe/organizacionno-metodicheskaya/">6.1. Организационно-методическая и правовая основа</a></li>
    <li><a href="/psihologicheskoe/rezultaty-testirovanij/">6.2. Результаты психологических тестирований</a></li>
    <li><a href="/psihologicheskoe/sovety-prepodavatelyam/">6.3. Советы психолога — преподавателям</a></li>
    <li><a href="/psihologicheskoe/sovety-roditelyam/">6.4. Советы психолога — родителям</a></li>
    <li><a href="/psihologicheskoe/sovety-studentam/">6.5. Советы психолога — студентам</a></li>
    <li><a href="/psihologicheskoe/profilaktika-narkotikov/">6.6. Профилактика незаконного употребления наркотиков</a></li>
    <li><a href="/psihologicheskoe/podderzhka-ovz/">6.7. Психологическая поддержка лиц с ОВЗ и инвалидов</a></li>
  </ul>
</div>

<div class="materials-list">
  {% for page in collections.all %}
    {% if page.data.category == 'psihologicheskoe' %}
      {% if page.url != '/psihologicheskoe/' %}
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

