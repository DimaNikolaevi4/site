// Основной JS файл сайта

// Функции доступности и переключения темы с защитой от ошибок
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
});