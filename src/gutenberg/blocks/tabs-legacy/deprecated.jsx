// External Dependencies.
import classnames from 'classnames/dedupe';

const { __, sprintf } = wp.i18n;

const {
    InnerBlocks,
} = wp.blockEditor;

const {
    applyFilters,
} = wp.hooks;

const {
    createBlock,
} = wp.blocks;

const getTabs = ( { tabsCount, tabsSettings } ) => {
    const result = [];

    for ( let k = 1; k <= tabsCount; k++ ) {
        result.push( {
            label: tabsSettings[ 'tab_' + k ] ? tabsSettings[ 'tab_' + k ].label : sprintf( __( 'Tab %d' ), k ),
            number: k,
        } );
    }

    return result;
};

export default [
    {
        supports: {
            html: false,
            ghostkitStyles: true,
            ghostkitSpacings: true,
            ghostkitDisplay: true,
            ghostkitSR: true,
        },
        attributes: {
            tabsCount: {
                type: 'number',
                default: 2,
            },
            tabActive: {
                type: 'number',
                default: 1,
            },
            tabsSettings: {
                type: 'object',
                default: {},
            },
            buttonsAlign: {
                type: 'string',
                default: 'start',
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

            const tabItems = innerBlocks.reduce( ( result, innerBlock ) => {
                const { layout } = innerBlock.attributes;

                let columnIndex, columnMatch;
                if ( layout && ( columnMatch = layout.match( /^ghostkit ghostkit-tab ghostkit-tab-(\d+)$/ ) ) ) {
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

            const migratedInnerBlocks = tabItems.map( ( tabBlocks, i ) => {
                return createBlock( 'ghostkit/tabs-tab', {
                    tabNumber: i + 1,
                }, tabBlocks );
            } );

            return [
                attributes,
                migratedInnerBlocks,
            ];
        },
        save: function( props ) {
            const {
                tabsCount,
                tabActive,
                buttonsAlign,
            } = props.attributes;

            let {
                className,
            } = props;

            className = classnames(
                className,
                `ghostkit-tabs-${ tabsCount }`,
                `ghostkit-tabs-active-${ tabActive }`
            );

            className = applyFilters( 'ghostkit.blocks.className', className, {
                ...{
                    name: 'ghostkit/tabs',
                },
                ...props,
            } );

            const tabs = getTabs( props.attributes );

            return (
                <div className={ className }>
                    <div className={ classnames( 'ghostkit-tabs-buttons', `ghostkit-tabs-buttons-align-${ buttonsAlign }` ) }>
                        {
                            tabs.map( ( val ) => {
                                return (
                                    <a data-tab={ val.number } href={ `#tab-${ val.number }` } className="ghostkit-tabs-buttons-item" key={ `tab_button_${ val.number }` } >
                                        { val.label }
                                    </a>
                                );
                            } )
                        }
                    </div>
                    <div className="ghostkit-tabs-content">
                        <InnerBlocks.Content />
                    </div>
                </div>
            );
        },
    },
];
