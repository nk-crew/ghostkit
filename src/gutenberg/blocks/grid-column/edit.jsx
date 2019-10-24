/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
    BaseControl,
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
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

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';
import ResponsiveTabPanel from '../../components/responsive-tab-panel';

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

    for ( let k = 1; k <= 12; k++ ) {
        result.push( {
            label: sprintf( k === 1 ? __( '%d Column (%s)', '@@text_domain' ) : __( '%d Columns (%s)', '@@text_domain' ), k, `${ Math.round( ( 100 * k / 12 ) * 100 ) / 100 }%` ),
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

    for ( let k = 1; k <= columns; k++ ) {
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
            stickyContentTop,
            stickyContentBottom,
        } = attributes;

        const iconsColor = {};
        if ( ghostkitVariables && ghostkitVariables.media_sizes && Object.keys( ghostkitVariables.media_sizes ).length ) {
            Object.keys( ghostkitVariables.media_sizes ).forEach( ( media ) => {
                let sizeName = 'size';
                let orderName = 'order';
                let verticalAlignName = 'verticalAlign';

                if ( media !== 'all' ) {
                    sizeName = `${ media }_${ sizeName }`;
                    orderName = `${ media }_${ orderName }`;
                    verticalAlignName = `${ media }_${ verticalAlignName }`;
                }

                if ( ! attributes[ sizeName ] && ! attributes[ orderName ] && ! attributes[ verticalAlignName ] ) {
                    iconsColor[ media ] = '#cccccc';
                }
            } );
        }

        // background
        const background = applyFilters( 'ghostkit.editor.grid-column.background', '', this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <ApplyFilters name="ghostkit.editor.controls" attribute="columnSettings" props={ this.props }>
                        <PanelBody>
                            <ResponsiveTabPanel iconsColor={ iconsColor }>
                                {
                                    ( tabData ) => {
                                        let sizeName = 'size';
                                        let orderName = 'order';
                                        let verticalAlignName = 'verticalAlign';

                                        if ( tabData.name !== 'all' ) {
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
                                                    <Toolbar controls={ [
                                                        {
                                                            icon: getIcon( 'icon-vertical-top' ),
                                                            title: __( 'Start', '@@text_domain' ),
                                                            onClick: () => {
                                                                setAttributes( {
                                                                    [ verticalAlignName ]: attributes[ verticalAlignName ] === 'start' ? '' : 'start',
                                                                } );
                                                            },
                                                            isActive: attributes[ verticalAlignName ] === 'start',
                                                        },
                                                        {
                                                            icon: getIcon( 'icon-vertical-center' ),
                                                            title: __( 'Center', '@@text_domain' ),
                                                            onClick: () => {
                                                                setAttributes( {
                                                                    [ verticalAlignName ]: attributes[ verticalAlignName ] === 'center' ? '' : 'center',
                                                                } );
                                                            },
                                                            isActive: attributes[ verticalAlignName ] === 'center',
                                                        },
                                                        {
                                                            icon: getIcon( 'icon-vertical-bottom' ),
                                                            title: __( 'End', '@@text_domain' ),
                                                            onClick: () => {
                                                                setAttributes( {
                                                                    [ verticalAlignName ]: attributes[ verticalAlignName ] === 'end' ? '' : 'end',
                                                                } );
                                                            },
                                                            isActive: attributes[ verticalAlignName ] === 'end',
                                                        },
                                                    ] }
                                                    />
                                                </BaseControl>
                                            </Fragment>
                                        );
                                    }
                                }
                            </ResponsiveTabPanel>
                        </PanelBody>
                    </ApplyFilters>
                    <PanelBody>
                        <BaseControl>
                            <ToggleControl
                                label={ __( 'Sticky content', '@@text_domain' ) }
                                checked={ !! stickyContent }
                                onChange={ ( value ) => setAttributes( { stickyContent: value } ) }
                            />
                            <p><em>{ __( '`position: sticky` will be applied to column content. Don\'t forget to set top or bottom value in pixels.', '@@text_domain' ) }</em></p>
                            { stickyContent ? (
                                <Fragment>
                                    <TextControl
                                        label={ __( 'Top', '@@text_domain' ) }
                                        type="number"
                                        value={ stickyContentTop }
                                        onChange={ ( value ) => setAttributes( { stickyContentTop: '' !== value ? parseInt( value, 10 ) : '' } ) }
                                    />
                                    <TextControl
                                        label={ __( 'Bottom', '@@text_domain' ) }
                                        type="number"
                                        value={ stickyContentBottom }
                                        onChange={ ( value ) => setAttributes( { stickyContentBottom: '' !== value ? parseInt( value, 10 ) : '' } ) }
                                    />
                                </Fragment>
                            ) : '' }
                        </BaseControl>
                    </PanelBody>
                    <ApplyFilters name="ghostkit.editor.controls" attribute="background" props={ this.props } />
                </InspectorControls>
                { background }
                <div className="ghostkit-col-content">
                    { ! isSelected ? (
                        <div className="ghostkit-column-button-select">
                            <Tooltip text={ __( 'Select Column', '@@text_domain' ) }>
                                { getIcon( 'block-grid-column' ) }
                            </Tooltip>
                        </div>
                    ) : '' }
                    <InnerBlocks
                        templateLock={ false }
                        renderAppender={ (
                            hasChildBlocks ?
                                undefined :
                                () => <InnerBlocks.ButtonBlockAppender />
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
        hasChildBlocks: blockEditor ? blockEditor.getBlockOrder( clientId ).length > 0 : false,
    };
} )( BlockEdit );
