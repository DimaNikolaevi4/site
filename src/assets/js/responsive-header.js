/**
 * Адаптивная шапка с переносом элементов в Offcanvas
 * При ширине 768-991px проверяет, помещаются ли все элементы,
 * и при необходимости перемещает наименее приоритетные в Offcanvas
 */

(function() {
  'use strict';

  // Конфигурация приоритетов (от высокого к низкому)
  const PRIORITY_ORDER = {
    'high': 3,
    'medium': 2,
    'low': 1
  };

  // Элементы DOM
  let headerInner = null;
  let headerDesktop = null;
  let headerIcons = null;
  let offcanvasExtraItems = null;
  let offcanvasExtraList = null;
  let mobileToggleIcon = null;

  // Хранилище для перемещённых элементов
  const movedElements = [];
  const originalPositions = new Map();

  /**
   * Инициализация после загрузки DOM
   */
  function init() {
    headerInner = document.getElementById('headerInner');
    headerDesktop = document.getElementById('headerDesktop');
    headerIcons = document.getElementById('headerIcons');
    offcanvasExtraItems = document.getElementById('offcanvas-extra-items');
    offcanvasExtraList = document.getElementById('offcanvasExtraList');
    mobileToggleIcon = document.getElementById('mobileToggleIcon');

    if (!headerInner || !offcanvasExtraItems) {
      console.warn('ResponsiveHeader: необходимые элементы не найдены');
      return;
    }

    // Сохраняем оригинальные позиции элементов
    saveOriginalPositions();

    // Первичная проверка
    checkAndMoveElements();

    // Проверка при ресайзе с debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkAndMoveElements, 150);
    });

    // Обработка событий Offcanvas для смены иконки гамбургера
    setupOffcanvasEvents();
  }

  /**
   * Сохраняет оригинальные позиции элементов для возможного возврата
   */
  function saveOriginalPositions() {
    if (!headerIcons) return;

    const movableElements = headerIcons.querySelectorAll('[data-priority]');
    movableElements.forEach(function(el) {
      if (!originalPositions.has(el)) {
        originalPositions.set(el, {
          parent: el.parentElement,
          nextSibling: el.nextSibling
        });
      }
    });
  }

  /**
   * Проверяет, помещаются ли все элементы в контейнер
   * и перемещает наименее приоритетные при необходимости
   */
  function checkAndMoveElements() {
    if (!headerInner || !headerDesktop || !headerIcons) return;

    // Сбрасываем все перемещённые элементы обратно
    returnAllElements();

    // Проверяем только на планшетной версии (768-991px)
    const width = window.innerWidth;
    if (width >= 992 || width < 768) {
      hideExtraItemsContainer();
      return;
    }

    // Измеряем доступное пространство
    const containerWidth = headerInner.offsetWidth;
    const logoWidth = headerInner.querySelector('.header__logo').offsetWidth;
    const mobileToggle = headerInner.querySelector('.header__mobile-toggle');
    const mobileToggleWidth = mobileToggle ? mobileToggle.offsetWidth : 0;
    
    const availableWidth = containerWidth - logoWidth - mobileToggleWidth - 40; // 40px запас

    // Измеряем текущую ширину контента
    let contentWidth = headerDesktop.offsetWidth;

    // Если всё помещается — выходим
    if (contentWidth <= availableWidth) {
      hideExtraItemsContainer();
      return;
    }

    // Получаем все перемещаемые элементы с приоритетами
    const movableElements = Array.from(headerIcons.querySelectorAll('[data-priority]'))
      .map(function(el) {
        return {
          element: el,
          priority: PRIORITY_ORDER[el.dataset.priority] || 0,
          width: el.offsetWidth
        };
      })
      .sort(function(a, b) {
        // Сортируем от низкого приоритета к высокому
        return a.priority - b.priority;
      });

    // Перемещаем элементы по одному, пока не станет хватать места
    for (let i = 0; i < movableElements.length; i++) {
      if (contentWidth <= availableWidth) break;

      const item = movableElements[i];
      moveElementToOffcanvas(item.element);
      contentWidth -= item.width + 10; // 10px запас на margin
    }

    showExtraItemsContainer();
  }

  /**
   * Перемещает элемент в Offcanvas панель
   */
  function moveElementToOffcanvas(element) {
    if (!offcanvasExtraList) return;

    // Создаём копию элемента для Offcanvas
    const clone = element.cloneNode(true);
    
    // Добавляем обработчик клика для закрытия Offcanvas
    if (clone.tagName === 'A' || clone.tagName === 'BUTTON') {
      if (!clone.hasAttribute('data-bs-dismiss')) {
        // Для кнопок добавляем обработку через JS
        clone.addEventListener('click', function() {
          const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasMain'));
          if (offcanvas) offcanvas.hide();
        });
      }
    } else {
      // Оборачиваем иконку в ссылку или кнопку
      const wrapper = document.createElement('li');
      wrapper.appendChild(clone);
      
      const clickHandler = function() {
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasMain'));
        if (offcanvas) offcanvas.hide();
      };
      
      clone.addEventListener('click', clickHandler);
    }

    const li = document.createElement('li');
    li.className = 'offcanvas__extra-item py-2 border-bottom';
    
    // Создаём контейнер для содержимого
    const itemContent = document.createElement('div');
    itemContent.className = 'd-flex align-items-center gap-2';
    
    // Клонируем элемент для отображения
    const clonedEl = element.cloneNode(true);
    clonedEl.classList.remove('header__icon-link', 'header__icon-btn');
    clonedEl.classList.add('btn', 'btn-link', 'text-decoration-none', 'p-0');
    clonedEl.style.fontSize = '1.2rem';
    
    // Добавляем текстовое описание
    const label = document.createElement('span');
    label.textContent = getElementLabel(element);
    label.className = 'flex-grow-1 text-start';

    itemContent.appendChild(clonedEl);
    itemContent.appendChild(label);
    li.appendChild(itemContent);

    // Копируем обработчики событий
    copyEventListeners(element, clonedEl);

    // Добавляем обработчик закрытия Offcanvas
    clonedEl.addEventListener('click', function() {
      const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasMain'));
      if (offcanvas) offcanvas.hide();
    });

    offcanvasExtraList.appendChild(li);

    // Скрываем оригинальный элемент
    element.dataset.wasMoved = 'true';
    element.style.display = 'none';

    movedElements.push({
      original: element,
      clone: clonedEl,
      listItem: li
    });
  }

  /**
   * Получает текстовую метку для элемента
   */
  function getElementLabel(element) {
    const ariaLabel = element.getAttribute('aria-label');
    const title = element.getAttribute('title');
    
    if (ariaLabel) return ariaLabel;
    if (title) return title;
    
    // Определяем по иконке
    const icon = element.querySelector('i');
    if (icon) {
      if (icon.classList.contains('bi-envelope')) return 'Email';
      if (icon.classList.contains('bi-vk')) return 'ВКонтакте';
      if (icon.classList.contains('bi-moon-stars')) return 'Тёмная тема';
      if (icon.classList.contains('bi-eye')) return 'Версия для слабовидящих';
      if (icon.classList.contains('bi-search')) return 'Поиск';
      if (icon.classList.contains('bi-grid-3x3-gap-fill')) return 'Все разделы';
    }
    
    return '';
  }

  /**
   * Копирует обработчики событий с одного элемента на другой
   */
  function copyEventListeners(from, to) {
    // Клонируем основные атрибуты
    const attrs = ['href', 'target', 'rel', 'onclick', 'data-bs-toggle', 'data-bs-target'];
    attrs.forEach(function(attr) {
      if (from.hasAttribute(attr)) {
        to.setAttribute(attr, from.getAttribute(attr));
      }
    });
  }

  /**
   * Возвращает все перемещённые элементы обратно в шапку
   */
  function returnAllElements() {
    if (!offcanvasExtraList) return;

    // Очищаем список в Offcanvas
    while (offcanvasExtraList.firstChild) {
      offcanvasExtraList.removeChild(offcanvasExtraList.firstChild);
    }

    // Показываем все скрытые элементы
    const hiddenElements = headerIcons ? headerIcons.querySelectorAll('[data-was-moving="true"]') : [];
    hiddenElements.forEach(function(el) {
      el.style.display = '';
      delete el.dataset.wasMoved;
    });

    // Также показываем элементы с data-was-moving
    const wasMovingElements = headerIcons ? headerIcons.querySelectorAll('[data-was-moving]') : [];
    wasMovingElements.forEach(function(el) {
      el.style.display = '';
      delete el.dataset.wasMoving;
    });

    // Очищаем массив перемещённых
    movedElements.length = 0;
  }

  /**
   * Показывает контейнер для дополнительных элементов
   */
  function showExtraItemsContainer() {
    if (offcanvasExtraItems && offcanvasExtraList && offcanvasExtraList.children.length > 0) {
      offcanvasExtraItems.style.display = 'block';
    }
  }

  /**
   * Скрывает контейнер для дополнительных элементов
   */
  function hideExtraItemsContainer() {
    if (offcanvasExtraItems) {
      offcanvasExtraItems.style.display = 'none';
    }
  }

  /**
   * Настраивает события Offcanvas для смены иконки гамбургера
   */
  function setupOffcanvasEvents() {
    const offcanvasEl = document.getElementById('offcanvasMain');
    if (!offcanvasEl || !mobileToggleIcon) return;

    offcanvasEl.addEventListener('show.bs.offcanvas', function() {
      mobileToggleIcon.classList.remove('bi-list');
      mobileToggleIcon.classList.add('bi-x');
    });

    offcanvasEl.addEventListener('hide.bs.offcanvas', function() {
      mobileToggleIcon.classList.remove('bi-x');
      mobileToggleIcon.classList.add('bi-list');
    });

    // Закрываем Offcanvas при клике на ссылки внутри
    offcanvasEl.querySelectorAll('a[data-bs-dismiss="offcanvas"]').forEach(function(link) {
      link.addEventListener('click', function() {
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offcanvas) offcanvas.hide();
      });
    });
  }

  // Запуск после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
