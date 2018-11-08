// External Dependencies.
import classnames from 'classnames/dedupe';

const {
    applyFilters,
} = wp.hooks;
const {
    InnerBlocks,
    RichText,
} = wp.editor;

const name = 'ghostkit/counter-box';

export default [
    {
        supports: {
            html: false,
            className: false,
            anchor: true,
            align: [ 'wide', 'full' ],
            ghostkitStyles: true,
            ghostkitStylesCallback( attributes ) {
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
            ghostkitSpacings: true,
            ghostkitDisplay: true,
            ghostkitSR: true,
        },
        attributes: {
            variant: {
                type: 'string',
                default: 'default',
            },
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
                variant,
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

            // variant classname.
            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-counter-box-variant-${ variant }` );
            }

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
    {
        supports: {
            html: false,
            align: [ 'wide', 'full' ],
            ghostkitStyles: true,
            ghostkitSpacings: true,
            ghostkitDisplay: true,
            ghostkitSR: true,
        },
        attributes: {
            variant: {
                type: 'string',
                default: 'default',
            },
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
        save: function( { attributes, className = '' } ) {
            const {
                number,
                numberPosition,
                variant,
            } = attributes;

            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-counter-box-variant-${ variant }` );
            }

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
