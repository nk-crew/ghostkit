// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/grid.svg';

const { __, sprintf } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    BaseControl,
    Button,
    ButtonGroup,
    PanelBody,
    RangeControl,
    SelectControl,
    TabPanel,
} = wp.components;

const {
    BlockControls,
    BlockAlignmentToolbar,
    InspectorControls,
    InnerBlocks,
} = wp.editor;

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
 * Get array for Select element.
 *
 * @returns {Array} array for Select.
 */
const getDefaultColumnSizes = function() {
    const result = [
        {
            label: __( 'Inherit from larger' ),
            value: '',
        }, {
            label: __( 'Auto' ),
            value: 'auto',
        },
    ];

    for ( let k = 1; k <= 12; k++ ) {
        result.push( {
            label: sprintf( k === 1 ? __( '%d Column (%s)' ) : __( '%d Columns (%s)' ), k, `${ Math.round( ( 100 * k / 12 ) * 100 ) / 100 }%` ),
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
const getDefaultColumnOrders = function( columns ) {
    const result = [
        {
            label: __( 'Inherit from larger' ),
            value: '',
        }, {
            label: __( 'Auto' ),
            value: 'auto',
        }, {
            label: __( 'First' ),
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
        label: __( 'Last' ),
        value: 'last',
    } );

    return result;
};

/**
 * Get array for Select element.
 *
 * @returns {Array} array for Select.
 */
const getDefaultColumnDisplay = function() {
    return [
        {
            label: __( 'Inherit from larger' ),
            value: '',
        }, {
            label: __( 'Show' ),
            value: 'show',
        }, {
            label: __( 'Hide' ),
            value: 'hide',
        },
    ];
};

/**
 * Returns the layouts configuration for a given number of columns.
 *
 * @param {object} attributes - block attributes.
 *
 * @return {Object[]} Columns layout configuration.
 */
const getColumnLayouts = ( { columns } ) => {
    const result = [];

    for ( let k = 1; k <= columns; k++ ) {
        result.push( {
            name: `ghostkit ghostkit-col ghostkit-col-${ k }`,
            label: sprintf( __( 'Column %d' ), k ),
            icon: 'columns',
        } );
    }

    return result;
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

class GridBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            columns,
            columnsSettings,
            gap,
            verticalAlign,
            horizontalAlign,
            align,
        } = attributes;

        const tabs = [];

        for ( let val = 1; val <= columns; val++ ) {
            tabs.push( {
                name: 'column_' + val,
                title: val,
                className: 'ghostkit-control-tabs-tab',
            } );
        }

        className = classnames(
            className,
            `ghostkit-grid-cols-${ columns } ghostkit-grid-gap-${ gap }`,
            verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false,
            getGridClass( attributes )
        );

        return (
            <Fragment>
                <BlockControls>
                    <BlockAlignmentToolbar
                        controls={ [ 'wide', 'full' ] }
                        value={ align }
                        onChange={ ( nextAlign ) => {
                            setAttributes( { align: nextAlign } );
                        } }
                    />
                </BlockControls>
                <InspectorControls>
                    <PanelBody>
                        <RangeControl
                            label={ __( 'Columns' ) }
                            value={ columns }
                            onChange={ ( value ) => setAttributes( { columns: value } ) }
                            min={ 2 }
                            max={ 12 }
                        />
                        <BaseControl>
                            <TabPanel tabs={ tabs } className="ghostkit-control-tabs">
                                {
                                    ( colName ) => {
                                        const colSizeSettings = Object.assign( {}, defaultColumnSettings, columnsSettings[ colName ] );
                                        return (
                                            <Fragment>
                                                <SelectControl
                                                    label={ __( 'Size' ) }
                                                    value={ colSizeSettings.size }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.size = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnSizes() }
                                                />
                                                <SelectControl
                                                    label={ __( 'Order' ) }
                                                    value={ colSizeSettings.order }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.order = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnOrders( columns ) }
                                                />
                                                <SelectControl
                                                    label={ __( 'Display' ) }
                                                    value={ colSizeSettings.display }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.display = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnDisplay() }
                                                />

                                                <BaseControl label={ __( 'Responsive' ) }>
                                                    <div className="ghostkit-control-tabs-separator" style={ { marginBottom: -13 } }>
                                                        <span className="fas fa-desktop" />
                                                    </div>
                                                </BaseControl>
                                                <SelectControl
                                                    label={ __( 'Size' ) }
                                                    value={ colSizeSettings.xl_size }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.xl_size = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnSizes() }
                                                />
                                                <SelectControl
                                                    label={ __( 'Order' ) }
                                                    value={ colSizeSettings.xl_order }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.xl_order = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnOrders( columns ) }
                                                />
                                                <SelectControl
                                                    label={ __( 'Display' ) }
                                                    value={ colSizeSettings.xl_display }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.xl_display = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnDisplay() }
                                                />

                                                <div className="ghostkit-control-tabs-separator">
                                                    <span className="fas fa-laptop" />
                                                </div>
                                                <SelectControl
                                                    label={ __( 'Size' ) }
                                                    value={ colSizeSettings.lg_size }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.lg_size = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnSizes() }
                                                />
                                                <SelectControl
                                                    label={ __( 'Order' ) }
                                                    value={ colSizeSettings.lg_order }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.lg_order = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnOrders( columns ) }
                                                />
                                                <SelectControl
                                                    label={ __( 'Display' ) }
                                                    value={ colSizeSettings.lg_display }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.lg_display = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnDisplay() }
                                                />

                                                <div className="ghostkit-control-tabs-separator">
                                                    <span className="fas fa-tablet-alt" />
                                                </div>
                                                <SelectControl
                                                    label={ __( 'Size' ) }
                                                    value={ colSizeSettings.md_size }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.md_size = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnSizes() }
                                                />
                                                <SelectControl
                                                    label={ __( 'Order' ) }
                                                    value={ colSizeSettings.md_order }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.md_order = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnOrders( columns ) }
                                                />
                                                <SelectControl
                                                    label={ __( 'Display' ) }
                                                    value={ colSizeSettings.md_display }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.md_display = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnDisplay() }
                                                />

                                                <div className="ghostkit-control-tabs-separator">
                                                    <span className="fas fa-mobile-alt" />
                                                </div>
                                                <SelectControl
                                                    label={ __( 'Size' ) }
                                                    value={ colSizeSettings.sm_size }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.sm_size = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnSizes() }
                                                />
                                                <SelectControl
                                                    label={ __( 'Order' ) }
                                                    value={ colSizeSettings.sm_order }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.sm_order = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnOrders( columns ) }
                                                />
                                                <SelectControl
                                                    label={ __( 'Display' ) }
                                                    value={ colSizeSettings.sm_display }
                                                    onChange={ ( value ) => {
                                                        colSizeSettings.sm_display = value;
                                                        columnsSettings[ colName ] = colSizeSettings;
                                                        setAttributes( { columnsSettings: Object.assign( {}, columnsSettings ) } );
                                                    } }
                                                    options={ getDefaultColumnDisplay() }
                                                />
                                            </Fragment>
                                        );
                                    }
                                }
                            </TabPanel>
                        </BaseControl>
                        <SelectControl
                            label={ __( 'Vertical alignment' ) }
                            value={ verticalAlign }
                            onChange={ ( value ) => setAttributes( { verticalAlign: value } ) }
                            options={ [
                                {
                                    label: __( 'Start' ),
                                    value: '',
                                }, {
                                    label: __( 'Center' ),
                                    value: 'center',
                                }, {
                                    label: __( 'End' ),
                                    value: 'end',
                                },
                            ] }
                        />
                        <SelectControl
                            label={ __( 'Horizontal alignment' ) }
                            value={ horizontalAlign }
                            onChange={ ( value ) => setAttributes( { horizontalAlign: value } ) }
                            options={ [
                                {
                                    label: __( 'Start' ),
                                    value: '',
                                }, {
                                    label: __( 'Center' ),
                                    value: 'center',
                                }, {
                                    label: __( 'End' ),
                                    value: 'end',
                                }, {
                                    label: __( 'Around' ),
                                    value: 'around',
                                }, {
                                    label: __( 'Between' ),
                                    value: 'between',
                                },
                            ] }
                        />
                        <BaseControl label={ __( 'Gap' ) }>
                            <ButtonGroup>
                                {
                                    [
                                        {
                                            label: __( 'none' ),
                                            value: 'no',
                                        },
                                        {
                                            label: __( 'sm' ),
                                            value: 'sm',
                                        },
                                        {
                                            label: __( 'md' ),
                                            value: 'md',
                                        },
                                        {
                                            label: __( 'lg' ),
                                            value: 'lg',
                                        },
                                    ].map( ( val ) => {
                                        const selected = gap === val.value;

                                        return (
                                            <Button
                                                isLarge
                                                isPrimary={ selected }
                                                aria-pressed={ selected }
                                                onClick={ () => setAttributes( { gap: val.value } ) }
                                                key={ `gap_${ val.label }` }
                                            >
                                                { val.label }
                                            </Button>
                                        );
                                    } )
                                }
                            </ButtonGroup>
                        </BaseControl>
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <InnerBlocks layouts={ getColumnLayouts( attributes ) } />
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/grid';

export const settings = {
    title: __( 'Grid' ),
    description: __( 'Responsive Grid System.' ),
    icon: <img className="ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'layout',
    keywords: [
        __( 'grid' ),
        __( 'column' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
    },
    attributes: {
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

    getEditWrapperProps( attributes ) {
        const { align } = attributes;

        return { 'data-align': align };
    },

    edit: GridBlock,

    save: function( { attributes, className = '' } ) {
        const {
            columns,
            verticalAlign,
            horizontalAlign,
            gap,
        } = attributes;

        className = classnames(
            className,
            `ghostkit-grid-cols-${ columns } ghostkit-grid-gap-${ gap }`,
            verticalAlign ? `ghostkit-grid-align-items-${ verticalAlign }` : false,
            horizontalAlign ? `ghostkit-grid-justify-content-${ horizontalAlign }` : false,
            getGridClass( attributes )
        );

        return (
            <div className={ className }>
                <InnerBlocks.Content />
            </div>
        );
    },
};
