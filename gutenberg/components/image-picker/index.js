import classnames from 'classnames/dedupe';

import { BaseControl } from '@wordpress/components';

/**
 * Component Class
 *
 * @param props
 */
export default function ImagePicker(props) {
	const { value, options, itemsPerRow = 2, onChange, label } = props;

	return (
		<BaseControl
			id={label}
			label={label}
			className={classnames(
				'ghostkit-component-image-picker',
				`ghostkit-component-image-picker-${itemsPerRow}`
			)}
			__nextHasNoMarginBottom
		>
			{options.map((option) => (
				<button
					key={`image-pircker-${option.value}`}
					onClick={() => {
						onChange(option.value);
					}}
					className={classnames(
						'ghostkit-component-image-picker-item',
						value === option.value
							? 'ghostkit-component-image-picker-item-active'
							: '',
						option.className
					)}
				>
					{option.image && typeof option.image === 'string' ? (
						<img
							src={option.image}
							alt={option.label || option.value}
						/>
					) : null}
					{option.image && typeof option.image !== 'string'
						? option.image
						: ''}
					{option.label ? <span>{option.label}</span> : ''}
				</button>
			))}
		</BaseControl>
	);
}
