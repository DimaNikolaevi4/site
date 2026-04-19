/**
 * Переключатель версии для слабовидящих (высокий контраст)
 * Сохраняет состояние в localStorage
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'a11y-high-contrast-enabled';
  const A11Y_CLASS = 'a11y-high-contrast';

  /**
   * Включает режим высокого контраста
   */
  function enableA11y() {
    document.body.classList.add(A11Y_CLASS);
    localStorage.setItem(STORAGE_KEY, 'true');
  }

  /**
   * Выключает режим высокого контраста
   */
  function disableA11y() {
    document.body.classList.remove(A11Y_CLASS);
    localStorage.setItem(STORAGE_KEY, 'false');
  }

  /**
   * Переключает режим высокого контраста
   * Глобальная функция для вызова из HTML
   */
  window.toggleA11y = function() {
    if (document.body.classList.contains(A11Y_CLASS)) {
      disableA11y();
    } else {
      enableA11y();
    }
  };

  /**
   * Инициализация при загрузке
   */
  function init() {
    const savedState = localStorage.getItem(STORAGE_KEY);
    
    if (savedState === 'true') {
      enableA11y();
    }
  }

  // Запуск после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
