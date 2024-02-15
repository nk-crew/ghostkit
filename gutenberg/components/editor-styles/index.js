import { compact, map } from 'lodash';

import { transformStyles } from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';

const EDITOR_STYLES_SELECTOR = '.editor-styles-wrapper';

export default function EditorStyles(props) {
	const { styles } = props;

	const renderStyles = useMemo(() => {
		const transformedStyles = transformStyles(
			[
				{
					css: styles,
				},
			],
			EDITOR_STYLES_SELECTOR
		);

		let resultStyles = '';

		map(compact(transformedStyles), (updatedCSS) => {
			resultStyles += updatedCSS;
		});

		return resultStyles;
	}, [styles]);

	return (
		<style
			dangerouslySetInnerHTML={{
				__html: renderStyles,
			}}
		/>
	);
}
