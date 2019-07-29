/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

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
        save: function( props ) {
            const {
                icon,
                hideButton,
            } = props.attributes;

            let {
                className,
            } = props;

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name: 'ghostkit/alert',
                },
                ...props,
            } );

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
