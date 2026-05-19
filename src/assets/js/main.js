// ─── Восстанавливаем настройки a11y на body сразу после загрузки DOM ───
// (classList уже добавлен на <html> inline-скриптом в <head>)
(function () {
  var html = document.documentElement;
  if (html.classList.contains('dark-theme'))        document.body.classList.add('dark-theme');
  if (html.classList.contains('a11y-high-contrast')) document.body.classList.add('a11y-high-contrast');
  if (html.classList.contains('a11y-large-font'))    document.body.classList.add('a11y-large-font');
  if (html.classList.contains('a11y-no-animations')) document.body.classList.add('a11y-no-animations');
})();

// ─── Переключение тёмной темы ───
function updateDarkThemeBtn(enabled) {
  var ids = ['darkThemeToggle', 'darkThemeToggleMobile'];
  ids.forEach(function (id) {
    var btn = document.getElementById(id);
    if (!btn) return;
    var icon = btn.querySelector('i');
    if (icon) {
      icon.className = enabled ? 'bi bi-sun-fill' : 'bi bi-moon-stars';
    }
    btn.setAttribute('aria-label', enabled ? 'Светлая тема' : 'Тёмная / светлая тема');
    btn.setAttribute('title', enabled ? 'Светлая тема' : 'Тёмная тема');
  });
}

window.toggleDarkTheme = function () {
  var enabled = document.body.classList.toggle('dark-theme');
  document.documentElement.classList.toggle('dark-theme', enabled);
  try { localStorage.setItem('sit-dark-theme', enabled ? '1' : '0'); } catch (e) {}
  updateDarkThemeBtn(enabled);
};

// ─── Панель «Версия для слабовидящих» ───
document.addEventListener('DOMContentLoaded', function () {
  // Восстанавливаем иконку кнопки тёмной темы при загрузке
  updateDarkThemeBtn(document.body.classList.contains('dark-theme'));

  var PREFS_KEY = 'sit-a11y-prefs';

  function loadPrefs() {
    try {
      var raw = localStorage.getItem(PREFS_KEY);
      if (raw) return JSON.parse(raw);
      // совместимость со старым ключом sit-a11y
      return { hc: localStorage.getItem('sit-a11y') === '1', lf: false, na: false };
    } catch (e) { return { hc: false, lf: false, na: false }; }
  }

  function savePrefs(prefs) {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) {}
  }

  function applyPrefs(prefs) {
    document.documentElement.classList.toggle('a11y-high-contrast',  prefs.hc);
    document.documentElement.classList.toggle('a11y-large-font',     prefs.lf);
    document.documentElement.classList.toggle('a11y-no-animations',  prefs.na);
    document.body.classList.toggle('a11y-high-contrast',  prefs.hc);
    document.body.classList.toggle('a11y-large-font',     prefs.lf);
    document.body.classList.toggle('a11y-no-animations',  prefs.na);
  }

  var toggle  = document.getElementById('a11yToggle');
  var panel   = document.getElementById('a11yPanel');
  var cbLF    = document.getElementById('a11yLargeFont');
  var cbHC    = document.getElementById('a11yHighContrast');
  var cbNA    = document.getElementById('a11yNoAnimations');
  var btnReset = document.getElementById('a11yReset');
  var btnClose = document.getElementById('a11yClose');

  if (!toggle || !panel) return;

  // Синхронизируем чекбоксы с текущими настройками
  var prefs = loadPrefs();
  applyPrefs(prefs);

  function syncCheckboxes() {
    if (cbLF) cbLF.checked = prefs.lf;
    if (cbHC) cbHC.checked = prefs.hc;
    if (cbNA) cbNA.checked = prefs.na;
  }
  syncCheckboxes();

  var panelJustOpened = false;

  function openPanel() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    panelJustOpened = true;
    setTimeout(function () { panelJustOpened = false; }, 150);
    // Фокус на первый чекбокс
    setTimeout(function () { if (cbLF) cbLF.focus(); }, 60);
  }

  function closePanel() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }

  toggle.addEventListener('click', function () {
    panel.hidden ? openPanel() : closePanel();
  });

  // Мобильная кнопка в partials/header.njk
  var toggleMobile = document.getElementById('a11yToggleMobile');
  if (toggleMobile) {
    toggleMobile.addEventListener('click', function () {
      panel.hidden ? openPanel() : closePanel();
    });
  }

  // Глобальная функция для onclick в components/header.njk (мобильный offcanvas)
  // Панель вынесена на уровень body (position: fixed, z-index: 1100) — открывается поверх offcanvas
  window.toggleA11y = function () {
    panel.hidden ? openPanel() : closePanel();
  };

  if (cbLF) cbLF.addEventListener('change', function () {
    prefs.lf = cbLF.checked;
    applyPrefs(prefs);
    savePrefs(prefs);
  });

  if (cbHC) cbHC.addEventListener('change', function () {
    prefs.hc = cbHC.checked;
    applyPrefs(prefs);
    savePrefs(prefs);
  });

  if (cbNA) cbNA.addEventListener('change', function () {
    prefs.na = cbNA.checked;
    applyPrefs(prefs);
    savePrefs(prefs);
  });

  if (btnReset) btnReset.addEventListener('click', function () {
    prefs = { hc: false, lf: false, na: false };
    applyPrefs(prefs);
    savePrefs(prefs);
    syncCheckboxes();
    try { localStorage.removeItem('sit-a11y'); } catch (e) {}
  });

  if (btnClose) btnClose.addEventListener('click', closePanel);

  // Escape закрывает панель
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
  });

  // Клик вне панели закрывает её
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panelJustOpened && !panel.contains(e.target) &&
        e.target !== toggle && (!toggleMobile || e.target !== toggleMobile)) {
      closePanel();
    }
  });

  // ─── Сжатие шапки + инлайн-поиск ───
  var header = document.getElementById('header');
  if (!header) return;

  var updateHeaderState = function () {
    header.classList.toggle('header--compact', window.scrollY > 24);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  // Кнопка «Наверх»
  var scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    var updateScrollTop = function () {
      scrollTopBtn.classList.toggle('active', window.scrollY > 300);
    };
    updateScrollTop();
    window.addEventListener('scroll', updateScrollTop, { passive: true });
    scrollTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Инлайн-поиск
  var searchToggle = document.getElementById('headerSearchToggle');
  var searchWrap   = document.getElementById('headerSearchWrap');
  var searchInput  = document.getElementById('headerSearchInput');
  var searchClose  = document.getElementById('headerSearchClose');

  if (searchToggle && searchWrap && searchInput) {
    function openSearch() {
      searchWrap.classList.add('is-open');
      searchWrap.setAttribute('aria-hidden', 'false');
      searchToggle.setAttribute('aria-expanded', 'true');
      header.classList.add('header--search-open');
      setTimeout(function () { searchInput.focus(); }, 80);
    }

    function closeSearch() {
      searchWrap.classList.remove('is-open');
      searchWrap.setAttribute('aria-hidden', 'true');
      searchToggle.setAttribute('aria-expanded', 'false');
      header.classList.remove('header--search-open');
      searchInput.value = '';
    }

    searchToggle.addEventListener('click', function () {
      searchWrap.classList.contains('is-open') ? closeSearch() : openSearch();
    });

    if (searchClose) searchClose.addEventListener('click', closeSearch);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchWrap.classList.contains('is-open')) {
        closeSearch();
        searchToggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (
        searchWrap.classList.contains('is-open') &&
        !searchWrap.contains(e.target) &&
        e.target !== searchToggle
      ) {
        closeSearch();
      }
    });
  }

  // ─── Lightbox для контентных изображений (GLightbox) ───
  // Автоматически оборачивает все <img> (не иконки) внутри контентных зон
  // в <a class="glightbox">, чтобы при клике открывалось модальное окно
  // с увеличенным изображением.
  (function initContentLightbox() {
    if (typeof GLightbox === 'undefined') return;

    // Расширения файлов, которые считаются изображениями
    var imgExt = /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)(\?.*)?$/i;

    // Селекторы контентных зон, где изображения нужно увеличивать
    var contentSelectors = [
      '.post-content',      // текст материалов (post.njk)
      '.page-content',      // текст статических страниц (page-full.njk)
      '.post-cover',        // обложка материала (post.njk)
      '.about-img-wrap',    // фото директора (about.njk)
      '.pobeda-banner-link' // баннер «День открытых дверей» (about.njk)
    ];

    // Селекторы исключений — изображения-иконки, логотипы, декоративные
    var excludeSelectors = [
      '[aria-hidden="true"]',
      '.footer-resource-icon',
      '.footer-logo-mark',
      '.oc-header__logo',
      '.bf-22__logo',
      '.card-image',        // карточки — клик ведёт на статью
      '.course-item img',   // карточки новостей/популярное
      '.popular-card__logo-img',
      '.header-logo-img'
    ];

    function isExcluded(img) {
      for (var i = 0; i < excludeSelectors.length; i++) {
        if (img.closest(excludeSelectors[i])) return true;
      }
      return false;
    }

    var lightboxAdded = false;

    document.querySelectorAll(contentSelectors.join(',')).forEach(function (container) {
      container.querySelectorAll('img').forEach(function (img) {
        // Пропускаем иконки и декоративные изображения
        if (isExcluded(img)) return;
        if (img.hasAttribute('aria-hidden')) return;
        // Пропускаем очень маленькие изображения (вероятно, иконки)
        if (img.width > 0 && img.width < 50) return;

        var src = img.getAttribute('src');
        if (!src || src.startsWith('data:')) return;

        var parent = img.parentElement;

        // Если уже внутри <a> тега
        if (parent && parent.tagName === 'A') {
          var href = parent.getAttribute('href') || '';
          // Если ссылка ведёт на изображение — превращаем в lightbox
          if (imgExt.test(href)) {
            parent.classList.add('glightbox');
            var alt = img.getAttribute('alt') || '';
            if (alt) {
              parent.setAttribute('data-glightbox', 'title=' + alt);
            }
            lightboxAdded = true;
          }
          // Если ссылка ведёт на другую страницу — оставляем навигацию
          return;
        }

        // Если внутри <picture> — обрабатываем только сам <picture>
        if (parent && parent.tagName === 'PICTURE') {
          var pictureParent = parent.parentElement;
          if (pictureParent && pictureParent.tagName === 'A') {
            var phref = pictureParent.getAttribute('href') || '';
            if (imgExt.test(phref)) {
              pictureParent.classList.add('glightbox');
              var palt = img.getAttribute('alt') || '';
              if (palt) {
                pictureParent.setAttribute('data-glightbox', 'title=' + palt);
              }
              lightboxAdded = true;
            }
            return;
          }
          // Оборачиваем <picture> в <a class="glightbox">
          var a = document.createElement('a');
          a.href = src;
          a.classList.add('glightbox');
          var pictAlt = img.getAttribute('alt') || '';
          if (pictAlt) {
            a.setAttribute('data-glightbox', 'title=' + pictAlt);
          }
          parent.parentNode.insertBefore(a, parent);
          a.appendChild(parent);
          lightboxAdded = true;
          return;
        }

        // Одиночное изображение — оборачиваем в <a class="glightbox">
        var wrap = document.createElement('a');
        wrap.href = src;
        wrap.classList.add('glightbox');
        var imgAlt = img.getAttribute('alt') || '';
        if (imgAlt) {
          wrap.setAttribute('data-glightbox', 'title=' + imgAlt);
        }
        img.parentNode.insertBefore(wrap, img);
        wrap.appendChild(img);
        lightboxAdded = true;
      });
    });

    // Инициализируем GLightbox для новых элементов
    if (lightboxAdded) {
      GLightbox({ selector: '.glightbox' });
    }
  })();

  // ─── Math-CAPTCHA для форм обратной связи ───
  document.querySelectorAll('form[data-honeypot]').forEach(function (form) {
    var captchaWrap  = form.querySelector('[data-captcha]');
    if (!captchaWrap) return;
    var questionEl   = captchaWrap.querySelector('.captcha-question');
    var answerInput  = captchaWrap.querySelector('input[name="captcha_answer"]');
    if (!questionEl || !answerInput) return;

    function regenerate() {
      var a = Math.floor(Math.random() * 9) + 1;
      var b = Math.floor(Math.random() * 9) + 1;
      questionEl.textContent = a + ' + ' + b + ' =';
      captchaWrap.dataset.expected = String(a + b);
      answerInput.value = '';
      answerInput.setCustomValidity('');
    }
    regenerate();

    answerInput.addEventListener('input', function () {
      answerInput.setCustomValidity('');
    });

    form.addEventListener('submit', function (e) {
      var expected = captchaWrap.dataset.expected;
      var got = answerInput.value.trim();
      if (got !== expected) {
        e.preventDefault();
        answerInput.setCustomValidity('Неверный ответ — пересчитайте, пожалуйста');
        answerInput.reportValidity();
        regenerate();
      }
    });
  });
});
