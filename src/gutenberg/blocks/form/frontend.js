/**
 * Block Form
 */
const { jQuery: $, grecaptcha, GHOSTKIT, wp } = window;
const { __ } = wp.i18n;

const $doc = $(document);

const errorParentSelector =
  '.ghostkit-form-field-name-first, .ghostkit-form-field-name-last, .ghostkit-form-field-email-primary, .ghostkit-form-field-email-confirm, .ghostkit-form-field';

function showError($field, message) {
  const $parent = $field.closest(errorParentSelector);

  if (!$parent) {
    return;
  }

  let $errorBox = $parent.querySelector('.ghostkit-form-field-error');

  if (!$errorBox) {
    $errorBox = document.createElement('div');
    $errorBox.classList.add('ghostkit-form-field-error');
    $parent.append($errorBox);
  }

  $errorBox.innerHTML = message;
  $errorBox.setAttribute('aria-hidden', false);
  $field.setAttribute('aria-invalid', true);
}

function hideError($field) {
  const $parent = $field.closest(errorParentSelector);
  const $errorBox = $parent.querySelector('.ghostkit-form-field-error');

  if ($errorBox) {
    $errorBox.innerHTML = '';
    $errorBox.setAttribute('aria-hidden', true);
  }

  $field.setAttribute('aria-invalid', false);
}

/**
 * Form validation.
 */
$doc.on('initBlocks.ghostkit', () => {
  document.querySelectorAll('.ghostkit-form:not(.ghostkit-form-ready)').forEach(($form) => {
    $form.classList.add('ghostkit-form-ready');

    // Disable native validation errors.
    $form.setAttribute('novalidate', '');

    // Add event listeners.
    $form.addEventListener('submit', (e) => {
      // Fields validation.
      const isValid = e.target.checkValidity();

      if (!isValid) {
        e.preventDefault();

        e.target.classList.add('ghostkit-form-was-validated');
        e.target.querySelector(':invalid').focus();

        return;
      }

      /// Google reCaptcha.
      if (typeof grecaptcha !== 'undefined') {
        if ($form.classList.contains('ghostkit-form-processed')) {
          return;
        }

        const $recaptchaTokenField = $form.querySelector('[name="ghostkit_form_google_recaptcha"]');

        if (!$recaptchaTokenField) {
          return;
        }

        e.preventDefault();

        if ($form.classList.contains('ghostkit-form-processing')) {
          return;
        }

        $form.classList.add('ghostkit-form-processing');

        // Ensure Recaptcha is loaded.
        grecaptcha.ready(() => {
          grecaptcha
            .execute(GHOSTKIT.googleReCaptchaAPISiteKey, { action: 'ghostkit' })
            .then((token) => {
              $recaptchaTokenField.val(token);

              $form.classList.add('ghostkit-form-processed');

              // After the token is fetched, submit the form.
              $form.submit();

              $form.classList.remove('ghostkit-form-processing', 'ghostkit-form-processed');
            });
        });
      }
    });

    $form.addEventListener('blur', (e) => {
      e.target.checkValidity();
    });

    $form.addEventListener('input', (e) => {
      const field = e.target;
      const valid = field.checkValidity();

      if (valid) {
        hideError(field);
      }
    });

    // Add 'invalid' event listener to all form fields separately
    // since this event does not bubbles.
    const fields = Array.from($form.elements);

    fields.forEach(($field) => {
      let customPatternError = '';

      // Custom Email Confirm validation.
      if ($field.type === 'email' && $field.dataset.confirmEmail) {
        const refEmail = $form.querySelector($field.dataset.confirmEmail);

        if (refEmail) {
          customPatternError = __('These emails should match.', 'ghostkit');

          if (refEmail.getAttribute('required')) {
            $field.setAttribute('required', refEmail.getAttribute('required'));
          }

          refEmail.addEventListener('input', () => {
            if (refEmail.value) {
              $field.setAttribute('pattern', refEmail.value);
              $field.setAttribute('required', true);
            } else {
              $field.removeAttribute('pattern', refEmail.value);

              if (refEmail.getAttribute('required')) {
                $field.setAttribute('required', refEmail.getAttribute('required'));
              } else {
                $field.removeAttribute('required');
              }
            }
          });
        }
      }

      $field.addEventListener('invalid', () => {
        if (customPatternError && $field.validity.patternMismatch) {
          showError($field, customPatternError);
        } else {
          showError($field, $field.validationMessage);
        }
      });
    });
  });
});
