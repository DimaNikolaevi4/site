/*
 * Инициализация внешних UI-компонентов сайта.
 * Компоненты запускаются только при наличии соответствующей библиотеки
 * и поэтому безопасны для страниц, где они не используются.
 */
(function () {
  'use strict';

  function initAOS() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  function initPureCounter() {
    if (typeof PureCounter === 'undefined') return;
    new PureCounter();
  }

  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll('.init-swiper').forEach(function (swiperElement) {
      var configElement = swiperElement.querySelector('.swiper-config');
      if (!configElement) return;

      try {
        var config = JSON.parse(configElement.textContent.trim());
        new Swiper(swiperElement, config);
      } catch (error) {
        console.warn('Не удалось инициализировать Swiper:', error);
      }
    });
  }

  window.addEventListener('load', function () {
    initAOS();
    initPureCounter();
    initSwiper();
  });
})();
