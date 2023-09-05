/**
 * External dependencies
 */
import Select, { components } from 'react-select';
import selectStyles from 'gutenberg-react-select-styles';
import classnames from 'classnames/dedupe';
import { AutoSizer, List } from 'react-virtualized';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

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
            // eslint-disable-next-line react/no-unstable-nested-components
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
 */
export default class SelectComponent extends Component {
  render() {
    const props = {
      ...(this.props.grouped
        ? {
            groupHeaderHeight: 50,
          }
        : {}),
      ...this.props,
    };

    // Add virtualized if there are > 30 items.
    const useVirtualized = props?.options?.length > 30;

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
        components={{ ...(useVirtualized ? { MenuList } : {}), Option }}
        {...props}
        className={classnames(props.className, 'ghostkit-control-select')}
      />
    );
  }
}
