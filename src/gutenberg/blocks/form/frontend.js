/**
* Block Grid
*/
const {
    jQuery: $,
    grecaptcha,
    GHOSTKIT,
} = window;

const $doc = $( document );

/**
 * Parsley form validation.
 */
$doc.on( 'initBlocks.ghostkit', () => {
    $( '.ghostkit-form:not(.ghostkit-form-ready)' ).each( function() {
        const $form = $( this );

        $form.addClass( 'ghostkit-form-ready' );

        $form.children( 'form' ).parsley( {
            errorsContainer( parsleyField ) {
                const $parent = parsleyField.$element.closest( '.ghostkit-form-field-name-first, .ghostkit-form-field-name-last, .ghostkit-form-field-email-primary, .ghostkit-form-field-email-confirm, .ghostkit-form-field' );

                if ( $parent.length ) {
                    return $parent;
                }

                return parsleyField;
            },
        } );
    } );
} );

/**
 * Parsley custom validations.
 */
window.Parsley.addValidator( 'confirmEmail', {
    requirementType: 'string',
    validateString( value, refOrValue ) {
        const $reference = $( refOrValue );

        if ( $reference.length ) {
            return value === $reference.val();
        }

        return value === refOrValue;
    },
} );

/**
 * Google reCaptcha
 */
if ( 'undefined' !== typeof grecaptcha ) {
    grecaptcha.ready( () => {
        const recaptchaFields = $( '[name="ghostkit_form_google_recaptcha"]' );

        if ( ! recaptchaFields.length ) {
            return;
        }

        recaptchaFields.each( function() {
            const $recaptchaTokenField = $( this );

            grecaptcha.execute( GHOSTKIT.googleReCaptchaAPISiteKey, { action: 'ghostkit' } ).then( ( token ) => {
                $recaptchaTokenField.val( token );
            } );
        } );
    } );
}
