import { BlockControls } from '@wordpress/block-editor';
import { ToolbarDropdownMenu, ToolbarGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import getIcon from '../../../utils/get-icon';

export default function EditBlockControls({ attributes, setAttributes }) {
	const { buttonsAlign, buttonsVerticalAlign } = attributes;

	const alignConf = {
		start: {
			icon: getIcon('icon-horizontal-start'),
			label: __('Buttons Justify Start', 'ghostkit'),
		},
		center: {
			icon: getIcon('icon-horizontal-center'),
			label: __('Buttons Justify Center', 'ghostkit'),
		},
		end: {
			icon: getIcon('icon-horizontal-end'),
			label: __('Buttons Justify End', 'ghostkit'),
		},
		stretch: {
			icon: getIcon('icon-horizontal-stretch'),
			label: __('Buttons Justify Stretch', 'ghostkit'),
		},
	};

	if (buttonsVerticalAlign) {
		alignConf.start.icon = getIcon('icon-vertical-top');
		alignConf.start.label = __('Buttons Vertical Start', 'ghostkit');
		alignConf.center.icon = getIcon('icon-vertical-center');
		alignConf.center.label = __('Buttons Vertical Center', 'ghostkit');
		alignConf.end.icon = getIcon('icon-vertical-bottom');
		alignConf.end.label = __('Buttons Vertical End', 'ghostkit');
		alignConf.stretch = undefined;
	}

	const alignControls = [];
	Object.entries(alignConf).forEach((item) => {
		if (!item[1]) {
			return;
		}
		alignControls.push({
			title: item[1].label,
			icon: item[1].icon,
			isActive: buttonsAlign === item[0],
			onClick: () => setAttributes({ buttonsAlign: item[0] }),
		});
	});

	const alignLabel = buttonsVerticalAlign
		? __('Buttons Vertical Align', 'ghostkit')
		: __('Buttons Justify Align', 'ghostkit');

	return (
		<BlockControls group="block">
			<ToolbarGroup>
				<ToolbarDropdownMenu
					icon={alignConf[buttonsAlign].icon}
					label={alignLabel}
					controls={alignControls}
				/>
			</ToolbarGroup>
		</BlockControls>
	);
}
