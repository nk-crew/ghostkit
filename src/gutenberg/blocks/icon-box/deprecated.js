/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const {
    InnerBlocks,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import metadata from './block.json';
import save from './save';

export default [
    // v2.8.2
    {
        ghostkit: {
            customStylesCallback( attributes ) {
                const styles = {
                    '.ghostkit-icon-box-icon': {
                        fontSize: attributes.iconSize,
                        color: attributes.iconColor,
                    },
                };

                if ( attributes.hoverIconColor ) {
                    styles[ '&:hover .ghostkit-icon-box-icon' ] = {
                        color: attributes.hoverIconColor,
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
        supports: metadata.supports,
        attributes: {
            ...metadata.attributes,
            icon: {
                type: 'string',
                default: 'fab fa-wordpress-simple',
            },
        },
        save,
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
            icon: {
                type: 'string',
                default: 'fab fa-wordpress-simple',
            },
            iconPosition: {
                type: 'string',
                default: 'left',
            },
            iconSize: {
                type: 'number',
                default: 30,
            },
            iconColor: {
                type: 'string',
                default: '#016c91',
            },
        },
        save: function( props ) {
            const {
                icon,
                iconPosition,
            } = props.attributes;

            let {
                className,
            } = props;

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name: 'ghostkit/icon-box',
                },
                ...props,
            } );

            return (
                <div className={ className }>
                    { icon ? (
                        <div className={ `ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${ iconPosition ? iconPosition : 'left' }` }>
                            <span className={ icon } />
                        </div>
                    ) : '' }
                    <div className="ghostkit-icon-box-content">
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
    },
];
