/**
 * External dependencies
 */
import Select from 'react-select';
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

    return (
      <Select
        styles={selectStyles}
        components={{ MenuList }}
        {...props}
        className={classnames(props.className, 'ghostkit-control-select')}
      />
    );
  }
}
