/**
 * Header functionality for SIT website
 * - Rubric selector navigation
 * - Mobile menu auto-close on link click
 *
 * Note: Accessibility toggle (a11y) is handled by main.js
 */

(function() {
  'use strict';

  // === Рубрикатор (select → переход по ссылке) ===
  var rubricSelect = document.getElementById('rubricSelect');
  if (rubricSelect) {
    rubricSelect.addEventListener('change', function(e) {
      var url = e.target.value;
      if (url && url !== '#') {
        window.location.href = url;
      }
    });
  }

  // === Закрытие мобильного меню при клике на ссылку ===
  var navbarCollapse = document.getElementById('navbarMain');
  if (navbarCollapse) {
    var navLinks = navbarCollapse.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth < 992) {
          var collapseInstance = bootstrap.Collapse.getInstance(navbarCollapse);
          if (collapseInstance) {
            collapseInstance.hide();
          }
        }
      });
    });
  }

})();
