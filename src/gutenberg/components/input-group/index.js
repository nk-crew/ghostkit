/**
 * External dependencies.
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies.
 */
const { BaseControl } = wp.components;

/**
 * Component
 */
export default function InputGroup(props) {
  const { className, children, ...restProps } = props;

  return (
    <BaseControl className={classnames('ghostkit-component-input-group', className)} {...restProps}>
      <div className="ghostkit-component-input-group-wrapper">{children}</div>
    </BaseControl>
  );
}
