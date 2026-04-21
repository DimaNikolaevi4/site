---
layout: layouts/page.njk
title: Контакты
permalink: /contacts/
eleventyNavigation:
  key: contacts
  parent: main
rubric: "0"
---## Адрес
347900, Ростовская область, г. Сальск, ул. Ленина, 1

## Режим работы
Пн–Пт: 08:00–17:00  
Сб–Вс: выходные

## Форма обратной связи

<form class="contact-form" id="contactForm" action="/submit-form.php" method="POST" enctype="multipart/form-data" novalidate>
  <div class="form-group">
    <label for="name">Имя <span class="required">*</span></label>
    <input 
      type="text" 
      id="name" 
      name="name" 
      required 
      aria-required="true"
      aria-describedby="name-error"
      placeholder="Ваше имя"
      autocomplete="name"
    >
    <span class="error-message" id="name-error" role="alert" aria-live="polite"></span>
  </div>

  <div class="form-group">
    <label for="email">Email <span class="required">*</span></label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      required 
      aria-required="true"
      aria-describedby="email-error"
      placeholder="example@mail.ru"
      autocomplete="email"
    >
    <span class="error-message" id="email-error" role="alert" aria-live="polite"></span>
  </div>

  <div class="form-group">
    <label for="message">Сообщение <span class="required">*</span></label>
    <textarea 
      id="message" 
      name="message" 
      rows="5" 
      required 
      aria-required="true"
      aria-describedby="message-error"
      placeholder="Текст вашего сообщения"
    ></textarea>
    <span class="error-message" id="message-error" role="alert" aria-live="polite"></span>
  </div>

  <div class="form-group">
    <label for="attachment">Прикрепить файл (необязательно)</label>
    <input 
      type="file" 
      id="attachment" 
      name="attachment" 
      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
      aria-describedby="attachment-help"
    >
    <small class="help-text" id="attachment-help">PDF, DOC, DOCX, TXT, JPG, PNG. Макс. 5 МБ</small>
    <span class="error-message" id="attachment-error" role="alert" aria-live="polite"></span>
  </div>

  <div class="form-group form-group-hidden">
    <label for="honeypot">Не заполняйте это поле</label>
    <input type="text" id="honeypot" name="honeypot" tabindex="-1" autocomplete="off">
  </div>

  <button type="submit" class="submit-button">Отправить сообщение</button>
  
  <div class="form-status" id="formStatus" role="status" aria-live="polite"></div>
</form>
