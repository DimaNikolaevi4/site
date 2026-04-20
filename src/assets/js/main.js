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
window.toggleDarkTheme = function () {
  var enabled = document.body.classList.toggle('dark-theme');
  document.documentElement.classList.toggle('dark-theme', enabled);
  try { localStorage.setItem('sit-dark-theme', enabled ? '1' : '0'); } catch (e) {}
};

// ─── Панель «Версия для слабовидящих» ───
document.addEventListener('DOMContentLoaded', function () {

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
  window.toggleA11y = function () {
    var ocEl = document.getElementById('offcanvasRubrics');
    if (ocEl && ocEl.classList.contains('show')) {
      var bsOc = typeof bootstrap !== 'undefined'
        ? bootstrap.Offcanvas.getInstance(ocEl)
        : null;
      if (bsOc) {
        bsOc.hide();
        setTimeout(function () {
          panel.hidden ? openPanel() : closePanel();
        }, 320);
        return;
      }
    }
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
});
