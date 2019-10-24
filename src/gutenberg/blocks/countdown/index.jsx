/**
 * Import CSS
 */
import './style.scss';
import './editor.scss';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
    ...metadata,
    title: __( 'Countdown', '@@text_domain' ),
    description: __( 'Countdown timer for upcoming event.', '@@text_domain' ),
    icon: getIcon( 'block-countdown', true ),
    keywords: [
        __( 'timer', '@@text_domain' ),
        __( 'count', '@@text_domain' ),
        __( 'number', '@@text_domain' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/countdown/',
        customStylesCallback( attributes ) {
            const styles = {
                '.ghostkit-countdown-unit-number': {
                    fontSize: attributes.numberFontSize,
                    color: attributes.numberColor,
                },
                '.ghostkit-countdown-unit-label': {
                    fontSize: attributes.labelFontSize,
                    color: attributes.labelColor,
                },
            };

            return styles;
        },
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
            customCSS: true,
        },
    },
    example: {
        attributes: {
            units: [ 'hours', 'minutes', 'seconds' ],
            unitsAlign: 'center',
            ghostkitId: 'example-countdown',
            ghostkitClassname: 'ghostkit-custom-example-countdown',
            className: 'ghostkit-custom-example-countdown',
        },
    },
    edit,
    save,
};
