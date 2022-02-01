/**
 * External dependencies
 */
import qs from 'qs';

export default function prepareQuery(data) {
  const additionalData = qs.stringify(data, { encode: false });
  const query = `/ghostkit/v1/get_table_of_contents/${additionalData ? `?${additionalData}` : ''}`;

  return query;
}
