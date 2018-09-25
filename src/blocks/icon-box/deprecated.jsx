// External Dependencies.
import classnames from 'classnames/dedupe';

const {
    InnerBlocks,
} = wp.editor;

export default [
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
