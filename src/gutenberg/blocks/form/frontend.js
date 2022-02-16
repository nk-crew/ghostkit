/**
 * Block Grid
 */
const { jQuery: $, grecaptcha, GHOSTKIT } = window;

const $doc = $(document);

/**
 * Parsley form validation.
 */
$doc.on('initBlocks.ghostkit', () => {
  $('.ghostkit-form:not(.ghostkit-form-ready)').each(function () {
    const $form = $(this);

    $form.addClass('ghostkit-form-ready');

    $form.children('form').parsley({
      errorsContainer(parsleyField) {
        const $parent = parsleyField.$element.closest(
          '.ghostkit-form-field-name-first, .ghostkit-form-field-name-last, .ghostkit-form-field-email-primary, .ghostkit-form-field-email-confirm, .ghostkit-form-field'
        );

        if ($parent.length) {
          return $parent;
        }

        return parsleyField;
      },
    });
  });
});

/**
 * Parsley custom validations.
 */
window.Parsley.addValidator('confirmEmail', {
  requirementType: 'string',
  validateString(value, refOrValue) {
    const $reference = $(refOrValue);

    if ($reference.length) {
      return value === $reference.val();
    }

    return value === refOrValue;
  },
});

/**
 * Google reCaptcha
 */
if ('undefined' !== typeof grecaptcha) {
  $doc.on('submit', '.ghostkit-form form:not(.ghostkit-form-processed)', function (e) {
    const $form = $(this);
    const $recaptchaTokenField = $form.find('[name="ghostkit_form_google_recaptcha"]');

    if (!$recaptchaTokenField.length) {
      return;
    }

    e.preventDefault();

    if ($form.hasClass('ghostkit-form-processing')) {
      return;
    }

    $form.addClass('ghostkit-form-processing');

    // Ensure Recaptcha is loaded.
    grecaptcha.ready(() => {
      grecaptcha
        .execute(GHOSTKIT.googleReCaptchaAPISiteKey, { action: 'ghostkit' })
        .then((token) => {
          $recaptchaTokenField.val(token);

          $form.addClass('ghostkit-form-processed');

          // After the token is fetched, submit the form.
          $form[0].submit();

          $form.removeClass('ghostkit-form-processing');
          $form.removeClass('ghostkit-form-processed');
        });
    });
  });
}
