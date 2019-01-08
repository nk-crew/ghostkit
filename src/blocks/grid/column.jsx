// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/grid.svg';

const { GHOSTKIT } = window;

const { __, sprintf } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    BaseControl,
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
    TabPanel,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
} = wp.editor;

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
const getDefaultColumnOrders = function( columns = 12 ) {
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
 * Returns the ready to use className for grid column.
 *
 * @param {object} attributes - block attributes.
 *
 * @return {String} Classname for Grid container.
 */
const getColClass = ( attributes ) => {
    let result = 'ghostkit-col';

    Object.keys( attributes ).map( ( key ) => {
        if ( attributes[ key ] ) {
            let prefix = key.split( '_' )[ 0 ];
            let type = key.split( '_' )[ 1 ];

            if ( ! type ) {
                type = prefix;
                prefix = '';
            }

            if ( type && ( type === 'size' || type === 'order' ) ) {
                prefix = prefix ? `-${ prefix }` : '';
                type = type === 'size' ? '' : `-${ type }`;
                
                if ( result.indexOf( `gg-col${ type }${ prefix }` ) < 0 ) {
                    result = classnames(
                        result,
                        `ghostkit-col${ type }${ prefix || '' }${ attributes[ key ] !== 'auto' ? `-${ attributes[ key ] }` : '' }`
                    );
                }
            }
        }
    } );

    return result;
};

class GridColumnBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        const {
            variant,

            stickyContent,
            stickyContentTop,
            stickyContentBottom,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'grid_column' );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        { Object.keys( availableVariants ).length > 1 ? (
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        ) : '' }
                        <TabPanel
                            className="ghostkit-control-tabs"
                            tabs={ [
                                {
                                    name: 'all',
                                    title: <span className="fas fa-tv" />,
                                    className: 'ghostkit-control-tabs-tab',
                                },
                                {
                                    name: 'xl',
                                    title: <span className="fas fa-desktop" />,
                                    className: 'ghostkit-control-tabs-tab',
                                },
                                {
                                    name: 'lg',
                                    title: <span className="fas fa-laptop" />,
                                    className: 'ghostkit-control-tabs-tab',
                                },
                                {
                                    name: 'md',
                                    title: <span className="fas fa-tablet-alt" />,
                                    className: 'ghostkit-control-tabs-tab',
                                },
                                {
                                    name: 'sm',
                                    title: <span className="fas fa-mobile-alt" />,
                                    className: 'ghostkit-control-tabs-tab',
                                },
                            ] }>
                            {
                                ( tabData ) => {
                                    let sizeName = 'size';
                                    let orderName = 'order';

                                    if ( tabData.name !== 'all' ) {
                                        sizeName = `${ tabData.name }_${ sizeName }`;
                                        orderName = `${ tabData.name }_${ orderName }`;
                                    }

                                    let note = __( 'Will be applied to all devices' );

                                    switch ( tabData.name ) {
                                    case 'xl':
                                        note = __( 'Will be applied to devices with screen width <= 1200px' );
                                        break;
                                    case 'lg':
                                        note = __( 'Will be applied to devices with screen width <= 992px' );
                                        break;
                                    case 'md':
                                        note = __( 'Will be applied to devices with screen width <= 768px' );
                                        break;
                                    case 'sm':
                                        note = __( 'Will be applied to devices with screen width <= 576px' );
                                        break;
                                    }

                                    return (
                                        <Fragment>
                                            <SelectControl
                                                label={ __( 'Size' ) }
                                                value={ attributes[ sizeName ] }
                                                onChange={ ( value ) => {
                                                    const result = {};
                                                    result[ sizeName ] = value;
                                                    setAttributes( result );
                                                } }
                                                options={ getDefaultColumnSizes() }
                                            />
                                            <SelectControl
                                                label={ __( 'Order' ) }
                                                value={ attributes[ orderName ] }
                                                onChange={ ( value ) => {
                                                    const result = {};
                                                    result[ orderName ] = value;
                                                    setAttributes( result );
                                                } }
                                                options={ getDefaultColumnOrders() }
                                            />
                                            <p><em>{ note }</em></p>
                                        </Fragment>
                                    );
                                }
                            }
                        </TabPanel>
                    </PanelBody>
                    <PanelBody>
                        <BaseControl>
                            <ToggleControl
                                label={ __( 'Sticky content' ) }
                                checked={ !! stickyContent }
                                onChange={ ( value ) => setAttributes( { stickyContent: value } ) }
                            />
                            <p><em>{ __( '`position: sticky` will be applied to column content. Don\'t forget to set top or bottom value in pixels.' ) }</em></p>
                            { stickyContent ? (
                                <Fragment>
                                    <TextControl
                                        label={ __( 'Top' ) }
                                        type="number"
                                        value={ stickyContentTop }
                                        onChange={ ( value ) => setAttributes( { stickyContentTop: parseInt( value, 10 ) } ) }
                                    />
                                    <TextControl
                                        label={ __( 'Bottom' ) }
                                        type="number"
                                        value={ stickyContentBottom }
                                        onChange={ ( value ) => setAttributes( { stickyContentBottom: parseInt( value, 10 ) } ) }
                                    />
                                </Fragment>
                            ) : '' }
                        </BaseControl>
                    </PanelBody>
                </InspectorControls>
                <div>
                    <InnerBlocks templateLock={ false } />
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/grid-column';

export const settings = {
    title: __( 'Column' ),
    parent: [ 'ghostkit/grid' ],
    description: __( 'A single column within a grid block.' ),
    icon: elementIcon,
    category: 'ghostkit',
    supports: {
        html: false,
        className: false,
        anchor: true,
        ghostkitStyles: true,
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

    edit: GridColumnBlock,

    getEditWrapperProps( attributes ) {
        return { 'data-col-class': getColClass( attributes ) };
    },

    save: function( { attributes } ) {
        const {
            variant,
            stickyContent,
        } = attributes;

        let {
            className,
        } = attributes;

        className = classnames(
            className,
            getColClass( attributes )
        );

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
};
