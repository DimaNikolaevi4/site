console.log("Site loaded");

/**
 * Accessibility settings manager (WCAG 2.1 AA)
 */
(function() {
  'use strict';
  
  const STORAGE_KEY = 'a11y-settings';
  
  // Default settings
  const defaultSettings = {
    enabled: false,
    largeFont: false,
    highContrast: false,
    noAnimations: false
  };
  
  // Load settings from localStorage
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch(e) {
      console.error('Error loading a11y settings:', e);
    }
    return { ...defaultSettings };
  }
  
  // Save settings to localStorage
  function saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch(e) {
      console.error('Error saving a11y settings:', e);
    }
  }
  
  // Apply settings to document
  function applySettings(settings) {
    const html = document.documentElement;
    
    if (settings.enabled) {
      html.classList.add('a11y-enabled');
      html.classList.toggle('a11y-large-font', settings.largeFont);
      html.classList.toggle('a11y-high-contrast', settings.highContrast);
      html.classList.toggle('a11y-no-animations', settings.noAnimations);
    } else {
      html.classList.remove('a11y-enabled', 'a11y-large-font', 'a11y-high-contrast', 'a11y-no-animations');
    }
  }
  
  // Initialize accessibility features
  function init() {
    const toggleBtn = document.getElementById('a11yToggle');
    const panel = document.getElementById('a11yPanel');
    const closeBtn = document.getElementById('a11yClose');
    const resetBtn = document.getElementById('a11yReset');
    const largeFontCheckbox = document.getElementById('a11yLargeFont');
    const highContrastCheckbox = document.getElementById('a11yHighContrast');
    const noAnimationsCheckbox = document.getElementById('a11yNoAnimations');
    
    if (!toggleBtn || !panel) return;
    
    let settings = loadSettings();
    applySettings(settings);
    
    // Sync checkboxes with loaded settings
    if (largeFontCheckbox) largeFontCheckbox.checked = settings.largeFont;
    if (highContrastCheckbox) highContrastCheckbox.checked = settings.highContrast;
    if (noAnimationsCheckbox) noAnimationsCheckbox.checked = settings.noAnimations;
    
    // Toggle button click - open/close panel
    toggleBtn.addEventListener('click', function() {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      panel.hidden = isExpanded;
      
      if (!isExpanded) {
        // Focus on first checkbox when opening
        setTimeout(() => {
          if (largeFontCheckbox) largeFontCheckbox.focus();
        }, 100);
      }
    });
    
    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        toggleBtn.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
        toggleBtn.focus();
      });
    }
    
    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        settings = { ...defaultSettings };
        saveSettings(settings);
        applySettings(settings);
        
        if (largeFontCheckbox) largeFontCheckbox.checked = false;
        if (highContrastCheckbox) highContrastCheckbox.checked = false;
        if (noAnimationsCheckbox) noAnimationsCheckbox.checked = false;
        
        // Announce reset to screen readers
        announceToScreenReader('Настройки доступности сброшены');
      });
    }
    
    // Checkbox change handlers
    if (largeFontCheckbox) {
      largeFontCheckbox.addEventListener('change', function() {
        settings.largeFont = this.checked;
        settings.enabled = true;
        saveSettings(settings);
        applySettings(settings);
      });
    }
    
    if (highContrastCheckbox) {
      highContrastCheckbox.addEventListener('change', function() {
        settings.highContrast = this.checked;
        settings.enabled = true;
        saveSettings(settings);
        applySettings(settings);
      });
    }
    
    if (noAnimationsCheckbox) {
      noAnimationsCheckbox.addEventListener('change', function() {
        settings.noAnimations = this.checked;
        settings.enabled = true;
        saveSettings(settings);
        applySettings(settings);
      });
    }
    
    // Keyboard navigation - close panel on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !panel.hidden) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
        toggleBtn.focus();
      }
    });
    
    // Trap focus within panel when open
    panel.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;
      
      const focusableElements = panel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  }
  
  // Announce message to screen readers
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/**
 * Обработчик формы обратной связи
 */
(function() {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');
  
  // Валидация email
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Валидация файла
  function isValidFile(file) {
    if (!file) return true; // Файл необязателен
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
    const maxSize = 5 * 1024 * 1024; // 5 МБ

    if (file.size > maxSize) {
      return { valid: false, message: 'Файл слишком большой (макс. 5 МБ)' };
    }

    const fileName = file.name.toLowerCase();
    const hasValidExt = allowedExtensions.some(ext => fileName.endsWith(ext));
    if (!hasValidExt) {
      return { valid: false, message: 'Недопустимый тип файла' };
    }

    return { valid: true };
  }

  // Показать ошибку для поля
  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    const formGroup = field.closest('.form-group');
    
    if (errorEl) errorEl.textContent = message;
    if (formGroup) formGroup.classList.add('input-error');
  }

  // Очистить ошибку для поля
  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    const formGroup = field.closest('.form-group');
    
    if (errorEl) errorEl.textContent = '';
    if (formGroup) formGroup.classList.remove('input-error');
  }

  // Очистить все ошибки
  function clearAllErrors() {
    ['name', 'email', 'message', 'attachment'].forEach(clearError);
  }

  // Валидация формы
  function validateForm() {
    let isValid = true;
    clearAllErrors();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const attachment = form.attachment.files[0];

    if (!name) {
      showError('name', 'Введите имя');
      isValid = false;
    }

    if (!email) {
      showError('email', 'Введите email');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError('email', 'Введите корректный email');
      isValid = false;
    }

    if (!message) {
      showError('message', 'Введите сообщение');
      isValid = false;
    }

    if (attachment) {
      const fileCheck = isValidFile(attachment);
      if (!fileCheck.valid) {
        showError('attachment', fileCheck.message);
        isValid = false;
      }
    }

    return isValid;
  }

  // Обработка отправки формы
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) {
      // Фокус на первом поле с ошибкой
      const firstError = form.querySelector('.input-error input, .input-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Блокируем кнопку отправки
    const submitBtn = form.querySelector('.submit-button');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    // Проверка honeypot (защита от спама)
    if (form.honeypot.value) {
      // Тихо игнорируем спам
      statusEl.className = 'form-status success';
      statusEl.textContent = 'Сообщение отправлено!';
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить сообщение';
      return;
    }

    // Отправка формы через Fetch API
    const formData = new FormData(form);

    fetch('/submit-form.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        statusEl.className = 'form-status success';
        statusEl.textContent = data.message || 'Сообщение отправлено! Спасибо за обращение.';
        form.reset();
        // Перенаправление на страницу благодарности через 2 секунды
        setTimeout(() => {
          window.location.href = '/thank-you/';
        }, 2000);
      } else {
        statusEl.className = 'form-status error';
        statusEl.textContent = data.message || 'Ошибка при отправке. Попробуйте позже.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      statusEl.className = 'form-status error';
      statusEl.textContent = 'Ошибка сети. Проверьте подключение к интернету.';
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить сообщение';
    });
  });

  // Валидация полей при вводе
  ['name', 'email', 'message', 'attachment'].forEach(function(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('blur', function() {
        if (fieldId === 'email' && field.value && !isValidEmail(field.value)) {
          showError('email', 'Введите корректный email');
        } else {
          clearError(fieldId);
        }
      });
    }
  });
})();
