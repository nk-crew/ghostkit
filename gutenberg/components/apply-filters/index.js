import { applyFilters } from '@wordpress/hooks';

/**
 * Component Class
 *
 * @param props
 */
export default function ApplyFilters(props) {
	const { name, children } = props;

	return applyFilters(name, children || '', props);
}
