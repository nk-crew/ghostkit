/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getBackgroundStyles from '../grid/get-background-styles';

import metadata from './block.json';
import getColClass from './get-col-class';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const {
    applyFilters,
} = wp.hooks;

const {
    InnerBlocks,
} = wp.blockEditor;

const { name } = metadata;

export default [
    // v2.10.2
    {
        ...metadata,
        ghostkit: {
            customSelector( selector ) {
                // extend selector to add possibility to override default column spacings without !important
                selector = `.ghostkit-grid ${ selector }`;

                return selector;
            },
            customStylesCallback( attributes ) {
                const {
                    stickyContent,
                    stickyContentTop,
                    stickyContentBottom,
                    awb_image: image,
                } = attributes;

                let result = {};

                // Sticky styles.
                if ( stickyContent ) {
                    result[ '& > .ghostkit-col-content' ] = {
                        position: '-webkit-sticky',
                    };
                    result[ '> .ghostkit-col-content' ] = {
                        position: 'sticky',
                    };

                    if ( 'number' === typeof stickyContentBottom ) {
                        result = {
                            display: 'flex',
                            '-webkit-box-orient': 'vertical',
                            '-webkit-box-direction': 'normal',
                            '-ms-flex-direction': 'column',
                            'flex-direction': 'column',
                            ...result,
                        };
                        result[ '> .ghostkit-col-content' ].marginTop = 'auto';
                        result[ '> .ghostkit-col-content' ].bottom = stickyContentBottom;
                    } else {
                        result[ '> .ghostkit-col-content' ].top = 'number' === typeof stickyContentTop ? stickyContentTop : 0;
                    }
                }

                // Image styles.
                if ( image ) {
                    result = {
                        ...result,
                        ...getBackgroundStyles( attributes ),
                    };
                }

                return result;
            },
            customStylesFilter( styles, data, isEditor, attributes ) {
                // change custom styles in Editor.
                if ( isEditor && attributes.ghostkitClassname ) {
                    // background.
                    styles = styles.replace( new RegExp( '> .nk-awb .jarallax-img', 'g' ), '> .awb-gutenberg-preview-block .jarallax-img' );
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
        isEligible( attributes ) {
            return 'boolean' === typeof attributes.stickyContent;
        },
        migrate( attributes ) {
            const newAttributes = {
                stickyContent: '',
                stickyContentOffset: 0,
            };

            // Add new attributes.
            if ( attributes.stickyContent ) {
                if ( 'undefined' !== typeof attributes.stickyContentTop ) {
                    newAttributes.stickyContent = 'top';
                    newAttributes.stickyContentOffset = attributes.stickyContentTop;
                } else if ( 'undefined' !== typeof attributes.stickyContentBottom ) {
                    newAttributes.stickyContent = 'bottom';
                    newAttributes.stickyContentOffset = attributes.stickyContentBottom;
                } else {
                    newAttributes.stickyContent = 'top';
                }
            }

            // Remove old attributes.
            if ( 'undefined' !== typeof attributes.stickyContentTop ) {
                delete attributes.stickyContentTop;
            }
            if ( 'undefined' !== typeof attributes.stickyContentBottom ) {
                delete attributes.stickyContentBottom;
            }

            return {
                ...attributes,
                ...newAttributes,
            };
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
            sm_verticalAlign: {
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
            md_verticalAlign: {
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
            lg_verticalAlign: {
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
            xl_verticalAlign: {
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
            verticalAlign: {
                type: 'string',
                default: '',
            },
            stickyContent: {
                type: 'boolean',
                default: false,
            },
            stickyContentTop: {
                type: 'number',
            },
            stickyContentBottom: {
                type: 'number',
            },
        },
        save: class BlockSave extends Component {
            render() {
                let className = getColClass( this.props );

                // background
                const background = applyFilters( 'ghostkit.blocks.grid-column.background', '', {
                    ...{
                        name,
                    },
                    ...this.props,
                } );

                if ( background ) {
                    className = classnames( className, 'ghostkit-col-with-bg' );
                }

                return (
                    <div className={ className }>
                        { background }
                        <div className="ghostkit-col-content">
                            <InnerBlocks.Content />
                        </div>
                    </div>
                );
            }
        },
    },

    // v1.6.3
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

                    if ( 'number' === typeof stickyContentTop ) {
                        result[ '> .ghostkit-col-content' ].top = stickyContentTop;
                    }
                    if ( 'number' === typeof stickyContentBottom ) {
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
        save( props ) {
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
