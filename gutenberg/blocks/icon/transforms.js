import { createBlock, getBlockType, hasBlockSupport } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

import { maybeDecode, maybeEncode } from '../../utils/encode-decode';

const nativeIcon = 'core/icon';
const supportedAttributes = [
	'icon',
	'width',
	'justify',
	'align',
	'anchor',
	'className',
	'ghostkit',
	'color',
	'backgroundColor',
	'flipH',
	'flipV',
	'ariaLabel',
];
const registrySignatures = new WeakMap();

export function hasNativeIcon() {
	return (
		!!getBlockType(nativeIcon) &&
		!window.GHOSTKIT?.disabledBlocks?.[nativeIcon]
	);
}

function getSvgSignature(markup, defaultFill) {
	if (typeof markup !== 'string' || !markup.startsWith('<svg')) {
		return;
	}

	const svg = new DOMParser().parseFromString(
		markup.trim().replace(/>\s+</g, '><'),
		'image/svg+xml'
	).documentElement;
	const shapes = Array.from(svg.children);

	if (
		svg.localName !== 'svg' ||
		(!svg.hasAttribute('viewBox') && !svg.hasAttribute('viewbox')) ||
		!shapes.length ||
		svg.childNodes.length !== shapes.length ||
		shapes.some(
			(shape) =>
				!['path', 'polygon'].includes(shape.localName) ||
				shape.hasChildNodes()
		)
	) {
		return;
	}

	if (svg.hasAttribute('viewbox')) {
		svg.setAttribute(
			'viewBox',
			svg.getAttribute('viewBox') ?? svg.getAttribute('viewbox')
		);
		svg.removeAttribute('viewbox');
	}

	if (
		!svg.hasAttribute('fill') &&
		shapes.some((shape) => !shape.hasAttribute('fill'))
	) {
		svg.setAttribute('fill', defaultFill);
	}

	return JSON.stringify(
		[svg, ...shapes].map((element) => [
			element.tagName,
			element
				.getAttributeNames()
				.sort()
				.map((name) => [name, element.getAttribute(name)]),
		])
	);
}

function getRegisteredIcon(icon) {
	const signature = getSvgSignature(maybeDecode(icon), 'black');
	const registry = window.ghostkitCoreIcons;
	if (!signature || !registry) {
		return;
	}

	if (!registrySignatures.has(registry)) {
		const icons = new Map();
		for (const [name, svg] of Object.entries(registry)) {
			const key = getSvgSignature(svg, 'currentColor');
			if (key && !icons.has(key)) {
				icons.set(key, name);
			}
		}
		registrySignatures.set(registry, icons);
	}
	return registrySignatures.get(registry).get(signature);
}

function hasOnlyGeneratedStyles(attributes) {
	const { ghostkit, className } = attributes;
	if (
		className &&
		(!ghostkit?.id || className !== `ghostkit-custom-${ghostkit.id}`)
	) {
		return false;
	}
	if (!ghostkit) {
		return true;
	}

	const block = getBlockType('ghostkit/icon');
	const generatedStyles = block.ghostkit.customStylesCallback(attributes);

	return (
		Object.keys(ghostkit).every(
			(key) => key === 'id' || key === 'styles'
		) &&
		Object.entries(ghostkit.styles ?? {}).every(([key, value]) => {
			const generated = generatedStyles[maybeDecode(key)];
			return generated !== undefined && value === maybeEncode(generated);
		})
	);
}

function getNativeAttributes(attributes) {
	const {
		icon,
		width,
		justify,
		align,
		anchor,
		color,
		backgroundColor,
		flipH,
		flipV,
		ariaLabel,
	} = attributes;
	const native = getBlockType(nativeIcon);

	if (
		!hasNativeIcon() ||
		typeof icon !== 'string' ||
		!/^\d+(?:\.\d+)?px$/.test(width) ||
		!hasBlockSupport(native, ['dimensions', 'width']) ||
		justify !== 'center' ||
		!native.supports.align?.includes?.(align || 'center') ||
		(anchor && !hasBlockSupport(native, 'anchor')) ||
		(ariaLabel && !hasBlockSupport(native, 'ariaLabel')) ||
		(color &&
			(!hasBlockSupport(native, 'color') ||
				!hasBlockSupport(native, ['color', 'text'], true))) ||
		(backgroundColor &&
			(!hasBlockSupport(native, 'color') ||
				!hasBlockSupport(native, ['color', 'background'], true))) ||
		(flipH && !native.attributes.flipHorizontal) ||
		(flipV && !native.attributes.flipVertical) ||
		!hasOnlyGeneratedStyles(attributes) ||
		Object.entries(attributes).some(
			([key, value]) =>
				value !== undefined &&
				value !== '' &&
				!supportedAttributes.includes(key)
		)
	) {
		return;
	}

	const registeredIcon = getRegisteredIcon(icon);
	if (!registeredIcon) {
		return;
	}

	return {
		icon: registeredIcon,
		align: align || 'center',
		anchor,
		ariaLabel,
		...(flipH && { flipHorizontal: true }),
		...(flipV && { flipVertical: true }),
		style: {
			dimensions: { width },
			...((color || backgroundColor) && {
				color: { text: color, background: backgroundColor },
			}),
		},
	};
}

// Core copies backgroundColor as a palette slug and preserves the old generated class.
addFilter(
	'blocks.switchToBlockType.transformedBlock',
	'ghostkit/icon/remove-generated-attributes',
	(block, [source]) => {
		if (source.name !== 'ghostkit/icon' || block.name !== nativeIcon) {
			return block;
		}

		return {
			...block,
			attributes: {
				...block.attributes,
				backgroundColor: undefined,
				className: undefined,
			},
		};
	},
	20
);

export default {
	to: [
		{
			type: 'block',
			blocks: [nativeIcon],
			isMatch(attributes, block) {
				return block.isValid && !!getNativeAttributes(attributes);
			},
			transform(attributes) {
				const nativeAttributes = getNativeAttributes(attributes);
				return nativeAttributes
					? createBlock(nativeIcon, nativeAttributes)
					: null;
			},
		},
	],
};
