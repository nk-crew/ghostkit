// External Dependencies.
import classnames from 'classnames/dedupe';

const {
    InnerBlocks,
} = wp.editor;

const {
    createBlock,
} = wp.blocks;

const defaultColumnSettings = {
    sm_size: '',
    sm_order: '',
    sm_display: '',

    md_size: '',
    md_order: '',
    md_display: '',

    lg_size: '',
    lg_order: '',
    lg_display: '',

    xl_size: '',
    xl_order: '',
    xl_display: '',

    order: '',
    size: 'auto',
    display: '',
};

/**
 * Returns the ready to use className for grid container.
 *
 * @param {object} attributes - block attributes.
 *
 * @return {String} Classname for Grid container.
 */
const getGridClass = ( { columns, columnsSettings } ) => {
    let result = '';

    for ( let k = 1; k <= columns; k++ ) {
        const colSettings = Object.assign( {}, defaultColumnSettings, columnsSettings[ 'column_' + k ] );

        Object.keys( colSettings ).map( ( key ) => {
            if ( colSettings[ key ] ) {
                let prefix = key.split( '_' )[ 0 ];
                let type = key.split( '_' )[ 1 ];

                if ( ! type ) {
                    type = prefix;
                    prefix = '';
                }

                prefix = prefix ? `-${ prefix }` : '';
                type = type === 'size' ? 'col' : type;

                result = classnames( result, `ghostkit-grid-${ type }-${ k }${ prefix || '' }${ colSettings[ key ] !== 'auto' ? `-${ colSettings[ key ] }` : '' }` );
            }
        } );
    }

    return result;
};

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
            className: false,
            align: [ 'wide', 'full' ],
        },
        attributes: {
            variant: {
                type: 'string',
                default: 'default',
            },
            columns: {
                type: 'number',
                default: 2,
            },
            gap: {
                type: 'string',
                default: 'md',
            },
            verticalAlign: {
                type: 'string',
            },
            horizontalAlign: {
                type: 'string',
            },

            // Should be used in Deprecated block
            columnsSettings: {
                type: 'object',
                default: {},
            },
        },
        isEligible( attributes, innerBlocks ) {
            return attributes.columns === 0 && innerBlocks.length;
        },
        migrate( attributes, innerBlocks ) {
            attributes.columns = innerBlocks.length;

            return [
                attributes,
                innerBlocks,
            ];
        },
        save: function( { attributes, className = '' } ) {
            const {
                verticalAlign,
                horizontalAlign,
                gap,
                variant,
            } = attributes;

            className = classnames(
                className,
                'ghostkit-grid',
                `ghostkit-grid-gap-${ gap }`,
                verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
                horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false
            );

            // variant classname.
            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-grid-variant-${ variant }` );
            }

            return (
                <div className={ className }>
                    <InnerBlocks.Content />
                </div>
            );
        },
    }, {
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
        },
        attributes: {
            variant: {
                type: 'string',
                default: 'default',
            },
            columns: {
                type: 'number',
                default: 2,
            },
            columnsSettings: {
                type: 'object',
                default: {},
            },
            gap: {
                type: 'string',
                default: 'md',
            },
            verticalAlign: {
                type: 'string',
            },
            horizontalAlign: {
                type: 'string',
            },
            align: {
                type: 'string',
            },
        },
        isEligible( attributes, innerBlocks ) {
            return innerBlocks.some( function( item ) {
                return typeof item.attributes !== 'undefined' && typeof item.attributes.layout !== 'undefined';
            } );
        },
        migrate( attributes, innerBlocks ) {
            function withoutLayout( block ) {
                const newAttributes = block.attributes;

                if ( newAttributes.layout ) {
                    delete newAttributes.layout;
                }

                return {
                    ...block,
                    attributes: newAttributes,
                };
            }

            const columns = innerBlocks.reduce( ( result, innerBlock ) => {
                const { layout } = innerBlock.attributes;

                let columnIndex, columnMatch;
                if ( layout && ( columnMatch = layout.match( /^ghostkit ghostkit-col ghostkit-col-(\d+)$/ ) ) ) {
                    columnIndex = Number( columnMatch[ 1 ] ) - 1;
                } else {
                    columnIndex = 0;
                }

                if ( ! result[ columnIndex ] ) {
                    result[ columnIndex ] = [];
                }

                result[ columnIndex ].push( withoutLayout( innerBlock ) );

                return result;
            }, [] );

            const migratedInnerBlocks = columns.map( ( columnBlocks, i ) => {
                const columnData = {};

                if ( attributes.columnsSettings && attributes.columnsSettings[ `column_${ i + 1 }` ] ) {
                    const colSettings = attributes.columnsSettings[ `column_${ i + 1 }` ];
                    Object.keys( colSettings ).forEach( ( k ) => {
                        if ( colSettings[ k ] ) {
                            columnData[ k ] = colSettings[ k ];
                        }
                    } );
                }

                return createBlock( 'ghostkit/grid-column', columnData, columnBlocks );
            } );

            return [
                attributes,
                migratedInnerBlocks,
            ];
        },
        save: function( { attributes, className = '' } ) {
            const {
                columns,
                verticalAlign,
                horizontalAlign,
                gap,
                variant,
            } = attributes;

            className = classnames(
                className,
                `ghostkit-grid-cols-${ columns } ghostkit-grid-gap-${ gap }`,
                verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
                horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false,
                getGridClass( attributes )
            );

            // variant classname.
            if ( 'default' !== variant ) {
                className = classnames( className, `ghostkit-grid-variant-${ variant }` );
            }

            return (
                <div className={ className }>
                    <InnerBlocks.Content />
                </div>
            );
        },
    },
];
