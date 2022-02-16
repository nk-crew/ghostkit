/**
 * External dependencies
 */
import Select from 'react-select-virtualized';
import selectStyles from 'gutenberg-react-select-styles';
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

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
        {...props}
        className={classnames(props.className, 'ghostkit-control-select')}
      />
    );
  }
}
