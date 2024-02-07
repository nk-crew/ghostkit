// eslint-disable-next-line simple-import-sort/imports
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/snippets/css';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/snippets/text';
import 'ace-builds/src-noconflict/ext-language_tools';

/**
 * Component Class
 *
 * @param props
 */
export default function CodeEditor(props) {
	const { setOptions = {}, editorProps = {}, ...restProps } = props;

	return (
		<AceEditor
			className="ghostkit-component-code-editor"
			theme="textmate"
			onLoad={(editor) => {
				editor.renderer.setScrollMargin(16, 16, 16, 16);
				editor.renderer.setPadding(16);
			}}
			fontSize={12}
			showPrintMargin
			showGutter
			highlightActiveLine={false}
			width="100%"
			setOptions={{
				enableBasicAutocompletion: true,
				enableLiveAutocompletion: true,
				enableSnippets: true,
				showLineNumbers: true,
				printMargin: false,
				tabSize: 2,

				// When worker is enabled, a lot of errors displayed in the console.
				useWorker: false,

				...setOptions,
			}}
			editorProps={{
				$blockScrolling: Infinity,
				...editorProps,
			}}
			{...restProps}
		/>
	);
}
