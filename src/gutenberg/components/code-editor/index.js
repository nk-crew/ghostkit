/**
 * External dependencies
 */
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/snippets/css';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/snippets/text';
import 'ace-builds/src-noconflict/ext-language_tools';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

/**
 * Component Class
 */
export default class CodeEditor extends Component {
    render() {
        return (
            <AceEditor
                className="ghostkit-component-code-editor"
                theme="textmate"
                onLoad={ ( editor ) => {
                    editor.renderer.setScrollMargin( 16, 16, 16, 16 );
                    editor.renderer.setPadding( 16 );
                } }
                fontSize={ 12 }
                showPrintMargin
                showGutter
                highlightActiveLine={ false }
                width="100%"
                setOptions={ {
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    printMargin: false,
                    tabSize: 2,
                } }
                editorProps={ {
                    $blockScrolling: Infinity,
                } }
                { ...this.props }
            />
        );
    }
}
