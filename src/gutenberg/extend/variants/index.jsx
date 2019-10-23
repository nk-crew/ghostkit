/**
 * WordPress dependencies
 */
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

const {
    hasBlockSupport,
} = wp.blocks;

const { InspectorControls } = wp.blockEditor;

const {
    PanelBody,
    SelectControl,
} = wp.components;

/**
 * Internal dependencies
 */
import { getActiveClass, replaceClass } from '../../utils/classes-replacer';

const { GHOSTKIT } = window;

let initialOpenPanel = false;

/**
 * Get variant slug.
 *
 * @param {String} name block name.
 *
 * @return {String} slug.
 */
function getVariantSlug( name ) {
    let result = name.split( '/' )[ 1 ].replace( /\-/g, '_' );
    if ( 'tabs_v2' === result ) {
        result = 'tabs';
    } else if ( 'button' === result ) {
        result = 'button_wrapper';
    } else if ( 'button_single' === result ) {
        result = 'button';
    }

    return result;
}

/**
 * Get variant classname prefix.
 *
 * @param {String} name block name.
 *
 * @return {String} classname prefix.
 */
function getVariantClassNamePrefix( name ) {
    let result = name.replace( '/', '-' );

    if ( 'ghostkit-button-single' === result ) {
        result = 'ghostkit-button';
    } else if ( 'ghostkit-button' === result ) {
        result = 'ghostkit-button-wrapper';
    } else if ( 'ghostkit-tabs-v2' === result ) {
        result = 'ghostkit-tabs';
    }

    return result ? `${ result }-variant` : result;
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

            if ( ! /^ghostkit/.test( props.name ) || ! hasBlockSupport( props.name, 'customClassName', true ) ) {
                return <OriginalComponent { ...props } />;
            }

            const {
                attributes,
                setAttributes,
            } = props;

            const {
                className,
            } = attributes;

            const availableVariants = GHOSTKIT.getVariants( getVariantSlug( props.name ) );

            if ( Object.keys( availableVariants ).length < 2 ) {
                return <OriginalComponent { ...props } />;
            }

            const variantClassNamePrefix = getVariantClassNamePrefix( props.name );
            const variant = getActiveClass( className, variantClassNamePrefix, true );

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
                                onChange={ ( value ) => {
                                    const newClassName = replaceClass( className, variantClassNamePrefix, value === 'default' ? '' : value );

                                    setAttributes( {
                                        className: newClassName,
                                    } );
                                } }
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

// Init filters.
addFilter( 'editor.BlockEdit', 'ghostkit/variants/additional-controls', withInspectorControl );
