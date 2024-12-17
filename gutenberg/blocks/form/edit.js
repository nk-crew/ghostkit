import classnames from 'classnames/dedupe';
import { throttle } from 'throttle-debounce';

import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	BaseControl,
	PanelBody,
	TextareaControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ToggleGroup from '../../components/toggle-group';
import RecaptchaSettings from './recaptcha';

const TEMPLATE = [
	['ghostkit/form-field-name', { slug: 'field_name' }],
	['ghostkit/form-field-email', { slug: 'field_email', required: true }],
	[
		'ghostkit/form-field-text',
		{
			slug: 'field_subject',
			label: __('Subject', 'ghostkit'),
			required: true,
		},
	],
	[
		'ghostkit/form-field-textarea',
		{
			slug: 'field_message',
			label: __('Message', 'ghostkit'),
			required: true,
		},
	],
	['ghostkit/form-submit-button'],
];
const ALLOWED_BLOCKS = [
	'core/paragraph',
	'core/heading',
	'core/list',
	'core/divider',
	'core/columns',
	'ghostkit/divider',
	'ghostkit/grid',
];

/**
 * Parse all Form inner blocks and get Fields data.
 *
 * @param {Object} formData Form block data.
 *
 * @return {Array} - fields list.
 */
function getAllFieldsData(formData) {
	let result = [];

	if (formData.innerBlocks && formData.innerBlocks.length) {
		formData.innerBlocks.forEach((block) => {
			// field data.
			if (block.name && /^ghostkit\/form-field/g.test(block.name)) {
				result.push({
					clientId: block.clientId,
					name: block.name,
					type: block.name.replace(/^ghostkit\/form-field-/g, ''),
					attributes: block.attributes,
				});
			}

			// inner blocks.
			if (block.innerBlocks && block.innerBlocks.length) {
				result = [...result, ...getAllFieldsData(block)];
			}
		});
	}

	return result;
}

/**
 * Get unique field slug.
 *
 * @param {Object} data      - field data.
 * @param {Object} uniqueIds - all available uniqu IDs.
 *
 * @return {string} - unique slug.
 */
function getUniqueFieldSlug(data, uniqueIds) {
	let newSlug = `field_${data.type}`;

	// check if slug already exist.
	let tryCount = 100;
	let i = 0;
	while (
		typeof uniqueIds[data.type][newSlug] !== 'undefined' &&
		tryCount > 0
	) {
		i += 1;
		tryCount -= 1;
		newSlug = `field_${data.type}_${i}`;
	}

	return newSlug;
}

/**
 * Block Edit component.
 *
 * @param props
 */
export default function BlockEdit(props) {
	const { attributes, setAttributes, clientId } = props;

	let { className = '' } = props;

	const {
		mailAllow,
		mailTo,
		mailSubject,
		mailFrom,
		mailReplyTo,
		mailMessage,

		confirmationType,
		confirmationMessage,
		confirmationRedirect,
	} = attributes;

	const { isSelectedBlockInRoot, allFieldsData } = useSelect(
		(select) => {
			const { getBlock, isBlockSelected, hasSelectedInnerBlock } =
				select('core/block-editor');

			return {
				allFieldsData: getAllFieldsData(getBlock(clientId)),
				isSelectedBlockInRoot:
					isBlockSelected(clientId) ||
					hasSelectedInnerBlock(clientId, true),
			};
		},
		[clientId]
	);

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	function updateFieldsSlugs() {
		const uniqueIds = {};

		// Collect all available slugs.
		allFieldsData.forEach((data) => {
			if (!uniqueIds[data.type]) {
				uniqueIds[data.type] = {};
			}
			if (data.attributes.slug) {
				// Slug already exist.
				if (
					typeof uniqueIds[data.type][data.attributes.slug] !==
					'undefined'
				) {
					const newSlug = getUniqueFieldSlug(data, uniqueIds);

					uniqueIds[data.type][newSlug] = true;

					updateBlockAttributes(data.clientId, {
						slug: newSlug,
					});
				} else {
					uniqueIds[data.type][data.attributes.slug] = true;
				}
			}
		});

		// Generate slugs for new fields.
		allFieldsData.forEach((data) => {
			if (!uniqueIds[data.type]) {
				uniqueIds[data.type] = {};
			}

			if (!data.attributes.slug) {
				const newSlug = getUniqueFieldSlug(data, uniqueIds);

				uniqueIds[data.type][newSlug] = true;

				updateBlockAttributes(data.clientId, {
					slug: newSlug,
				});
			}
		});
	}

	const maybeUpdateFieldSlug = throttle(200, () => {
		updateFieldsSlugs();
	});

	// Mount and update.
	useEffect(() => {
		maybeUpdateFieldSlug();
	});

	className = classnames(className, 'ghostkit-form');
	className = applyFilters('ghostkit.editor.className', className, props);

	const blockProps = useBlockProps({ className });
	const { children, ...innerBlockProps } = useInnerBlocksProps(blockProps, {
		template: TEMPLATE,
		allowedBlocks: ALLOWED_BLOCKS,
		renderAppender: () => null,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Mail', 'ghostkit')}>
					{mailAllow ? (
						<>
							<TextControl
								label={__('Send To Email Address', 'ghostkit')}
								value={mailTo}
								onChange={(val) =>
									setAttributes({ mailTo: val })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<TextControl
								label={__('Subject', 'ghostkit')}
								value={mailSubject}
								onChange={(val) =>
									setAttributes({ mailSubject: val })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<TextControl
								label={__('From', 'ghostkit')}
								value={mailFrom}
								onChange={(val) =>
									setAttributes({ mailFrom: val })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<TextControl
								label={__('Reply To', 'ghostkit')}
								value={mailReplyTo}
								onChange={(val) =>
									setAttributes({ mailReplyTo: val })
								}
								__next40pxDefaultSize
								__nextHasNoMarginBottom
							/>
							<TextareaControl
								label={__('Message', 'ghostkit')}
								value={mailMessage}
								onChange={(val) =>
									setAttributes({ mailMessage: val })
								}
								__nextHasNoMarginBottom
							/>
						</>
					) : null}
					<BaseControl
						id={__('Send Email', 'ghostkit')}
						label={__('Send Email', 'ghostkit')}
						help={__(
							"In case if you don't want to receive email messages from this form, you may disable sending emails functionality."
						)}
						__nextHasNoMarginBottom
					>
						<ToggleControl
							Label={__('Yes', 'ghostkit')}
							checked={!!mailAllow}
							onChange={() =>
								setAttributes({ mailAllow: !mailAllow })
							}
							__nextHasNoMarginBottom
						/>
					</BaseControl>
				</PanelBody>
				<PanelBody title={__('Confirmation', 'ghostkit')}>
					<ToggleGroup
						label={__('Type', 'ghostkit')}
						value={confirmationType}
						options={[
							{
								label: __('Message', 'ghostkit'),
								value: 'message',
							},
							{
								label: __('Redirect', 'ghostkit'),
								value: 'redirect',
							},
						]}
						onChange={(value) => {
							setAttributes({ confirmationType: value });
						}}
						isDeselectable
					/>

					{!confirmationType || confirmationType === 'message' ? (
						<TextareaControl
							label={__('Message', 'ghostkit')}
							value={confirmationMessage}
							onChange={(val) =>
								setAttributes({ confirmationMessage: val })
							}
							__nextHasNoMarginBottom
						/>
					) : null}
					{confirmationType === 'redirect' ? (
						<TextControl
							label={__('Redirect URL', 'ghostkit')}
							value={confirmationRedirect}
							onChange={(val) =>
								setAttributes({ confirmationRedirect: val })
							}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					) : null}
				</PanelBody>
				<RecaptchaSettings />
			</InspectorControls>
			<div {...innerBlockProps}>
				{children}
				{isSelectedBlockInRoot ? (
					<InnerBlocks.ButtonBlockAppender />
				) : null}
			</div>
		</>
	);
}
