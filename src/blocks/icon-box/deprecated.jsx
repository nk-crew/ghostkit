// External Dependencies.
import classnames from 'classnames/dedupe';

const {
    InnerBlocks,
} = wp.editor;

export default [
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
            variant: {
                type: 'string',
                default: 'default',
            },
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
        save: function( { attributes, className = '' } ) {
            const {
                icon,
                iconPosition,
                variant,
            } = attributes;

            // variant classname.
            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-icon-box-variant-${ variant }` );
            }

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
