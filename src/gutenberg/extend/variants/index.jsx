// External Dependencies.
import classnames from 'classnames/dedupe';

const { __ } = wp.i18n;

const {
    addFilter,
} = wp.hooks;

const {
    Component,
    Fragment,
} = wp.element;

const {
    createHigherOrderComponent,
} = wp.compose;

const { InspectorControls } = wp.editor;

const {
    PanelBody,
    SelectControl,
} = wp.components;

const { GHOSTKIT } = window;

let initialOpenPanel = false;

/**
 * Extend ghostkit block attributes with display.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( settings ) {
    if ( ! /^ghostkit/.test( settings.name ) ) {
        return settings;
    }

    if ( ! settings.attributes.variant ) {
        settings.attributes.variant = {
            type: 'string',
            default: 'default',
        };

        // add to deprecated items.
        if ( settings.deprecated && settings.deprecated.length ) {
            settings.deprecated.forEach( ( item, i ) => {
                if ( settings.deprecated[ i ].attributes ) {
                    settings.deprecated[ i ].attributes.variant = settings.attributes.variant;
                }
            } );
        }
    }
    return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom display if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent( ( OriginalComponent ) => {
    class GhostKitVariantsWrapper extends Component {
        render() {
            const props = this.props;

            if ( ! /^ghostkit/.test( props.name ) ) {
                return <OriginalComponent { ...props } />;
            }

            const {
                attributes,
                setAttributes,
            } = props;
            const {
                variant,
            } = attributes;

            let variantBlockName = props.name.split( '/' )[ 1 ].replace( /\-/g, '_' );
            if ( 'tabs_v2' === variantBlockName ) {
                variantBlockName = 'tabs';
            } else if ( 'button' === variantBlockName ) {
                variantBlockName = 'button_wrapper';
            } else if ( 'button_single' === variantBlockName ) {
                variantBlockName = 'button';
            }

            const availableVariants = GHOSTKIT.getVariants( variantBlockName );

            if ( Object.keys( availableVariants ).length < 2 ) {
                return <OriginalComponent { ...props } />;
            }

            // add new display controls.
            return (
                <Fragment>
                    <InspectorControls>
                        <PanelBody
                            title={ __( 'Variants' ) }
                            initialOpen={ initialOpenPanel }
                            onToggle={ () => {
                                initialOpenPanel = ! initialOpenPanel;
                            } }
                        >
                            <SelectControl
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        </PanelBody>
                    </InspectorControls>
                    <OriginalComponent
                        { ...props }
                        setState={ this.setState }
                    />
                </Fragment>
            );
        }
    }

    return GhostKitVariantsWrapper;
}, 'withInspectorControl' );

/**
 * Add variant classname.
 *
 * @param {string} classname - current classname.
 * @param {object} { name, attributes } - block props.
 * @return {string} - changed classname.
 */
function addClassname( classname, { name, attributes } ) {
    if ( attributes && attributes.variant && 'default' !== attributes.variant ) {
        // change some slugs
        if ( 'ghostkit/button-single' === name ) {
            name = 'ghostkit-button';
        }
        if ( 'ghostkit/button' === name ) {
            name = 'ghostkit-button-wrapper';
        }
        if ( 'ghostkit/tabs-v2' === name ) {
            name = 'ghostkit-tabs';
        }

        classname = classnames(
            classname,
            `${ name.replace( '/', '-' ) }-variant-${ attributes.variant }`
        );
    }

    return classname;
}

// Init filters.
addFilter( 'blocks.registerBlockType', 'ghostkit/variants/additional-attributes', addAttribute );
addFilter( 'editor.BlockEdit', 'ghostkit/variants/additional-controls', withInspectorControl );
addFilter( 'ghostkit.editor.className', 'ghostkit/variants/additional-classname', addClassname );
addFilter( 'ghostkit.blocks.className', 'ghostkit/variants/additional-classname', addClassname );
