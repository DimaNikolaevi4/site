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