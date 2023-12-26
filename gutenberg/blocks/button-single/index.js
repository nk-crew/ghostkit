import getIcon from '../../utils/get-icon';
import metadata from './block.json';
import deprecated from './deprecated';
import edit from './edit';
import save from './save';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: getIcon('block-button', true),
	ghostkit: {
		customStylesCallback(attributes) {
			const styles = {
				'--gkt-button__background-color': attributes.color || undefined,
				'--gkt-button__color': attributes.textColor || undefined,
				'--gkt-button__border-radius': undefined,
				'--gkt-button__border-width': undefined,
				'--gkt-button__border-color':
					attributes.borderColor || undefined,
				'--gkt-button-hover__background-color':
					attributes.hoverColor || undefined,
				'--gkt-button-hover__color':
					attributes.hoverTextColor || undefined,
				'--gkt-button-hover__border-color':
					attributes.hoverBorderColor || undefined,
				'--gkt-button-focus__background-color':
					attributes.hoverColor || undefined,
				'--gkt-button-focus__color':
					attributes.hoverTextColor || undefined,
				'--gkt-button-focus__box-shadow': undefined,
			};

			// Border.
			if (
				typeof attributes.borderRadius !== 'undefined' &&
				attributes.borderRadius !== ''
			) {
				styles['--gkt-button__border-radius'] =
					`${attributes.borderRadius}px`;
			}
			if (
				typeof attributes.borderWeight !== 'undefined' &&
				attributes.borderWeight !== ''
			) {
				styles['--gkt-button__border-width'] =
					`${attributes.borderWeight}px`;
			}

			// Box Shadow.
			if (
				typeof attributes.focusOutlineWeight !== 'undefined' &&
				attributes.focusOutlineColor
			) {
				styles['--gkt-button-focus__box-shadow'] =
					`0 0 0 ${attributes.focusOutlineWeight}px ${attributes.focusOutlineColor}`;
			}

			return styles;
		},
	},
	edit,
	save,
	deprecated,
};
