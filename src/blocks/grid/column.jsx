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

                result = classnames(
                    result,
                    `ghostkit-col${ type }${ prefix || '' }${ attributes[ key ] !== 'auto' ? `-${ attributes[ key ] }` : '' }`
                );
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

            /* eslint-disable camelcase */
            sm_size,
            sm_order,

            md_size,
            md_order,

            lg_size,
            lg_order,

            xl_size,
            xl_order,
            /* stylelint-enable camelcase */

            size,
            order,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'grid-column' );

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
                        <BaseControl>
                            <SelectControl
                                label={ __( 'Size' ) }
                                value={ size }
                                onChange={ ( value ) => {
                                    setAttributes( { size: value } );
                                } }
                                options={ getDefaultColumnSizes() }
                            />
                            <SelectControl
                                label={ __( 'Order' ) }
                                value={ order }
                                onChange={ ( value ) => {
                                    setAttributes( { order: value } );
                                } }
                                options={ getDefaultColumnOrders() }
                            />
                        </BaseControl>
                    </PanelBody>

                    <PanelBody>
                        <BaseControl label={ __( 'Responsive' ) }>
                            <div className="ghostkit-control-tabs-separator" style={ { marginBottom: -13 } }>
                                <span className="fas fa-desktop" />
                            </div>
                        </BaseControl>
                        <SelectControl
                            label={ __( 'Size' ) }
                            value={ xl_size }
                            onChange={ ( value ) => {
                                setAttributes( { xl_size: value } );
                            } }
                            options={ getDefaultColumnSizes() }
                        />
                        <SelectControl
                            label={ __( 'Order' ) }
                            value={ xl_order }
                            onChange={ ( value ) => {
                                setAttributes( { xl_order: value } );
                            } }
                            options={ getDefaultColumnOrders() }
                        />

                        <div className="ghostkit-control-tabs-separator">
                            <span className="fas fa-laptop" />
                        </div>
                        <SelectControl
                            label={ __( 'Size' ) }
                            value={ lg_size }
                            onChange={ ( value ) => {
                                setAttributes( { lg_size: value } );
                            } }
                            options={ getDefaultColumnSizes() }
                        />
                        <SelectControl
                            label={ __( 'Order' ) }
                            value={ lg_order }
                            onChange={ ( value ) => {
                                setAttributes( { lg_order: value } );
                            } }
                            options={ getDefaultColumnOrders() }
                        />

                        <div className="ghostkit-control-tabs-separator">
                            <span className="fas fa-tablet-alt" />
                        </div>
                        <SelectControl
                            label={ __( 'Size' ) }
                            value={ md_size }
                            onChange={ ( value ) => {
                                setAttributes( { md_size: value } );
                            } }
                            options={ getDefaultColumnSizes() }
                        />
                        <SelectControl
                            label={ __( 'Order' ) }
                            value={ md_order }
                            onChange={ ( value ) => {
                                setAttributes( { md_order: value } );
                            } }
                            options={ getDefaultColumnOrders() }
                        />

                        <div className="ghostkit-control-tabs-separator">
                            <span className="fas fa-mobile-alt" />
                        </div>
                        <SelectControl
                            label={ __( 'Size' ) }
                            value={ sm_size }
                            onChange={ ( value ) => {
                                setAttributes( { sm_size: value } );
                            } }
                            options={ getDefaultColumnSizes() }
                        />
                        <SelectControl
                            label={ __( 'Order' ) }
                            value={ sm_order }
                            onChange={ ( value ) => {
                                setAttributes( { sm_order: value } );
                            } }
                            options={ getDefaultColumnOrders() }
                        />
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
    icon: <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'layout',
    supports: {
        html: false,
        className: false,
        // ghostkitStyles: true,
        // ghostkitIndents: true,
        // ghostkitDisplay: true,
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
    },

    edit: GridColumnBlock,

    getEditWrapperProps( attributes ) {
        return { 'data-col-class': getColClass( attributes ) };
    },

    save: function( { attributes } ) {
        const {
            variant,
        } = attributes;

        let {
            className,
        } = attributes;

        className = classnames(
            className,
            getColClass( attributes )
        );

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-col-variant-${ variant }` );
        }

        return (
            <div className={ className }>
                <InnerBlocks.Content />
            </div>
        );
    },
};
