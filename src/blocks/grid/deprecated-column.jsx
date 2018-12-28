// External Dependencies.
import classnames from 'classnames/dedupe';

import getColClass from './get-col-class.jsx';

const {
    InnerBlocks,
} = wp.editor;

export default [
    {
        supports: {
            html: false,
            className: false,
            anchor: true,
            ghostkitStyles: true,
            inserter: false,
            reusable: false,
            ghostkitStylesCallback( attributes ) {
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
            ghostkitSpacings: true,
            ghostkitDisplay: true,
            ghostkitSR: true,
        },
        attributes: {
            variant: {
                type: 'string',
                default: 'default',
            },

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
        save: function( { attributes } ) {
            const {
                variant,
                stickyContent,
            } = attributes;

            let className = getColClass( attributes );

            // variant classname.
            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-col-variant-${ variant }` );
            }

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
