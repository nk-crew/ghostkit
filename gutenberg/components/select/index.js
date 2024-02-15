import classnames from 'classnames/dedupe';
import selectStyles from 'gutenberg-react-select-styles';
import Select, { components } from 'react-select';
import { AutoSizer, List } from 'react-virtualized';

const rowHeight = 26;

function MenuList(props) {
	const { children, maxHeight } = props;

	if (!children.length) {
		return null;
	}

	return (
		<AutoSizer disableHeight>
			{({ width }) => {
				return (
					<List
						height={maxHeight}
						rowCount={children.length}
						rowHeight={rowHeight}
						rowRenderer={({ index, key, style }) => {
							return (
								<div key={key} style={style}>
									{children[index]}
								</div>
							);
						}}
						width={width}
					/>
				);
			}}
		</AutoSizer>
	);
}

const { Option: DefaultOption } = components;
function Option(props) {
	return (
		<DefaultOption {...props}>
			{props?.data?.icon || ''}
			{props.data.label}
		</DefaultOption>
	);
}

/**
 * Component Class
 *
 * @param props
 */
export default function SelectComponent(props) {
	const { className, ...restProps } = props;

	const selectProps = {
		...(props.grouped
			? {
					groupHeaderHeight: 50,
				}
			: {}),
		...restProps,
	};

	// Add virtualized if there are > 30 items.
	const withVirtualized = props?.options?.length > 30;

	return (
		<Select
			styles={{
				...selectStyles,
				option(styles, state) {
					const newStyles = selectStyles.option(styles, state);

					newStyles['> svg'] = {
						width: '24px',
						height: 'auto',
						marginRight: '5px',
					};

					return newStyles;
				},
			}}
			components={{ ...(withVirtualized ? { MenuList } : {}), Option }}
			className={classnames('ghostkit-control-select', className)}
			{...selectProps}
		/>
	);
}
