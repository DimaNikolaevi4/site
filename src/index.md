---
layout: base.njk
title: Главная
permalink: /
eleventyNavigation:
  key: home
  parent: main
---

<!-- Hero Slider Section -->
<section class="hero-slider">
  <div class="slider-container">
    <div class="slide active" style="background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
      <div class="slide-content">
        <h1>ГБПОУ РО "Сальский индустриальный техникум"</h1>
        <p>Современное образование для успешной карьеры</p>
        <div class="slide-buttons">
          <a href="/svedenija/" class="btn btn-primary">Абитуриенту</a>
          <a href="/content/news/" class="btn btn-outline-light">Новости</a>
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
            <div class="news-card-image" style="background-image: url('https://sit-salsk.ru/wp-content/uploads/2026/02/сити-формат-БПЛА.jpg');">
              <span class="news-date">13 февраля 2026</span>
            </div>
            <div class="news-card-content">
              <h3><a href="#">Победа ZA нами!</a></h3>
              <p>Наши студенты заняли призовые места в региональном конкурсе профессионального мастерства...</p>
              <a href="#" class="read-more">Читать далее →</a>
            </div>
          </article>
          
          <article class="news-card">
            <div class="news-card-image" style="background-color: #667eea;">
              <span class="news-date">12 февраля 2025</span>
            </div>
            <div class="news-card-content">
              <h3><a href="#">День открытых дверей</a></h3>
              <p>Приглашаем будущих студентов и их родителей познакомиться с нашим техникумом...</p>
              <a href="#" class="read-more">Читать далее →</a>
            </div>
          </article>
          
          <article class="news-card">
            <div class="news-card-image" style="background-color: #764ba2;">
              <span class="news-date">30 января 2024</span>
            </div>
            <div class="news-card-content">
              <h3><a href="#">Слово директора</a></h3>
              <p>Обращение директора техникума к абитуриентам и родителям...</p>
              <a href="#" class="read-more">Читать далее →</a>
            </div>
          </article>
          
          <article class="news-card">
            <div class="news-card-image" style="background-color: #A2A2FC;">
              <span class="news-date">14 апреля 2026</span>
            </div>
            <div class="news-card-content">
              <h3><a href="#">Расписание занятий 15 апреля</a></h3>
              <p>Актуальное расписание учебных занятий на завтра...</p>
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
        
        <!-- Banner Widget -->
        <div class="widget banner-widget">
          <a href="https://xn--61-6kc3bbqgrrd.xn--p1ai/bpla.html" target="_blank" rel="noopener">
            <img src="https://sit-salsk.ru/wp-content/uploads/2026/02/сити-формат-БПЛА.jpg" alt="БПЛА">
          </a>
        </div>
        
        <!-- Founder Widget -->
        <div class="widget">
          <h4 class="widget-title">Наш учредитель</h4>
          <a href="https://minobr.donland.ru/" target="_blank" rel="noopener">
            <img src="https://sit-salsk.ru/wp-content/uploads/2025/07/минобразования-2025.jpg" alt="Минобр">
          </a>
        </div>
        
        <!-- Contacts Widget -->
        <div class="widget">
          <h4 class="widget-title">Контакты и график работы</h4>
          <a href="/contacts/">
            <img src="https://sit-salsk.ru/wp-content/uploads/2025/11/Контакты-и-график-работы-2025.jpg" alt="Контакты">
          </a>
        </div>
        
        <!-- Master of Year Widget -->
        <div class="widget">
          <h4 class="widget-title">«Мастер года 2026»</h4>
          <a href="#">
            <img src="https://sit-salsk.ru/wp-content/uploads/2025/02/мастер-года-2025-300x169.jpg" alt="Мастер года">
          </a>
        </div>
        
        <!-- Additional Banners -->
        <div class="widget banner-widget">
          <a href="https://bus.gov.ru/info-card/399429" target="_blank" rel="noopener">
            <img src="https://sit-salsk.ru/wp-content/uploads/2025/03/НОК-2025-1024x576.jpg" alt="НОК">
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
