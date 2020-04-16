/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import save from './save';
import metadata from './block.json';

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

const { name } = metadata;

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
        save( props ) {
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
                        className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition || 'left' }${ animateInViewport ? ' ghostkit-count-up' : '' }` }
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
        save( props ) {
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
                        className={ `ghostkit-counter-box-number ghostkit-counter-box-number-align-${ numberPosition || 'left' }` }
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
