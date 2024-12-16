import classnames from 'classnames/dedupe';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	ExternalLink,
	PanelBody,
	Placeholder,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { loadBlockEditorAssets } from '../../utils/block-editor-asset-loader';
import getIcon from '../../utils/get-icon';
import GistFilesSelect from './file-select';

const { gistSimple } = window;

/**
 * Block Edit Class.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes } = props;
	const { url, file, caption, showFooter, showLineNumbers } = attributes;

	const [sUrl, setUrl] = useState(attributes.url);
	const gistNode = useRef();
	const cachedRequest = useRef();
	const urlTimeout = useRef();

	let { className = '' } = props;

	function getValidGistUrl() {
		if (url) {
			const match = /^https:\/\/gist.github.com?.+\/(.+)/g.exec(url);

			if (match && typeof match[1] !== 'undefined') {
				return match[1].split('#')[0];
			}
		}

		return false;
	}

	function onUpdate() {
		if (!url || !gistNode?.current) {
			return;
		}

		const validUrl = getValidGistUrl();

		if (!validUrl) {
			return;
		}

		if (typeof gistSimple === 'undefined') {
			// eslint-disable-next-line no-console
			console.warn(__('Gist Simple plugin is not defined.', 'ghostkit'));
			return;
		}

		// cache request to prevent reloading.
		const newCachedRequest =
			validUrl +
			file +
			caption +
			(showFooter ? 1 : 0) +
			(showLineNumbers ? 1 : 0);
		if (newCachedRequest === cachedRequest?.current) {
			return;
		}
		cachedRequest.current = newCachedRequest;

		setTimeout(() => {
			if (gistNode.current.GistSimple) {
				gistNode.current.GistSimple.destroy();
			}

			gistSimple(gistNode.current, {
				id: validUrl,
				file,
				caption,
				showFooter,
				showLineNumbers,
			});
		}, 0);
	}

	// Mount and update.
	useEffect(() => {
		onUpdate();
	});

	// Load assets.
	useEffect(() => {
		if (gistNode?.current) {
			loadBlockEditorAssets('css', 'gist-simple-css', gistNode.current);
		}
	}, [gistNode]);

	function urlOnChange(value, timeout = 1000) {
		setUrl(value);

		clearTimeout(urlTimeout.current);

		urlTimeout.current = setTimeout(() => {
			setAttributes({ url: value });
		}, timeout);
	}

	className = classnames('ghostkit-gist', className);
	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<TextControl
						label={__('URL', 'ghostkit')}
						type="url"
						value={sUrl}
						onChange={(val) => urlOnChange(val)}
						onKeyDown={(e) => {
							if (e.keyCode === 13) {
								urlOnChange(sUrl, 0);
							}
						}}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<GistFilesSelect
						label={__('File', 'ghostkit')}
						url={url}
						value={file}
						onChange={(value) => setAttributes({ file: value })}
					/>
				</PanelBody>
				<PanelBody>
					<TextControl
						label={__('Caption', 'ghostkit')}
						value={caption}
						onChange={(value) => setAttributes({ caption: value })}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Show footer', 'ghostkit')}
						checked={!!showFooter}
						onChange={(val) => setAttributes({ showFooter: val })}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Show line numbers', 'ghostkit')}
						checked={!!showLineNumbers}
						onChange={(val) =>
							setAttributes({ showLineNumbers: val })
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{!url ? (
					<Placeholder
						icon={getIcon('block-gist')}
						label={__('Gist URL', 'ghostkit')}
						className={className}
					>
						<TextControl
							placeholder="https://gist.github.com/..."
							value={sUrl}
							onChange={(val) => urlOnChange(val)}
							onKeyDown={(e) => {
								if (e.keyCode === 13) {
									urlOnChange(sUrl, 0);
								}
							}}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
						<ExternalLink href="https://gist.github.com/">
							{__('Visit GitHub Gist Site', 'ghostkit')}
						</ExternalLink>
					</Placeholder>
				) : null}
				{url ? (
					<div
						ref={gistNode}
						className={className}
						data-url={url}
						data-file={file}
						data-caption={caption}
						data-show-footer={showFooter ? 'true' : 'false'}
						data-show-line-numbers={
							showLineNumbers ? 'true' : 'false'
						}
					/>
				) : null}
			</div>
		</>
	);
}
