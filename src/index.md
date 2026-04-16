---
layout: base.njk
title: Главная
permalink: /
fullWidth: true
eleventyNavigation:
  key: home
  parent: main
---

<!-- Hero Slider Section -->
<section class="hero-slider">
  <div class="slider-container">
    <div class="slide active" style="background-image: linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%), url('/images/sliders/slider1.jpg'); background-size: cover; background-position: center;">
      <div class="slide-content">
        <h1>ГБПОУ РО "Сальский индустриальный техникум"</h1>
        <p>Современное образование для успешной карьеры</p>
        <div class="slide-buttons">
          <a href="/svedenija/" class="btn btn-primary">Абитуриенту</a>
          <a href="/content/news/" class="btn btn-outline-light">Новости</a>
        </div>
      </div>
    </div>
    <div class="slide" style="background-image: linear-gradient(135deg, rgba(13, 74, 107, 0.85) 0%, rgba(26, 95, 138, 0.85) 100%), url('/images/sliders/slider2.jpg'); background-size: cover; background-position: center;">
      <div class="slide-content">
        <h1>Профессиональное образование</h1>
        <p>Подготовка квалифицированных специалистов</p>
        <div class="slide-buttons">
          <a href="/svedenija/education/" class="btn btn-primary">Специальности</a>
          <a href="/svedenija/" class="btn btn-outline-light">Приёмная кампания</a>
        </div>
      </div>
    </div>
    <div class="slide" style="background-image: linear-gradient(135deg, rgba(92, 107, 192, 0.85) 0%, rgba(63, 81, 181, 0.85) 100%), url('/images/sliders/slider3.jpg'); background-size: cover; background-position: center;">
      <div class="slide-content">
        <h1>Доступная среда</h1>
        <p>Комфортные условия для всех студентов</p>
        <div class="slide-buttons">
          <a href="/svedenija/access/" class="btn btn-primary">Узнать больше</a>
        </div>
      </div>
    </div>
  </div>
  <div class="slider-controls">
    <button class="slider-prev" aria-label="Предыдущий слайд">‹</button>
    <button class="slider-next" aria-label="Следующий слайд">›</button>
  </div>
  <div class="slider-dots"></div>
</section>

<!-- Important Info Cards -->
<section class="info-cards-section">
  <div class="container">
    <div class="info-cards-grid">
      <a href="/svedenija/documents/" class="info-card">
        <div class="info-card-icon">📄</div>
        <h3>Документы</h3>
        <p>Устав, лицензии, аккредитации</p>
      </a>
      <a href="/svedenija/education/" class="info-card">
        <div class="info-card-icon">📚</div>
        <h3>Образование</h3>
        <p>Специальности и программы</p>
      </a>
      <a href="/svedenija/vacancies/" class="info-card">
        <div class="info-card-icon">💼</div>
        <h3>Вакансии</h3>
        <p>Работа в техникуме</p>
      </a>
      <a href="/contacts/" class="info-card">
        <div class="info-card-icon">📞</div>
        <h3>Контакты</h3>
        <p>График работы и связь</p>
      </a>
    </div>
  </div>
</section>

<!-- Main Content with Sidebar -->
<section class="main-content-section">
  <div class="container">
    <div class="content-layout">
      <!-- News Feed -->
      <div class="news-feed">
        <h2 class="section-title">Новости и события</h2>
        <div class="news-grid">
          <article class="news-card featured">
            <div class="news-card-image" style="background-image: url('/images/news/news1.jpg'); background-size: cover; background-position: center;">
              <span class="news-date">14 апреля 2026</span>
            </div>
            <div class="news-card-content">
              <h3><a href="#">Всероссийский урок «Мир России»</a></h3>
              <p>Студенты техникума приняли участие во Всероссийском уроке, посвященном героям специальной военной операции...</p>
              <a href="#" class="read-more">Читать далее →</a>
            </div>
          </article>
          
          <article class="news-card">
            <div class="news-card-image" style="background-image: url('/images/news/news2.jpg'); background-size: cover; background-position: center;">
              <span class="news-date">12 апреля 2026</span>
            </div>
            <div class="news-card-content">
              <h3><a href="#">День космонавтики в техникуме</a></h3>
              <p>Тематические мероприятия, посвященные Дню космонавтики, прошли во всех группах...</p>
              <a href="#" class="read-more">Читать далее →</a>
            </div>
          </article>
          
          <article class="news-card">
            <div class="news-card-image" style="background-image: url('/images/news/news3.jpg'); background-size: cover; background-position: center;">
              <span class="news-date">8 апреля 2026</span>
            </div>
            <div class="news-card-content">
              <h3><a href="#">Конкурс профессионального мастерства</a></h3>
              <p>Наши студенты показали отличные результаты в региональном этапе конкурса WorldSkills...</p>
              <a href="#" class="read-more">Читать далее →</a>
            </div>
          </article>
          
          <article class="news-card">
            <div class="news-card-image" style="background-image: url('/images/news/news4.jpg'); background-size: cover; background-position: center;">
              <span class="news-date">8 марта 2026</span>
            </div>
            <div class="news-card-content">
              <h3><a href="#">Праздничный концерт к 8 Марта</a></h3>
              <p>Творческие коллективы техникума поздравили женщин с международным женским днем...</p>
              <a href="#" class="read-more">Читать далее →</a>
            </div>
          </article>
        </div>
        <div class="news-all">
          <a href="/content/news/" class="btn btn-secondary">Все новости</a>
        </div>
      </div>
      
      <!-- Sidebar -->
      <aside class="sidebar">
        <!-- Search Widget -->
        <div class="widget search-widget">
          <form class="search-form" action="/search/" method="get">
            <input type="search" placeholder="Поиск по сайту..." name="q">
            <button type="submit">🔍</button>
          </form>
        </div>
        
        <!-- Banner Widget BPLA -->
        <div class="widget banner-widget">
          <a href="https://xn--61-6kc3bbqgrrd.xn--p1ai/bpla.html" target="_blank" rel="noopener">
            <img src="/images/banners/bpla.jpg" alt="БПЛА">
          </a>
        </div>
        
        <!-- Banner Widget NOK -->
        <div class="widget banner-widget">
          <a href="https://bus.gov.ru/info-card/399429" target="_blank" rel="noopener">
            <img src="/images/banners/nok-2025.jpg" alt="НОК">
          </a>
        </div>
        
        <!-- Founder Widget -->
        <div class="widget">
          <h4 class="widget-title">Наш учредитель</h4>
          <a href="https://minobr.donland.ru/" target="_blank" rel="noopener">
            <img src="/images/logos/nf-2025.png" alt="Минобр">
          </a>
        </div>
        
        <!-- Master of Year Widget -->
        <div class="widget">
          <h4 class="widget-title">«Мастер года 2026»</h4>
          <a href="#">
            <img src="/images/banners/master-goda.jpg" alt="Мастер года">
          </a>
        </div>
        
        <!-- Poll Widget -->
        <div class="widget poll-widget">
          <h4 class="widget-title">Опрос</h4>
          <div class="poll-content">
            <p>Как вы оцениваете качество образования в техникуме?</p>
            <form class="poll-form">
              <label><input type="radio" name="poll" value="excellent"> Отлично</label>
              <label><input type="radio" name="poll" value="good"> Хорошо</label>
              <label><input type="radio" name="poll" value="satisfactory"> Удовлетворительно</label>
              <label><input type="radio" name="poll" value="poor"> Плохо</label>
              <button type="submit" class="btn btn-sm btn-primary">Голосовать</button>
            </form>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>

<!-- Quick Access Section -->
<section class="quick-access-section">
  <div class="container">
    <h2 class="section-title">Быстрый доступ</h2>
    <div class="quick-access-grid">
      <a href="/svedenija/" class="quick-access-item">
        <span class="icon">🎓</span>
        <span>Абитуриенту</span>
      </a>
      <a href="/svedenija/structure/" class="quick-access-item">
        <span class="icon">🏛️</span>
        <span>Структура</span>
      </a>
      <a href="/svedenija/access/" class="quick-access-item">
        <span class="icon">♿</span>
        <span>Доступная среда</span>
      </a>
      <a href="/svedenija/international/" class="quick-access-item">
        <span class="icon">🌍</span>
        <span>Международная деятельность</span>
      </a>
      <a href="/content/documents/ustav/" class="quick-access-item">
        <span class="icon">📋</span>
        <span>Устав</span>
      </a>
      <a href="/svedenija/finance/" class="quick-access-item">
        <span class="icon">💰</span>
        <span>Финансы</span>
      </a>
    </div>
  </div>
</section>
