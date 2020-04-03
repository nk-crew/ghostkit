/**
 * Internal dependencies
 */
import save from './save';
import metadata from './block.json';

export default [
    // v2.10.2
    {
        ...metadata,
        ghostkit: {
            customStylesCallback( attributes ) {
                const styles = {
                    '--gkt-countdown--unit-number__font-size': attributes.numberFontSize ? `${ attributes.numberFontSize }px` : false,
                    '--gkt-countdown--unit-number__color': attributes.numberColor,
                    '--gkt-countdown--unit-label__font-size': attributes.labelFontSize ? `${ attributes.labelFontSize }px` : false,
                    '--gkt-countdown--unit-label__color': attributes.labelColor,
                };

                return styles;
            },
            supports: {
                styles: true,
                frame: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        attributes: {
            date: {
                type: 'string',
                default: '',
            },
            units: {
                type: 'array',
                default: [ 'days', 'hours', 'minutes', 'seconds' ],
            },
            unitsAlign: {
                type: 'string',
            },

            numberFontSize: {
                type: 'number',
                default: 50,
            },
            labelFontSize: {
                type: 'number',
            },
            numberColor: {
                type: 'string',
                default: '#0366d6',
            },
            labelColor: {
                type: 'string',
                default: '',
            },
        },
        save,
    },
];
