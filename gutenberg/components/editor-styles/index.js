/* eslint-disable indent */

const { compact, map } = window.lodash;

import { BlockList, transformStyles } from '@wordpress/block-editor';
import { createPortal, useContext, useMemo } from '@wordpress/element';

const { elementContext: __stableElementContext, __unstableElementContext } =
	BlockList;

const elementContext = __stableElementContext || __unstableElementContext;

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

	const element = useContext(elementContext);

	return (
		renderStyles &&
		element &&
		createPortal(
			<style
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{
					__html: renderStyles,
				}}
			/>,
			element
		)
	);
}
