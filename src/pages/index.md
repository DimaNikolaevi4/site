---
layout: layouts/base.njk
title: Главная страница
description: Добро пожаловать на сайт техникума
hero:
  title: Сальский индустриальный техникум
  subtitle: Качественное образование для вашего будущего
  button:
    text: Подать документы
    url: /admission/
features:
  - title: Современные программы
    description: Актуальные специальности и компетенции
    icon: 📚
  - title: Практико-ориентированное обучение
    description: Партнерство с ведущими предприятиями
    icon: 🔧
  - title: Доступная среда
    description: Комфортные условия для всех студентов
    icon: ♿
news_preview: true
---

<!-- Герой-блок -->
<section class="hero" aria-labelledby="hero-title">
  <div class="container hero__container">
    <h1 id="hero-title" class="hero__title">{{ hero.title }}</h1>
    <p class="hero__subtitle">{{ hero.subtitle }}</p>
    <a href="{{ hero.button.url }}" class="btn btn--primary">{{ hero.button.text }}</a>
  </div>
</section>

<!-- Преимущества -->
<section class="features" aria-labelledby="features-title">
  <div class="container">
    <h2 id="features-title" class="section-title">Наши преимущества</h2>
    <div class="features__grid">
      {% for feature in features %}
      <article class="feature-card">
        <div class="feature-card__icon">{{ feature.icon }}</div>
        <h3 class="feature-card__title">{{ feature.title }}</h3>
        <p class="feature-card__description">{{ feature.description }}</p>
      </article>
      {% endfor %}
    </div>
  </div>
</section>

<!-- Новости -->
{% if news_preview %}
<section class="news-preview" aria-labelledby="news-title">
  <div class="container">
    <h2 id="news-title" class="section-title">Последние новости</h2>
    <div class="news-grid">
      {% for post in collections.news | head(3) %}
      <article class="news-card">
        <time class="news-card__date" datetime="{{ post.date }}">{{ post.date | dateRu }}</time>
        <h3 class="news-card__title">
          <a href="{{ post.url }}">{{ post.data.title }}</a>
        </h3>
        <p class="news-card__excerpt">{{ post.data.excerpt or post.templateContent | truncate(150) }}</p>
        <a href="{{ post.url }}" class="news-card__link">Читать далее →</a>
      </article>
      {% endfor %}
    </div>
    <div class="news-preview__all">
      <a href="/news/" class="btn btn--outline">Все новости</a>
    </div>
  </div>
</section>
{% endif %}

<!-- Призыв к действию -->
<section class="cta" aria-labelledby="cta-title">
  <div class="container cta__container">
    <h2 id="cta-title" class="cta__title">Готовы начать обучение?</h2>
    <p class="cta__text">Прием документов уже идет!</p>
    <a href="/admission/" class="btn btn--primary btn--large">Подать документы</a>
  </div>
</section>
