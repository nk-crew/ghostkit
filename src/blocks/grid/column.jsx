// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/grid.svg';
import getColClass from './get-col-class.jsx';
import ApplyFilters from '../_components/apply-filters.jsx';
import TabPanelScreenSizes from '../_components/tab-panel-screen-sizes.jsx';
import deprecatedArray from './deprecated-column.jsx';
import ColorPicker from '../_components/color-picker.jsx';

const { GHOSTKIT } = window;

const { ghostkitVariables } = window;
const { __, sprintf } = wp.i18n;
const { Component, Fragment } = wp.element;
const { createHigherOrderComponent } = wp.compose;
const { addFilter } = wp.hooks;
const {
    BaseControl,
    PanelBody,
    SelectControl,
    ToggleControl,
    TextControl,
} = wp.components;

const {
    applyFilters,
} = wp.hooks;

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

            awb_color, // eslint-disable-line
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

        // background
        let background = '';
        // eslint-disable-next-line
        if ( awb_color ) {
            background = (
                <div className="awb-gutenberg-preview-block">
                    <div className="nk-awb-overlay" style={ { 'background-color': awb_color } }></div>
                </div>
            );
        }
        background = applyFilters( 'ghostkit.editor.grid-column.background', background, this.props );

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
                    <ApplyFilters name="ghostkit.editor.controls" attribute="background" props={ this.props }>
                        <PanelBody
                            title={ __( 'Background' ) }
                            initialOpen={ false }
                        >
                            <ColorPicker
                                label={ __( 'Background Color' ) }
                                value={ awb_color } // eslint-disable-line
                                onChange={ ( val ) => setAttributes( { awb_color: val } ) }
                                alpha={ true }
                            />
                            <p>
                                { __( 'Install AWB plugin to set image, video backgrounds with parallax support.' ) }
                            </p>
                            <a
                                className="components-button is-button is-default is-small"
                                href="https://wordpress.org/plugins/advanced-backgrounds/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                { __( 'Install' ) }
                            </a>
                        </PanelBody>
                    </ApplyFilters>
                </InspectorControls>
                { background }
                <div className="ghostkit-col-content">
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

        // AWB support.
        awb_type: {
            type: 'string',
            default: 'color',
        },
        awb_color: {
            type: 'string',
            default: '',
        },
    },

    edit: GridColumnBlock,

    save: function( props ) {
        let className = getColClass( props );
        const {
            awb_color, // eslint-disable-line
        } = props.attributes;

        // background
        let background = '';
        // eslint-disable-next-line
        if ( awb_color ) {
            background = (
                <div className="nk-awb">
                    <div className="nk-awb-wrap" data-awb-type="color">
                        <div className="nk-awb-overlay" style={ { 'background-color': awb_color } }></div>
                    </div>
                </div>
            );
        }

        background = applyFilters( 'ghostkit.blocks.grid-column.background', background, {
            ...{
                name,
            },
            ...props,
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
    },
    deprecated: deprecatedArray,
};

// getEditWrapperProps

/**
 * Override the default block element to add column classes on wrapper.
 *
 * @param  {Function} BlockListBlock Original component
 * @return {Function}                Wrapped component
 */
export const withClasses = createHigherOrderComponent( ( BlockListBlock ) => (
    ( props ) => {
        const { name: blockName } = props;
        let className = props.className;

        if ( 'ghostkit/grid-column' === blockName ) {
            className = classnames( className, getColClass( props, true ) );
        }

        return <BlockListBlock { ...props } className={ className } />;
    }
) );

addFilter( 'editor.BlockListBlock', 'core/editor/grid-column/with-classes', withClasses );
