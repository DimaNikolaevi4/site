/**
 * Header functionality for SIT website
 * - Rubric selector navigation
 * - Accessibility toggle (sync between desktop and mobile buttons)
 * - Mobile menu auto-close on link click
 */

(function() {
  'use strict';

  // === Рубрикатор (select → переход по ссылке) ===
  const rubricSelect = document.getElementById('rubricSelect');
  if (rubricSelect) {
    rubricSelect.addEventListener('change', function(e) {
      const url = e.target.value;
      if (url && url !== '#') {
        window.location.href = url;
      }
    });
  }

  // === Версия для слабовидящих ===
  const STORAGE_KEY = 'sit-a11y-prefs';
  let a11yState = { contrast: false, largeFont: false, noAnimation: false };

  // Load saved preferences
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      a11yState = { ...a11yState, ...JSON.parse(saved) };
    }
  } catch(e) {
    console.warn('Could not load a11y preferences:', e);
  }

  // Apply accessibility state to document
  function applyA11yState() {
    const body = document.body;
    body.classList.remove('a11y-high-contrast', 'a11y-large-font', 'a11y-no-animation');
    
    if (a11yState.contrast) body.classList.add('a11y-high-contrast');
    if (a11yState.largeFont) body.classList.add('a11y-large-font');
    if (a11yState.noAnimation) body.classList.add('a11y-no-animation');
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(a11yState));
    } catch(e) {
      console.warn('Could not save a11y preferences:', e);
    }
    
    // Update aria-labels for all toggle buttons
    updateA11yLabels();
  }

  // Update aria-label for accessibility toggle buttons
  function updateA11yLabels() {
    const statusParts = [];
    if (a11yState.contrast) statusParts.push('контраст');
    if (a11yState.largeFont) statusParts.push('крупный шрифт');
    if (a11yState.noAnimation) statusParts.push('без анимации');
    
    const statusText = statusParts.length > 0 ? ' (' + statusParts.join(', ') + ')' : '';
    const label = 'Версия для слабовидящих' + statusText;
    
    // Update all a11y toggle buttons
    document.querySelectorAll('.a11y-toggle-btn, #a11yToggle, #a11yToggleHeader, #a11yToggleMobile').forEach(function(btn) {
      btn.setAttribute('aria-label', label);
    });
  }

  // Toggle accessibility state (cycle through states)
  function toggleA11yState() {
    if (!a11yState.contrast && !a11yState.largeFont && !a11yState.noAnimation) {
      // First click: enable high contrast
      a11yState.contrast = true;
    } else if (a11yState.contrast && !a11yState.largeFont) {
      // Second click: add large font
      a11yState.largeFont = true;
    } else if (a11yState.contrast && a11yState.largeFont && !a11yState.noAnimation) {
      // Third click: disable animations
      a11yState.noAnimation = true;
    } else {
      // Fourth click: reset all
      a11yState.contrast = false;
      a11yState.largeFont = false;
      a11yState.noAnimation = false;
    }
    applyA11yState();
  }

  // Initialize accessibility toggles
  function initA11yToggles() {
    // Collect all toggle buttons (header desktop, header mobile, and base.njk button)
    const toggleButtons = Array.from(document.querySelectorAll(
      '.a11y-toggle-btn, #a11yToggle, #a11yToggleHeader, #a11yToggleMobile'
    ));

    toggleButtons.forEach(function(btn) {
      btn.addEventListener('click', toggleA11yState);
    });

    // Apply initial state
    applyA11yState();
  }

  initA11yToggles();

  // === Закрытие мобильного меню при клике на ссылку ===
  const navbarCollapse = document.getElementById('navbarMain');
  if (navbarCollapse) {
    const navLinks = navbarCollapse.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
    
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        // Check if we're in mobile view (< 992px)
        if (window.innerWidth < 992) {
          // Get Bootstrap Collapse instance and hide
          const collapseInstance = bootstrap.Collapse.getInstance(navbarCollapse);
          if (collapseInstance) {
            collapseInstance.hide();
          }
        }
      });
    });
  }

})();
