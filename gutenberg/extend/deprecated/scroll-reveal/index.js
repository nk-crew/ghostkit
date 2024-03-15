import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

import parseSRConfig from './parse-sr-config';

export default function migrate(props) {
	const { name, attributes } = props;
	const { ghostkitSR } = attributes;

	const result = {};

	const hasNewRevealSupport =
		hasBlockSupport(name, ['ghostkit', 'effects', 'reveal']) ||
		getBlockSupport(name, ['ghostkit', 'effects']) === true;

	// Migration to new effects attribute.
	if (hasNewRevealSupport && ghostkitSR) {
		const newSrData = {
			effect: '',
			direction: '',
			distance: 50,
			scale: 0.9,
			duration: 900,
			delay: 0,
		};

		// parse data from string.
		// fade-right;duration:500;delay:1000;distance:60px;scale:0.8
		const data = ghostkitSR.split(';');

		let effect = data[0];
		if (effect) {
			let direction = effect.split('-');
			if (direction.length === 2) {
				effect = direction[0];
				direction = direction[1];
			} else {
				direction = '';
			}

			newSrData.effect = effect;
			newSrData.direction = direction;

			// replace other data config.
			if (data.length > 1) {
				data.forEach((item) => {
					const itemData = item.split(':');
					if (itemData.length === 2) {
						const revealName = itemData[0];
						const val = itemData[1];
						newSrData[revealName] = val;
					}
				});
			}

			newSrData.distance = parseFloat(newSrData.distance);
			newSrData.scale = parseFloat(newSrData.scale);
			newSrData.duration = parseFloat(newSrData.duration);
			newSrData.delay = parseFloat(newSrData.delay);
		}

		const ghostkitData = {
			...(attributes?.ghostkit || {}),
		};

		if (!ghostkitData?.effects?.reveal) {
			const parsedConfig = parseSRConfig(ghostkitSR);

			const newAnimationData = {
				x: parsedConfig.x,
				y: parsedConfig.y,
				opacity: parsedConfig.opacity,
				scale: parsedConfig.scale,
				transition: {
					type: 'easing',
					duration: parsedConfig.duration,
					delay: parsedConfig.delay,
					easing: parsedConfig.easing,
				},
			};

			if (!ghostkitData?.effects) {
				ghostkitData.effects = {};
			}

			ghostkitData.effects.reveal = newAnimationData;

			result.ghostkit = ghostkitData;
		}

		// Clean old attribute.
		result.ghostkitSR = undefined;
	}

	return result;
}

/**
 * Override props assigned to save component to inject custom styles.
 * This is only applied if the block's save result is an
 * element and not a markup string.
 *
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 *
 * @return {Object} Filtered props applied to save element.
 */
function addSaveProps(extraProps, blockType, attributes) {
	if (attributes.ghostkitSR) {
		extraProps['data-ghostkit-sr'] = attributes.ghostkitSR;
	}

	return extraProps;
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'ghostkit/sr/save-props',
	addSaveProps
);
