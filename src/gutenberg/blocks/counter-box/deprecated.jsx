/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;
const {
    InnerBlocks,
    RichText,
} = wp.blockEditor;

/**
 * Internal dependencies
 */

const name = 'ghostkit/counter-box';

export default [
    // v1.5.1
    {
        ghostkit: {
            customStylesCallback( attributes ) {
                const styles = {
                    '.ghostkit-counter-box-number': {
                        fontSize: attributes.numberSize,
                        color: attributes.numberColor,
                    },
                };

                if ( attributes.hoverNumberColor ) {
                    styles[ '&:hover .ghostkit-counter-box-number' ] = {
                        color: attributes.hoverNumberColor,
                    };
                }

                return styles;
            },
            supports: {
                styles: true,
                spacings: true,
                display: true,
                scrollReveal: true,
            },
        },
        supports: {
            html: false,
            className: false,
            anchor: true,
            align: [ 'wide', 'full' ],
        },
        attributes: {
            number: {
                type: 'array',
                source: 'children',
                selector: '.ghostkit-counter-box-number',
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
            numberColor: {
                type: 'string',
                default: '#0366d6',
            },
            hoverNumberColor: {
                type: 'string',
            },
        },
        save: function( props ) {
            const {
                number,
                animateInViewport,
                numberPosition,
            } = props.attributes;

            let {
                animateInViewportFrom,
                className,
            } = props.attributes;

            animateInViewportFrom = parseFloat( animateInViewportFrom );

            className = classnames( 'ghostkit-counter-box', className );

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name,
                },
                ...props,
            } );

            return (
                <div className={ className }>
                    <RichText.Content
                        tagName="div"
                        className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition ? numberPosition : 'left' }${ animateInViewport ? ' ghostkit-count-up' : '' }` }
                        value={ number }
                        { ...{
                            'data-count-from': animateInViewport && animateInViewportFrom ? animateInViewportFrom : null,
                        } }
                    />
                    <div className="ghostkit-counter-box-content">
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
    },

    // v1.0.0
    {
        ghostkit: {
            supports: {
                styles: true,
                spacings: true,
                display: true,
                scrollReveal: true,
            },
        },
        supports: {
            html: false,
            align: [ 'wide', 'full' ],
        },
        attributes: {
            number: {
                type: 'array',
                source: 'children',
                selector: '.ghostkit-counter-box-number',
                default: '77',
            },
            numberPosition: {
                type: 'string',
                default: 'top',
            },
            numberSize: {
                type: 'number',
                default: 50,
            },
            numberColor: {
                type: 'string',
                default: '#016c91',
            },
        },
        save: function( props ) {
            const {
                number,
                numberPosition,
            } = props.attributes;

            let {
                className,
            } = props;

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name,
                },
                ...props,
            } );

            return (
                <div className={ className }>
                    <RichText.Content
                        tagName="div"
                        className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition ? numberPosition : 'left' }` }
                        value={ number }
                    />
                    <div className="ghostkit-counter-box-content">
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
    },
];
