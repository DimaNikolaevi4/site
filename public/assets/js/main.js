// ─── Применяем сохранённые настройки на body сразу после загрузки DOM ───
// (classList уже добавлен на <html> inline-скриптом в <head>)
(function () {
  var html = document.documentElement;
  if (html.classList.contains('dark-theme'))        document.body.classList.add('dark-theme');
  if (html.classList.contains('a11y-high-contrast')) document.body.classList.add('a11y-high-contrast');
})();

// ─── Переключение версии для слабовидящих ───
window.toggleA11y = function () {
  var enabled = document.body.classList.toggle('a11y-high-contrast');
  document.documentElement.classList.toggle('a11y-high-contrast', enabled);
  try { localStorage.setItem('sit-a11y', enabled ? '1' : '0'); } catch (e) {}
};

// ─── Переключение тёмной темы ───
window.toggleDarkTheme = function () {
  var enabled = document.body.classList.toggle('dark-theme');
  document.documentElement.classList.toggle('dark-theme', enabled);
  try { localStorage.setItem('sit-dark-theme', enabled ? '1' : '0'); } catch (e) {}
};

// ─── Сжатие шапки + инлайн-поиск ───
document.addEventListener('DOMContentLoaded', function () {
  var header = document.getElementById('header');
  if (!header) return;

  // Сжатие шапки при скролле
  var updateHeaderState = function () {
    header.classList.toggle('header--compact', window.scrollY > 24);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

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
