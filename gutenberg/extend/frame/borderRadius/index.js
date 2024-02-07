import {
	__experimentalToolsPanelItem as ExperimentalToolsPanelItem,
	__stableToolsPanelItem as StableToolsPanelItem,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import ElementStateToggle from '../../../components/element-state-toggle';
import InputDrag from '../../../components/input-drag';
import InputGroup from '../../../components/input-group';
import ResponsiveToggle from '../../../components/responsive-toggle';
import useResponsive from '../../../hooks/use-responsive';
import useStyles from '../../../hooks/use-styles';

const ToolsPanelItem = StableToolsPanelItem || ExperimentalToolsPanelItem;

import { hasBlockSupport } from '@wordpress/blocks';

const hoverSelector = '&:hover';

const allRadiusProps = [
	'border-top-left-radius',
	'border-top-right-radius',
	'border-bottom-left-radius',
	'border-bottom-right-radius',
];

function FrameBorderRadiusTools(props) {
	const [isHover, setIsHover] = useState(false);

	const { getStyle, hasStyle, setStyles, resetStyles } = useStyles(props);
	const { device, allDevices } = useResponsive();

	let hasBorderRadius = false;

	['', ...Object.keys(allDevices)].forEach((thisDevice) => {
		allRadiusProps.forEach((thisProp) => {
			hasBorderRadius =
				hasBorderRadius ||
				hasStyle(thisProp, thisDevice) ||
				hasStyle(thisProp, thisDevice, hoverSelector);
		});
	});

	return (
		<ToolsPanelItem
			label={__('Border Radius', 'ghostkit')}
			hasValue={() => !!hasBorderRadius}
			onDeselect={() => {
				resetStyles(allRadiusProps, true, ['', '&:hover']);
			}}
			isShownByDefault={false}
		>
			<InputGroup
				label={
					<>
						{__('Border Radius', 'ghostkit')}
						<ResponsiveToggle
							checkActive={(checkMedia) => {
								return (
									hasStyle(
										'border-top-left-radius',
										checkMedia,
										isHover && hoverSelector
									) ||
									hasStyle(
										'border-top-right-radius',
										checkMedia,
										isHover && hoverSelector
									) ||
									hasStyle(
										'border-bottom-left-radius',
										checkMedia,
										isHover && hoverSelector
									) ||
									hasStyle(
										'border-bottom-right-radius',
										checkMedia,
										isHover && hoverSelector
									)
								);
							}}
						/>
						<ElementStateToggle
							isHover={isHover}
							onChange={() => {
								setIsHover(!isHover);
							}}
							checkActive={() => {
								return (
									hasStyle(
										'border-top-left-radius',
										device,
										hoverSelector
									) ||
									hasStyle(
										'border-top-right-radius',
										device,
										hoverSelector
									) ||
									hasStyle(
										'border-bottom-left-radius',
										device,
										hoverSelector
									) ||
									hasStyle(
										'border-bottom-right-radius',
										device,
										hoverSelector
									)
								);
							}}
						/>
					</>
				}
			>
				<InputDrag
					help={__('TL', 'ghostkit')}
					value={getStyle(
						'border-top-left-radius',
						device,
						isHover && hoverSelector
					)}
					onChange={(val) =>
						setStyles(
							{ 'border-top-left-radius': val },
							device,
							isHover && hoverSelector
						)
					}
					autoComplete="off"
				/>
				<InputDrag
					help={__('TR', 'ghostkit')}
					value={getStyle(
						'border-top-right-radius',
						device,
						isHover && hoverSelector
					)}
					onChange={(val) =>
						setStyles(
							{ 'border-top-right-radius': val },
							device,
							isHover && hoverSelector
						)
					}
					autoComplete="off"
				/>
				<InputDrag
					help={__('BR', 'ghostkit')}
					value={getStyle(
						'border-bottom-right-radius',
						device,
						isHover && hoverSelector
					)}
					onChange={(val) =>
						setStyles(
							{ 'border-bottom-right-radius': val },
							device,
							isHover && hoverSelector
						)
					}
					autoComplete="off"
				/>
				<InputDrag
					help={__('BL', 'ghostkit')}
					value={getStyle(
						'border-bottom-left-radius',
						device,
						isHover && hoverSelector
					)}
					onChange={(val) =>
						setStyles(
							{ 'border-bottom-left-radius': val },
							device,
							isHover && hoverSelector
						)
					}
					autoComplete="off"
				/>
			</InputGroup>
		</ToolsPanelItem>
	);
}

addFilter(
	'ghostkit.extension.frame.tools',
	'ghostkit/extension/frame/tools/borderRadius',
	(children, { props }) => {
		const hasBorderRadiusSupport = hasBlockSupport(props.name, [
			'ghostkit',
			'frame',
			'borderRadius',
		]);

		if (!hasBorderRadiusSupport) {
			return children;
		}

		return (
			<>
				{children}
				<FrameBorderRadiusTools {...props} />
			</>
		);
	}
);
