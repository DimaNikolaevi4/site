---
layout: base.njk
title: Документы
permalink: /documents/
eleventyNavigation:
  key: documents
  parent: main
rubric: "0"
---
# Документы

Здесь вы можете найти и скачать официальные документы техникума.

{% if collections.documents %}
<ul class="documents-list">
  {% for doc in collections.documents | reverse %}
  <li class="documents-item">
    <span class="documents-icon" aria-hidden="true">📄</span>
    <div class="documents-info">
      <h3 class="documents-title">{{ doc.data.title }}</h3>
      <p class="documents-meta">
        {% if doc.data.date %}{{ doc.data.date | date("%d.%m.%Y") }}{% endif %}
        {% if doc.data.fileType %} · {{ doc.data.fileType | upcase }}{% endif %}
        {% if doc.data.fileSize %} · {{ doc.data.fileSize }}{% endif %}
      </p>
    </div>
    <a href="{{ doc.data.fileUrl }}" class="documents-download" download>
      Скачать
    </a>
  </li>
  {% endfor %}
</ul>
{% else %}
<p>Документы пока не загружены.</p>
{% endif %}
