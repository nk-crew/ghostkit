const { __ } = wp.i18n;

const {
    applyFilters,
    addFilter,
} = wp.hooks;

const {
    Component,
    Fragment,
} = wp.element;

const {
    createHigherOrderComponent,
} = wp.compose;

const {
    hasBlockSupport,
} = wp.blocks;

const { InspectorControls } = wp.editor;

const {
    PanelBody,
    SelectControl,
} = wp.components;

let initialOpenPanel = false;

/**
 * Extend ghostkit block attributes with SR.
 *
 * @param {Object} settings Original block settings.
 * @param {String} name Original block name.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( settings, name ) {
    let allow = false;

    if ( hasBlockSupport( settings, 'ghostkitSR', false ) ) {
        allow = true;
    }

    if ( ! allow ) {
        allow = settings && settings.attributes && applyFilters(
            'ghostkit.blocks.registerBlockType.allowCustomSR',
            name && /^core/.test( name ),
            settings,
            name
        );
    }

    if ( allow ) {
        if ( ! settings.attributes.ghostkitSR ) {
            settings.attributes.ghostkitSR = {
                type: 'string',
                default: '',
            };

            // add to deprecated items.
            if ( settings.deprecated && settings.deprecated.length ) {
                settings.deprecated.forEach( ( item, i ) => {
                    if ( settings.deprecated[ i ].attributes ) {
                        settings.deprecated[ i ].attributes.ghostkitSR = settings.attributes.ghostkitSR;
                    }
                } );
            }
        }
    }
    return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom attribute if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent( ( OriginalComponent ) => {
    class GhostkitSRWrapper extends Component {
        render() {
            const props = this.props;
            let allow = false;

            const {
                ghostkitSR,
            } = this.props.attributes;

            const {
                setAttributes,
            } = this.props;

            if ( hasBlockSupport( props.name, 'ghostkitSR', false ) ) {
                allow = true;
            }

            if ( ! allow ) {
                allow = applyFilters(
                    'ghostkit.blocks.allowCustomSR',
                    props.name && /^core/.test( props.name ),
                    props,
                    props.name
                );
            }

            if ( ! allow ) {
                return <OriginalComponent { ...props } />;
            }

            // add new SR controls.
            return (
                <Fragment>
                    <OriginalComponent
                        { ...props }
                        setState={ this.setState }
                    />
                    <InspectorControls>
                        <PanelBody
                            title={ (
                                <Fragment>
                                    { __( 'Animate on Scroll' ) }
                                    <span className="ghostkit-ext-badge">{ __( 'ext' ) }</span>
                                </Fragment>
                            ) }
                            initialOpen={ initialOpenPanel }
                            onToggle={ () => {
                                initialOpenPanel = ! initialOpenPanel;
                            } }
                        >
                            <SelectControl
                                value={ ghostkitSR }
                                onChange={ ( val ) => setAttributes( { ghostkitSR: val } ) }
                                options={ [
                                    {
                                        label: __( 'None' ),
                                        value: '',
                                    }, {
                                        label: __( 'Fade' ),
                                        value: 'fade',
                                    }, {
                                        label: __( 'Fade Up' ),
                                        value: 'fade-up',
                                    }, {
                                        label: __( 'Zoom' ),
                                        value: 'zoom',
                                    }, {
                                        label: __( 'Zoom Up' ),
                                        value: 'zoom-up',
                                    },
                                ] }
                            />
                        </PanelBody>
                    </InspectorControls>
                </Fragment>
            );
        }
    }

    return GhostkitSRWrapper;
}, 'withInspectorControl' );

/**
 * Override props assigned to save component to inject custom styles.
 * This is only applied if the block's save result is an
 * element and not a markup string.
 *
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 *
 * @return {Object} Filtered props applied to save element.
 */
function addSaveProps( extraProps, blockType, attributes ) {
    if ( attributes.ghostkitSR ) {
        extraProps[ 'data-ghostkit-sr' ] = attributes.ghostkitSR;
    }

    return extraProps;
}

// Init filters.
addFilter( 'blocks.registerBlockType', 'ghostkit/sr/additional-attributes', addAttribute );
addFilter( 'editor.BlockEdit', 'ghostkit/sr/additional-attributes', withInspectorControl );
addFilter( 'blocks.getSaveContent.extraProps', 'ghostkit/sr/save-props', addSaveProps );
