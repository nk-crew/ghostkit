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
                    '--gkt-counter-box--number__font-size': attributes.numberSize ? `${ attributes.numberSize }px` : false,
                    '--gkt-counter-box--number__color': attributes.numberColor,
                };

                if ( attributes.hoverNumberColor ) {
                    styles[ '&:hover' ] = {
                        '--gkt-counter-box--number__color': attributes.hoverNumberColor,
                    };
                }

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
            number: {
                type: 'string',
                source: 'html',
                selector: '.ghostkit-counter-box-number-wrap',
                default: '77',
            },
            animateInViewport: {
                type: 'boolean',
                default: false,
            },
            animateInViewportFrom: {
                type: 'number',
                default: 0,
            },
            numberPosition: {
                type: 'string',
                default: 'top',
            },
            numberSize: {
                type: 'number',
                default: 50,
            },
            showContent: {
                type: 'boolean',
                default: true,
            },
            numberColor: {
                type: 'string',
                default: '#0366d6',
            },
            hoverNumberColor: {
                type: 'string',
            },
            url: {
                type: 'string',
            },
            target: {
                type: 'string',
            },
            rel: {
                type: 'string',
            },
        },
        save,
    },
];
