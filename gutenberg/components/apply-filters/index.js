/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

/**
 * Component Class
 */
export default function ApplyFilters(props) {
  const { name, children } = props;

  return applyFilters(name, children || '', props);
}
