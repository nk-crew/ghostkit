import getColClass from './get-col-class.jsx';

const {
    InnerBlocks,
} = wp.editor;

export default [
    {
        ghostkit: {
            customStylesCallback( attributes ) {
                const {
                    stickyContent,
                    stickyContentTop,
                    stickyContentBottom,
                } = attributes;

                const result = {};

                if ( stickyContent ) {
                    result[ '& > .ghostkit-col-content' ] = {
                        position: '-webkit-sticky',
                    };
                    result[ '> .ghostkit-col-content' ] = {
                        position: 'sticky',
                    };

                    if ( typeof stickyContentTop === 'number' ) {
                        result[ '> .ghostkit-col-content' ].top = stickyContentTop;
                    }
                    if ( typeof stickyContentBottom === 'number' ) {
                        result[ '> .ghostkit-col-content' ].bottom = stickyContentBottom;
                    }
                }

                return result;
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
            inserter: false,
            reusable: false,
        },
        attributes: {
            sm_size: {
                type: 'string',
                default: '',
            },
            sm_order: {
                type: 'string',
                default: '',
            },

            md_size: {
                type: 'string',
                default: '',
            },
            md_order: {
                type: 'string',
                default: '',
            },

            lg_size: {
                type: 'string',
                default: '',
            },
            lg_order: {
                type: 'string',
                default: '',
            },

            xl_size: {
                type: 'string',
                default: '',
            },
            xl_order: {
                type: 'string',
                default: '',
            },

            size: {
                type: 'string',
                default: 'auto',
            },
            order: {
                type: 'string',
                default: '',
            },
            stickyContent: {
                type: 'boolean',
                default: false,
            },
            stickyContentTop: {
                type: 'number',
                default: 40,
            },
            stickyContentBottom: {
                type: 'number',
                default: '',
            },
        },
        save: function( props ) {
            const {
                stickyContent,
            } = props.attributes;

            const className = getColClass( props );

            if ( stickyContent ) {
                return (
                    <div className={ className }>
                        <div className="ghostkit-col-content">
                            <InnerBlocks.Content />
                        </div>
                    </div>
                );
            }

            return (
                <div className={ className }>
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
];
