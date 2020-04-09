/**
 * WordPress dependencies
 */
const { merge } = window.lodash;

const { __ } = wp.i18n;

const {
    addFilter,
} = wp.hooks;

const {
    Component,
    Fragment,
} = wp.element;

const {
    registerBlockStyle,
} = wp.blocks;

const {
    createHigherOrderComponent,
} = wp.compose;

const { InspectorControls } = wp.blockEditor;

const {
    PanelBody,
} = wp.components;

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import { hasClass } from '../../utils/classes-replacer';

/**
 * Register additional list styles.
 */
registerBlockStyle( 'core/list', {
    name: 'styled',
    label: __( 'Styled', '@@text_domain' ),
} );
registerBlockStyle( 'core/list', {
    name: 'icon',
    label: __( 'Icon', '@@text_domain' ),
} );
registerBlockStyle( 'core/list', {
    name: 'none',
    label: __( 'None', '@@text_domain' ),
} );

/**
 * Icon Lists Extension.
 */

/**
 * Extend block attributes with unique id.
 *
 * @param {Object} blockSettings Original block settings.
 * @param {String} name Original block name.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( blockSettings, name ) {
    if ( 'core/list' === name ) {
        if ( ! blockSettings.attributes.ghostkitListIcon ) {
            blockSettings.attributes.ghostkitListIcon = {
                type: 'string',
            };
        }
        if ( ! blockSettings.attributes.ghostkitListIconColor ) {
            blockSettings.attributes.ghostkitListIconColor = {
                type: 'string',
            };
        }
    }

    return blockSettings;
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
    class GhostKitIconListWrapper extends Component {
        render() {
            const props = this.props;

            const {
                setAttributes,
                attributes,
            } = props;

            const {
                ghostkitListIcon,
                ghostkitListIconColor,
                className,
            } = attributes;

            if ( 'core/list' !== props.name || ! hasClass( className, 'is-style-icon' ) ) {
                return <OriginalComponent { ...props } />;
            }

            // add new display controls.
            return (
                <Fragment>
                    <OriginalComponent
                        { ...props }
                        setState={ this.setState }
                    />
                    <InspectorControls>
                        <PanelBody
                            title={ __( 'Icon list settings', '@@text_domain' ) }
                            initialOpen={ true }
                        >
                            <IconPicker
                                label={ __( 'Icon', '@@text_domain' ) }
                                value={ ghostkitListIcon }
                                onChange={ ( value ) => setAttributes( { ghostkitListIcon: value } ) }
                            />
                            <ColorPicker
                                label={ __( 'Color', '@@text_domain' ) }
                                value={ ghostkitListIconColor }
                                onChange={ ( val ) => setAttributes( { ghostkitListIconColor: val } ) }
                                alpha={ true }
                            />
                        </PanelBody>
                    </InspectorControls>
                </Fragment>
            );
        }
    }

    return GhostKitIconListWrapper;
}, 'withInspectorControl' );

/**
 * Add custom styles to element in editor.
 *
 * @param {Object} customStyles Additional element styles object.
 * @param {Object} props Element props.
 *
 * @return {Object} Additional element styles object.
 */
function addEditorCustomStyles( customStyles, props ) {
    const result = {};

    if ( props.name !== 'core/list' || ! hasClass( props.attributes.className, 'is-style-icon' ) ) {
        return customStyles;
    }

    if ( props.attributes.ghostkitListIcon ) {
        result[ '--gkt-icon-lists--decoration' ] = `url('data:image/svg+xml;utf8,${ encodeURI( props.attributes.ghostkitListIcon ) }')`;
    }
    if ( props.attributes.ghostkitListIconColor ) {
        result[ '--gkt-icon-lists--decoration__color' ] = props.attributes.ghostkitListIconColor;
    }

    if ( props.attributes.ghostkitListIcon || props.attributes.ghostkitListIconColor ) {
        customStyles = merge( customStyles, result );
    }

    return customStyles;
}

// Init filters.
addFilter( 'blocks.registerBlockType', 'ghostkit/icon-list/additional-attributes', addAttribute );
addFilter( 'editor.BlockEdit', 'ghostkit/icon-list/additional-attributes', withInspectorControl, 9 );
addFilter( 'ghostkit.blocks.customStyles', 'ghostkit/icon-list/editor-custom-styles', addEditorCustomStyles );
