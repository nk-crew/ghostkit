/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import checkCoreBlock from '../check-core-block';
import getIcon from '../../utils/get-icon';
import CodeEditor from '../../components/code-editor';
import ActiveIndicator from '../../components/active-indicator';
import Modal from '../../components/modal';
import { maybeEncode, maybeDecode } from '../../utils/encode-decode';

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

const { InspectorControls } = wp.blockEditor;

const {
    PanelBody,
    Button,
} = wp.components;

const {
    GHOSTKIT,
} = window;

const placeholder = 'selector {\n\n}';
let initialOpenPanel = false;

/**
 * Custom CSS Component.
 */
class CustomCSSComponent extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            defaultPlaceholder: placeholder,
            modalOpened: false,
        };

        this.getEditor = this.getEditor.bind( this );
    }

    getEditor() {
        const {
            setAttributes,
            attributes,
        } = this.props;

        const {
            ghostkitCustomCSS = '',
        } = attributes;

        return (
            <Fragment>
                <CodeEditor
                    mode="css"
                    onChange={ ( value ) => {
                        if ( value !== placeholder ) {
                            setAttributes( {
                                ghostkitCustomCSS: maybeEncode( value ),
                            } );
                        }
                        if ( this.state.defaultPlaceholder ) {
                            this.setState( {
                                defaultPlaceholder: '',
                            } );
                        }
                    } }
                    value={ maybeDecode( ghostkitCustomCSS || this.state.defaultPlaceholder ) }
                    maxLines={ 20 }
                    minLines={ 5 }
                    height="300px"
                />
                <p style={ { marginBottom: 20 } } />
                { /* eslint-disable-next-line react/no-danger */ }
                <p dangerouslySetInnerHTML={ { __html: __( 'Use %s rule to change block styles.', '@@text_domain' ).replace( '%s', '<code>selector</code>' ) } } />
                <p>{ __( 'Example:', '@@text_domain' ) }</p>
                <pre className="ghostkit-control-pre-custom-css">
                    { `selector {
  background-color: #2F1747;
}

selector p {
  color: #2F1747;
}` }
                </pre>
            </Fragment>
        );
    }

    render() {
        const { props } = this;
        let allow = false;

        if ( GHOSTKIT.hasBlockSupport( props.name, 'customCSS', false ) ) {
            allow = true;
        }

        if ( ! allow ) {
            allow = checkCoreBlock( props.name );
            allow = applyFilters(
                'ghostkit.blocks.allowCustomCSS',
                allow,
                props,
                props.name
            );
        }

        if ( ! allow ) {
            return null;
        }

        const {
            attributes,
        } = this.props;

        const {
            modalOpened,
        } = this.state;

        const {
            ghostkitCustomCSS = '',
        } = attributes;

        // add new custom CSS control.
        return (
            <InspectorControls>
                <PanelBody
                    title={ (
                        <Fragment>
                            <span className="ghostkit-ext-icon">
                                { getIcon( 'extension-custom-css' ) }
                            </span>
                            <span>{ __( 'Custom CSS', '@@text_domain' ) }</span>
                            { ghostkitCustomCSS ? (
                                <ActiveIndicator />
                            ) : '' }
                        </Fragment>
                    ) }
                    initialOpen={ initialOpenPanel }
                    onToggle={ () => {
                        initialOpenPanel = ! initialOpenPanel;
                    } }
                >
                    { this.getEditor() }

                    <Button
                        isSecondary
                        onClick={ () => this.setState( { modalOpened: ! modalOpened } ) }
                    >
                        { __( 'Open in Modal', '@@text_domain' ) }
                    </Button>
                    { modalOpened ? (
                        <Modal
                            title={ __( 'Custom CSS', '@@text_domain' ) }
                            position="top"
                            size="md"
                            onRequestClose={ () => this.setState( { modalOpened: ! modalOpened } ) }
                        >
                            { this.getEditor() }
                        </Modal>
                    ) : '' }
                </PanelBody>
            </InspectorControls>
        );
    }
}

/**
 * Allow custom CSS in blocks.
 *
 * @param {Boolean} allow Original block allow custom CSS.
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function allowCustomStyles( allow, settings ) {
    if ( GHOSTKIT.hasBlockSupport( settings, 'customCSS', false ) ) {
        allow = true;
    }

    if ( ! allow ) {
        allow = checkCoreBlock( settings.name );
        allow = applyFilters(
            'ghostkit.blocks.allowCustomCSS',
            allow,
            settings,
            settings.name
        );
    }
    return allow;
}

/**
 * Extend ghostkit block attributes with custom CSS.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
function addAttribute( settings ) {
    let allow = false;

    if ( GHOSTKIT.hasBlockSupport( settings, 'customCSS', false ) ) {
        allow = true;
    }

    if ( ! allow ) {
        allow = checkCoreBlock( settings.name );
        allow = applyFilters(
            'ghostkit.blocks.allowCustomCSS',
            allow,
            settings,
            settings.name
        );
    }

    if ( allow ) {
        if ( ! settings.attributes.ghostkitCustomCSS ) {
            settings.attributes.ghostkitCustomCSS = {
                type: 'string',
                default: '',
            };

            // add to deprecated items.
            if ( settings.deprecated && settings.deprecated.length ) {
                settings.deprecated.forEach( ( item, i ) => {
                    if ( settings.deprecated[ i ].attributes ) {
                        settings.deprecated[ i ].attributes.ghostkitCustomCSS = maybeDecode( settings.attributes.ghostkitCustomCSS );
                    }
                } );
            }
        }
    }
    return settings;
}

/**
 * Override the default edit UI to include a new block inspector control for
 * assigning the custom CSS if needed.
 *
 * @param {function|Component} BlockEdit Original component.
 *
 * @return {string} Wrapped component.
 */
const withInspectorControl = createHigherOrderComponent( ( BlockEdit ) => function( props ) {
    return (
        <Fragment>
            <BlockEdit { ...props } />
            <CustomCSSComponent { ...props } />
        </Fragment>
    );
}, 'withInspectorControl' );

/**
 * Add custom styles to element in editor.
 *
 * @param {String} customStylesOutput Additional element styles.
 * @param {Object} props Element props.
 *
 * @return {String} Additional element styles object.
 */
function addEditorCustomStylesOutput( customStylesOutput, props ) {
    const {
        ghostkitClassname,
        ghostkitCustomCSS,
    } = props.attributes;

    const ghostkitCustomCSSDecode = maybeDecode( ghostkitCustomCSS );

    if ( ghostkitCustomCSSDecode && ghostkitClassname ) {
        customStylesOutput += ` ${ ghostkitCustomCSSDecode.replace( /selector/g, `.${ ghostkitClassname }` ) }`;
    }

    return customStylesOutput;
}

// Init filters.
addFilter( 'ghostkit.blocks.allowCustomStyles', 'ghostkit/customCSS/allow-custom-styles', allowCustomStyles );
addFilter( 'ghostkit.blocks.withCustomStyles', 'ghostkit/customCSS/additional-attributes', addAttribute );
addFilter( 'ghostkit.editor.customStylesOutput', 'ghostkit/customCSS/editor-custom-output', addEditorCustomStylesOutput );
addFilter( 'editor.BlockEdit', 'ghostkit/customCSS/additional-attributes', withInspectorControl );
