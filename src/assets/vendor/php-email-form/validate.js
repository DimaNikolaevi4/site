/**
* PHP Email Form Validation - JS Library
* Returns true if the form is valid, otherwise false.
* Uses: https://formvalidation.io/
*/
(function() {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.querySelector('.recaptcha-container');
      
      if( !action ) {
        displayError(thisForm, 'Форма не имеет атрибута action!');
        return;
      }

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );
      formData.append('_format', 'email');

      fetch (action, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      }).then(data => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.trim() == 'OK') {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          displayError(thisForm, data);
        }
      }).catch((error) => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        displayError(thisForm, 'Ошибка отправки формы. Попробуйте позже.');
        console.error('Error:', error);
      });
    }, false);
  })

  function displayError(thisForm, error) {
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
