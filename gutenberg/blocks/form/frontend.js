/**
 * Block Form
 */
const {
	grecaptcha,
	GHOSTKIT: { googleReCaptchaAPISiteKey, events },
} = window;

import { __ } from '@wordpress/i18n';

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
events.on(document, 'init.blocks.gkt', () => {
	document
		.querySelectorAll('form.ghostkit-form:not(.ghostkit-form-ready)')
		.forEach(($form) => {
			$form.classList.add('ghostkit-form-ready');

			// Disable native validation errors.
			$form.setAttribute('novalidate', '');

			// Add 'invalid' event listener to all form fields separately
			// since this event does not bubbles.
			const fields = Array.from($form.elements);

			fields.forEach(($field) => {
				let customPatternError = '';

				// Custom Email Confirm validation.
				if ($field.type === 'email' && $field.dataset.confirmEmail) {
					const refEmail = $form.querySelector(
						$field.dataset.confirmEmail
					);

					if (refEmail) {
						customPatternError = __(
							'These emails should match.',
							'ghostkit'
						);

						if (refEmail.getAttribute('required')) {
							$field.setAttribute(
								'required',
								refEmail.getAttribute('required')
							);
						}

						events.on(refEmail, 'input', () => {
							if (refEmail.value) {
								$field.setAttribute('pattern', refEmail.value);
								$field.setAttribute('required', true);
							} else {
								$field.removeAttribute(
									'pattern',
									refEmail.value
								);

								if (refEmail.getAttribute('required')) {
									$field.setAttribute(
										'required',
										refEmail.getAttribute('required')
									);
								} else {
									$field.removeAttribute('required');
								}
							}
						});
					}
				}

				events.on($field, 'invalid', () => {
					if (customPatternError && $field.validity.patternMismatch) {
						showError($field, customPatternError);
					} else {
						showError($field, $field.validationMessage);
					}
				});
			});
		});
});

// Add event listeners.
events.on(document, 'submit', '.ghostkit-form', (e) => {
	const $form = e.delegateTarget;

	// Fields validation.
	const isValid = $form.checkValidity();

	if (!isValid) {
		e.preventDefault();

		$form.classList.add('ghostkit-form-was-validated');
		$form.querySelector(':invalid').focus();

		return;
	}

	/// Google reCaptcha.
	if (typeof grecaptcha !== 'undefined') {
		if ($form.classList.contains('ghostkit-form-processed')) {
			return;
		}

		const $recaptchaTokenField = $form.querySelector(
			'[name="ghostkit_form_google_recaptcha"]'
		);

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
				.execute(googleReCaptchaAPISiteKey, { action: 'ghostkit' })
				.then((token) => {
					$recaptchaTokenField.value = token;

					$form.classList.add('ghostkit-form-processed');

					// After the token is fetched, submit the form.
					$form.submit();

					$form.classList.remove(
						'ghostkit-form-processing',
						'ghostkit-form-processed'
					);
				});
		});
	}
});

// Check validity on blur only for forms that were submitted and are invalid.
events.on(document, 'blur', '.ghostkit-form-was-validated', (e) => {
	e.target.checkValidity();
});

events.on(document, 'input', '.ghostkit-form', (e) => {
	const $field = e.target;
	const valid = $field.checkValidity();

	if (valid) {
		hideError($field);
	}
});
