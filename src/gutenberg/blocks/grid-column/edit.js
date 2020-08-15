/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';
import ResponsiveTabPanel from '../../components/responsive-tab-panel';

const { __, sprintf } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
    BaseControl,
    PanelBody,
    ButtonGroup,
    Button,
    SelectControl,
    RangeControl,
    Tooltip,
    Toolbar,
} = wp.components;

const {
    applyFilters,
} = wp.hooks;

const {
    InspectorControls,
    InnerBlocks,
} = wp.blockEditor;

const {
    withSelect,
} = wp.data;

const { ghostkitVariables } = window;

/**
 * Get array for Select element.
 *
 * @returns {Array} array for Select.
 */
const getDefaultColumnSizes = function() {
    const result = [
        {
            label: __( 'Inherit from larger', '@@text_domain' ),
            value: '',
        }, {
            label: __( 'Auto', '@@text_domain' ),
            value: 'auto',
        },
    ];

    for ( let k = 1; 12 >= k; k += 1 ) {
        result.push( {
            label: sprintf( 1 === k ? __( '%d Column (%s)', '@@text_domain' ) : __( '%d Columns (%s)', '@@text_domain' ), k, `${ Math.round( ( ( 100 * k ) / 12 ) * 100 ) / 100 }%` ),
            value: k,
        } );
    }
    return result;
};

/**
 * Get array for Select element.
 *
 * @param {Number} columns - number of available columns.
 *
 * @returns {Array} array for Select.
 */
const getDefaultColumnOrders = function( columns = 12 ) {
    const result = [
        {
            label: __( 'Inherit from larger', '@@text_domain' ),
            value: '',
        }, {
            label: __( 'Auto', '@@text_domain' ),
            value: 'auto',
        }, {
            label: __( 'First', '@@text_domain' ),
            value: 'first',
        },
    ];

    for ( let k = 1; k <= columns; k += 1 ) {
        result.push( {
            label: k,
            value: k,
        } );
    }

    result.push( {
        label: __( 'Last', '@@text_domain' ),
        value: 'last',
    } );

    return result;
};

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
            hasChildBlocks,
        } = this.props;

        const {
            stickyContent,
            stickyContentOffset,
        } = attributes;

        const filledTabs = {};
        if ( ghostkitVariables && ghostkitVariables.media_sizes && Object.keys( ghostkitVariables.media_sizes ).length ) {
            Object.keys( ghostkitVariables.media_sizes ).forEach( ( media ) => {
                let sizeName = 'size';
                let orderName = 'order';
                let verticalAlignName = 'verticalAlign';

                if ( 'all' !== media ) {
                    sizeName = `${ media }_${ sizeName }`;
                    orderName = `${ media }_${ orderName }`;
                    verticalAlignName = `${ media }_${ verticalAlignName }`;
                }

                filledTabs[ media ] = attributes[ sizeName ] || attributes[ orderName ] || attributes[ verticalAlignName ];
            } );
        }

        // background
        const background = applyFilters( 'ghostkit.editor.grid-column.background', '', this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <ApplyFilters name="ghostkit.editor.controls" attribute="columnSettings" props={ this.props }>
                        <PanelBody>
                            <ResponsiveTabPanel filledTabs={ filledTabs }>
                                {
                                    ( tabData ) => {
                                        let sizeName = 'size';
                                        let orderName = 'order';
                                        let verticalAlignName = 'verticalAlign';

                                        if ( 'all' !== tabData.name ) {
                                            sizeName = `${ tabData.name }_${ sizeName }`;
                                            orderName = `${ tabData.name }_${ orderName }`;
                                            verticalAlignName = `${ tabData.name }_${ verticalAlignName }`;
                                        }

                                        return (
                                            <Fragment>
                                                <SelectControl
                                                    label={ __( 'Size', '@@text_domain' ) }
                                                    value={ attributes[ sizeName ] }
                                                    onChange={ ( value ) => {
                                                        setAttributes( {
                                                            [ sizeName ]: value,
                                                        } );
                                                    } }
                                                    options={ getDefaultColumnSizes() }
                                                />
                                                <SelectControl
                                                    label={ __( 'Order', '@@text_domain' ) }
                                                    value={ attributes[ orderName ] }
                                                    onChange={ ( value ) => {
                                                        setAttributes( {
                                                            [ orderName ]: value,
                                                        } );
                                                    } }
                                                    options={ getDefaultColumnOrders() }
                                                />
                                                <BaseControl
                                                    label={ __( 'Vertical alignment', '@@text_domain' ) }
                                                >
                                                    <div>
                                                        <Toolbar controls={ [
                                                            {
                                                                icon: getIcon( 'icon-vertical-top' ),
                                                                title: __( 'Start', '@@text_domain' ),
                                                                onClick: () => {
                                                                    setAttributes( {
                                                                        [ verticalAlignName ]: 'start' === attributes[ verticalAlignName ] ? '' : 'start',
                                                                    } );
                                                                },
                                                                isActive: 'start' === attributes[ verticalAlignName ],
                                                            },
                                                            {
                                                                icon: getIcon( 'icon-vertical-center' ),
                                                                title: __( 'Center', '@@text_domain' ),
                                                                onClick: () => {
                                                                    setAttributes( {
                                                                        [ verticalAlignName ]: 'center' === attributes[ verticalAlignName ] ? '' : 'center',
                                                                    } );
                                                                },
                                                                isActive: 'center' === attributes[ verticalAlignName ],
                                                            },
                                                            {
                                                                icon: getIcon( 'icon-vertical-bottom' ),
                                                                title: __( 'End', '@@text_domain' ),
                                                                onClick: () => {
                                                                    setAttributes( {
                                                                        [ verticalAlignName ]: 'end' === attributes[ verticalAlignName ] ? '' : 'end',
                                                                    } );
                                                                },
                                                                isActive: 'end' === attributes[ verticalAlignName ],
                                                            },
                                                        ] }
                                                        />
                                                    </div>
                                                </BaseControl>
                                            </Fragment>
                                        );
                                    }
                                }
                            </ResponsiveTabPanel>
                        </PanelBody>
                    </ApplyFilters>
                    <PanelBody>
                        <BaseControl label={ __( 'Sticky Content', '@@text_domain' ) }>
                            <div />
                            <ButtonGroup>
                                {
                                    [
                                        {
                                            label: __( 'No', '@@text_domain' ),
                                            value: '',
                                        },
                                        {
                                            label: __( 'Top', '@@text_domain' ),
                                            value: 'top',
                                        },
                                        {
                                            label: __( 'Bottom', '@@text_domain' ),
                                            value: 'bottom',
                                        },
                                    ].map( ( val ) => {
                                        const selected = stickyContent === val.value;

                                        return (
                                            <Button
                                                isSmall
                                                isPrimary={ selected }
                                                isPressed={ selected }
                                                onClick={ () => setAttributes( { stickyContent: val.value } ) }
                                                key={ `stickyContent_${ val.label }` }
                                            >
                                                { val.label }
                                            </Button>
                                        );
                                    } )
                                }
                            </ButtonGroup>
                        </BaseControl>
                        { stickyContent ? (
                            <RangeControl
                                label={ __( 'Sticky Offset', '@@text_domain' ) }
                                value={ stickyContentOffset }
                                onChange={ ( value ) => setAttributes( { stickyContentOffset: value } ) }
                            />
                        ) : '' }
                    </PanelBody>
                    <ApplyFilters name="ghostkit.editor.controls" attribute="background" props={ this.props } />
                </InspectorControls>
                { background }
                <div className="ghostkit-col-content">
                    { ! isSelected && hasChildBlocks ? (
                        <div className="ghostkit-column-button-select">
                            <Tooltip text={ __( 'Select Column', '@@text_domain' ) }>
                                { getIcon( 'block-grid-column' ) }
                            </Tooltip>
                        </div>
                    ) : '' }
                    <InnerBlocks
                        templateLock={ false }
                        renderAppender={ (
                            hasChildBlocks
                                ? undefined
                                : () => <InnerBlocks.ButtonBlockAppender />
                        ) }
                    />
                </div>
            </Fragment>
        );
    }
}

export default withSelect( ( select, ownProps ) => {
    const { clientId } = ownProps;
    const blockEditor = select( 'core/block-editor' );

    return {
        hasChildBlocks: blockEditor ? 0 < blockEditor.getBlockOrder( clientId ).length : false,
    };
} )( BlockEdit );
