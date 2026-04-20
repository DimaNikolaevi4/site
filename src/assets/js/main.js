window.toggleA11y = function() {
  if (document.body) {
    document.body.classList.toggle('a11y-high-contrast');
  }
};

window.toggleDarkTheme = function() {
  if (document.body) {
    document.body.classList.toggle('dark-theme');
  }
};

document.addEventListener('DOMContentLoaded', function() {
  var header = document.getElementById('header');
  if (!header) return;

  var updateHeaderState = function() {
    header.classList.toggle('header--compact', window.scrollY > 24);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

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
      if (searchWrap.classList.contains('is-open')) {
        closeSearch();
      } else {
        openSearch();
      }
    });

    if (searchClose) {
      searchClose.addEventListener('click', closeSearch);
    }

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
