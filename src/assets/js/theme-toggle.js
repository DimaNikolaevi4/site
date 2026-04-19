/**
 * Переключатель тёмной темы
 * Сохраняет состояние в localStorage
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'dark-theme-enabled';
  const DARK_THEME_CLASS = 'dark-theme';

  /**
   * Включает тёмную тему
   */
  function enableDarkTheme() {
    document.body.classList.add(DARK_THEME_CLASS);
    localStorage.setItem(STORAGE_KEY, 'true');
    updateIconState(true);
  }

  /**
   * Выключает тёмную тему
   */
  function disableDarkTheme() {
    document.body.classList.remove(DARK_THEME_CLASS);
    localStorage.setItem(STORAGE_KEY, 'false');
    updateIconState(false);
  }

  /**
   * Переключает тёмную тему
   * Глобальная функция для вызова из HTML
   */
  window.toggleDarkTheme = function() {
    if (document.body.classList.contains(DARK_THEME_CLASS)) {
      disableDarkTheme();
    } else {
      enableDarkTheme();
    }
  };

  /**
   * Обновляет состояние иконок (если нужно)
   */
  function updateIconState(isDark) {
    // Можно добавить смену иконки moon/sun при необходимости
    const icons = document.querySelectorAll('.bi-moon-stars');
    icons.forEach(function(icon) {
      if (isDark) {
        icon.classList.remove('bi-moon-stars');
        icon.classList.add('bi-sun');
      } else {
        icon.classList.remove('bi-sun');
        icon.classList.add('bi-moon-stars');
      }
    });
  }

  /**
   * Инициализация при загрузке
   */
  function init() {
    const savedState = localStorage.getItem(STORAGE_KEY);
    
    // Проверяем системные настройки, если нет сохранённого состояния
    if (savedState === null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        enableDarkTheme();
      }
    } else if (savedState === 'true') {
      enableDarkTheme();
    }

    // Слушаем изменения системных настроек
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (localStorage.getItem(STORAGE_KEY) === null) {
        if (e.matches) {
          enableDarkTheme();
        } else {
          disableDarkTheme();
        }
      }
    });
  }

  // Запуск после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
