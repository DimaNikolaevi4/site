/* Validation for forms owned by Site V2. */
(function () {
  "use strict";

  const forms = document.querySelectorAll('.site-form');

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const action = form.getAttribute('action');
      const recaptchaKey = form.getAttribute('data-recaptcha-site-key');
      if (!action) {
        showError(form, 'The form action property is not set!');
        return;
      }

      const loading = form.querySelector('.loading');
      const error = form.querySelector('.error-message');
      const sent = form.querySelector('.sent-message');
      loading?.classList.add('d-block');
      error?.classList.remove('d-block');
      sent?.classList.remove('d-block');

      const data = new FormData(form);
      const submit = () => submitSiteForm(form, action, data);

      if (recaptchaKey && typeof grecaptcha !== 'undefined') {
        grecaptcha.ready(() => {
          grecaptcha.execute(recaptchaKey, { action: 'site_form_submit' })
            .then((token) => {
              data.set('recaptcha-response', token);
              submit();
            })
            .catch((reason) => showError(form, reason));
        });
      } else {
        submit();
      }
    });
  });

  function submitSiteForm(form, action, data) {
    fetch(action, {
      method: 'POST',
      body: data,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.text();
      })
      .then((result) => {
        form.querySelector('.loading')?.classList.remove('d-block');
        if (result.trim() === 'OK') {
          form.querySelector('.sent-message')?.classList.add('d-block');
          form.reset();
        } else {
          throw new Error(result || 'Form submission failed.');
        }
      })
      .catch((reason) => showError(form, reason));
  }

  function showError(form, reason) {
    form.querySelector('.loading')?.classList.remove('d-block');
    const error = form.querySelector('.error-message');
    if (error) {
      error.textContent = reason;
      error.classList.add('d-block');
    }
  }
})();
