// Import CSS
import './editor.scss';

// External Dependencies.
import { debounce } from 'throttle-debounce';

// Internal Dependencies.
import ElementIcon from '../_icons/custom-css.svg';

const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    Placeholder,
    CodeEditor,
} = wp.components;

// style tag for preview
const $head = document.head || document.getElementsByTagName( 'head' )[ 0 ];
const $stylePreview = document.createElement( 'style' );
$stylePreview.setAttribute( 'id', 'ghostkit-blocks-custom-css-block-preview' );
$head.appendChild( $stylePreview );

function updateStyles( newStyles ) {
    $stylePreview.innerHTML = newStyles;
}
updateStyles = debounce( 400, updateStyles );

class CustomCSSBlock extends Component {
    constructor() {
        super( ...arguments );
        updateStyles( this.props.attributes.customCSS );
    }
    render() {
        const {
            className,
            setAttributes,
            attributes,
            isPlugin,
        } = this.props;

        const {
            customCSS,
        } = attributes;

        return (
            <Placeholder
                icon={ <ElementIcon /> }
                label={ __( 'Custom CSS' ) }
                className={ className + ( isPlugin ? ' ghostkit-custom-css-plugin' : '' ) }
            >
                { ! isPlugin ? (
                    <p style={ { color: '#c72323' } }>{ __( 'This block is deprecated, please, use custom CSS in the page settings (top right corner after "Update" button).' ) }</p>
                ) : '' }
                { isPlugin ? (
                    <p>{ __( 'Custom CSS for the current post.' ) }</p>
                ) : '' }
                <CodeEditor
                    value={ customCSS }
                    onChange={ value => {
                        setAttributes( { customCSS: value } );
                        updateStyles( value );
                    } }
                    settings={ {
                        codemirror: {
                            mode: 'css',
                            indentUnit: 4,
                            autoCloseTags: true,
                            autoCloseBrackets: true,
                            matchBrackets: true,
                            foldGutter: true,
                            lint: {
                                options: {
                                    errors: true,
                                    'box-model': true,
                                    'display-property-grouping': true,
                                    'duplicate-properties': true,
                                    'known-properties': true,
                                    'outline-none': true,
                                },
                            },
                            lineNumbers: true,
                            lineWrapping: true,
                            scrollPastEnd: true,
                            emmet_active: true,
                            emmet: true,
                            styleActiveLine: true,
                            continueComments: true,
                            scrollbarStyle: 'simple',
                            extraKeys: {
                                'Ctrl-Space': 'autocomplete',
                                'Ctrl-/': 'toggleComment',
                                'Cmd-/': 'toggleComment',
                                'Alt-F': 'findPersistent',
                            },
                            gutters: [ 'CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter' ],
                        },
                    } }
                />
            </Placeholder>
        );
    }
}

export const name = 'ghostkit/custom-css';

export const settings = {
    title: __( 'Custom CSS' ),
    description: __( 'Custom CSS for current post.' ),
    icon: ElementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'styles' ),
        __( 'css' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        customClassName: false,
        inserter: false,
    },
    attributes: {
        customCSS: {
            type: 'string',
            source: 'meta',
            meta: 'ghostkit_custom_css',
        },
    },

    edit: CustomCSSBlock,

    save: function() {
        return null;
    },
};
