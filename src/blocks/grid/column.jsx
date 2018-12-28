// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/grid.svg';
import getColClass from './get-col-class.jsx';
import ApplyFilters from '../_components/apply-filters.jsx';
import TabPanelScreenSizes from '../_components/tab-panel-screen-sizes.jsx';

const { GHOSTKIT } = window;

const { ghostkitVariables } = window;
const { __, sprintf } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    BaseControl,
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
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

class GridColumnBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
        } = this.props;

        const {
            variant,

            stickyContent,
            stickyContentTop,
            stickyContentBottom,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'grid_column' );

        const iconsColor = {};
        if ( ghostkitVariables && ghostkitVariables.media_sizes && Object.keys( ghostkitVariables.media_sizes ).length ) {
            Object.keys( ghostkitVariables.media_sizes ).forEach( ( media ) => {
                let sizeName = 'size';
                let orderName = 'order';

                if ( media !== 'all' ) {
                    sizeName = `${ media }_${ sizeName }`;
                    orderName = `${ media }_${ orderName }`;
                }

                if ( ! attributes[ sizeName ] && ! attributes[ orderName ] ) {
                    iconsColor[ media ] = '#cccccc';
                }
            } );
        }

        return (
            <Fragment>
                <InspectorControls>
                    <ApplyFilters name="ghostkit.editor.controls" attribute="columnSettings" props={ this.props }>
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
                            <TabPanelScreenSizes iconsColor={ iconsColor }>
                                {
                                    ( tabData ) => {
                                        let sizeName = 'size';
                                        let orderName = 'order';

                                        if ( tabData.name !== 'all' ) {
                                            sizeName = `${ tabData.name }_${ sizeName }`;
                                            orderName = `${ tabData.name }_${ orderName }`;
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
                                            </Fragment>
                                        );
                                    }
                                }
                            </TabPanelScreenSizes>
                        </PanelBody>
                    </ApplyFilters>
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
                    { ! isSelected ? (
                        <div className="ghostkit-column-button-select">
                            { __( 'Select Column' ) }
                        </div>
                    ) : '' }
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

    edit: GridColumnBlock,

    getEditWrapperProps( attributes ) {
        return { 'data-col-class': getColClass( attributes ) };
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
};
