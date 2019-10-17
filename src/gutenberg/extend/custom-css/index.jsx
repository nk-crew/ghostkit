/**
 * Import CSS
 */
import './editor.scss';

/**
 * WordPress dependencies
 */
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

const { InspectorControls } = wp.editor;

const {
    PanelBody,
} = wp.components;

/**
 * Internal dependencies
 */
import checkCoreBlock from '../check-core-block';
import getIcon from '../../utils/get-icon';
import CodeEditor from '../../components/code-editor';

const {
    GHOSTKIT,
} = window;

const placeholder = '.selector {\n\n}';
let initialOpenPanel = false;

/**
 * Custom CSS Component.
 */
class CustomCSSComponent extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            defaultPlaceholder: placeholder,
        };
    }
    render() {
        const props = this.props;
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
            return '';
        }

        const {
            setAttributes,
            attributes,
        } = this.props;

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
                            <span>{ __( 'Custom CSS' ) }</span>
                        </Fragment>
                    ) }
                    initialOpen={ initialOpenPanel }
                    onToggle={ () => {
                        initialOpenPanel = ! initialOpenPanel;
                    } }
                >
                    <CodeEditor
                        mode="css"
                        onChange={ value => {
                            if ( value !== placeholder ) {
                                setAttributes( {
                                    ghostkitCustomCSS: value,
                                } );
                            }
                            if ( this.state.defaultPlaceholder ) {
                                this.setState( {
                                    defaultPlaceholder: '',
                                } );
                            }
                        } }
                        value={ ghostkitCustomCSS || this.state.defaultPlaceholder }
                        maxLines={ 20 }
                        minLines={ 5 }
                        height="300px"
                    />
                    <p style={ { marginBottom: 20 } }></p>
                    <p dangerouslySetInnerHTML={ { __html: __( 'Use %s rule to change block styles.' ).replace( '%s', '<code>.selector</code>' ) } } />
                    <p>{ __( 'Example:' ) }</p>
                    <pre className="ghostkit-control-pre-custom-css">
                        { `.selector {
  background-color: #5C39A7;
}

.selector p {
  color: #5C39A7;
}` }
                    </pre>
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
                        settings.deprecated[ i ].attributes.ghostkitCustomCSS = settings.attributes.ghostkitCustomCSS;
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
const withInspectorControl = createHigherOrderComponent( ( BlockEdit ) => {
    return function( props ) {
        return (
            <Fragment>
                <BlockEdit { ...props } />
                <CustomCSSComponent { ...props } />
            </Fragment>
        );
    };
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

    if ( ghostkitCustomCSS && ghostkitClassname ) {
        customStylesOutput += ' ' + ghostkitCustomCSS.replace( /\.selector/g, `.${ ghostkitClassname }` );
    }

    return customStylesOutput;
}

// Init filters.
addFilter( 'ghostkit.blocks.allowCustomStyles', 'ghostkit/customCSS/allow-custom-styles', allowCustomStyles );
addFilter( 'ghostkit.blocks.withCustomStyles', 'ghostkit/customCSS/additional-attributes', addAttribute );
addFilter( 'ghostkit.editor.customStylesOutput', 'ghostkit/customCSS/editor-custom-output', addEditorCustomStylesOutput );
addFilter( 'editor.BlockEdit', 'ghostkit/customCSS/additional-attributes', withInspectorControl );
