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

    for ( let k = 1; k <= tabsCount; k += 1 ) {
        result.push( {
            label: tabsSettings[ `tab_${ k }` ] ? tabsSettings[ `tab_${ k }` ].label : sprintf( __( 'Tab %d', '@@text_domain' ), k ),
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
            return innerBlocks.some( ( item ) => 'undefined' !== typeof item.attributes && 'undefined' !== typeof item.attributes.layout );
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
                const columnMatch = layout.match( /^ghostkit ghostkit-tab ghostkit-tab-(\d+)$/ );

                let columnIndex;

                if ( layout && columnMatch ) {
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

            const migratedInnerBlocks = tabItems.map( ( tabBlocks, i ) => createBlock( 'ghostkit/tabs-tab', {
                tabNumber: i + 1,
            }, tabBlocks ) );

            return [
                attributes,
                migratedInnerBlocks,
            ];
        },
        save( props ) {
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
                            tabs.map( ( val ) => (
                                <a data-tab={ val.number } href={ `#tab-${ val.number }` } className="ghostkit-tabs-buttons-item" key={ `tab_button_${ val.number }` }>
                                    { val.label }
                                </a>
                            ) )
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
