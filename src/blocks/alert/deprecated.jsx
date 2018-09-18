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
            color: {
                type: 'string',
                default: '#d94f4f',
            },
            icon: {
                type: 'string',
                default: 'fas fa-exclamation-triangle',
            },
            iconSize: {
                type: 'number',
                default: 30,
            },
            hideButton: {
                type: 'boolean',
                default: false,
            },
        },
        save: function( { attributes, className = '' } ) {
            const {
                icon,
                hideButton,
                variant,
            } = attributes;

            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-alert-variant-${ variant }` );
            }

            return (
                <div className={ className }>
                    { icon ? (
                        <div className="ghostkit-alert-icon">
                            <span className={ icon } />
                        </div>
                    ) : '' }
                    <div className="ghostkit-alert-content">
                        <InnerBlocks.Content />
                    </div>
                    { hideButton ? (
                        <div className="ghostkit-alert-hide-button">
                            <span className="fas fa-times" />
                        </div>
                    ) : '' }
                </div>
            );
        },
    },
];
