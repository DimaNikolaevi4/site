console.log("Site loaded");

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
