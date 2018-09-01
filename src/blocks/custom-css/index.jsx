// Import CSS
import './editor.scss';

// Internal Dependencies.
import elementIcon from '../_icons/custom-css.svg';

const { __ } = wp.i18n;
const { Component } = wp.element;
const {
    Placeholder,
    CodeEditor,
} = wp.components;

class CustomCSSBlock extends Component {
    render() {
        const {
            className,
            setAttributes,
            attributes,
        } = this.props;

        const {
            customCSS,
        } = attributes;

        return (
            <Placeholder
                icon={ elementIcon }
                label={ __( 'Custom CSS' ) }
                className={ className }
            >
                <CodeEditor
                    value={ customCSS }
                    onChange={ value => setAttributes( { customCSS: value } ) }
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
    icon: elementIcon,
    category: 'ghostkit',
    keywords: [
        __( 'styles' ),
        __( 'css' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        multiple: false,
        customClassName: false,
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
