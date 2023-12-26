import arrayMove from '../../../utils/array-move';
import camelCaseToDash from '../../../utils/camel-case-to-dash';
import * as classesReplacer from '../../../utils/classes-replacer';
import compactObject from '../../../utils/compact-object';
import dashCaseToTitle from '../../../utils/dash-case-to-title';
import * as encodeDecode from '../../../utils/encode-decode';
import getIcon from '../../../utils/get-icon';
import getParents from '../../../utils/get-parents';
import getSiblings from '../../../utils/get-siblings';
import getUniqueSlug, { getSlug } from '../../../utils/get-unique-slug';
import merge from '../../../utils/merge';
import round from '../../../utils/round';
import sortObject from '../../../utils/sort-object';
import * as styles from '../../../utils/styles';

export function get() {
	return {
		arrayMove,
		camelCaseToDash,
		classesReplacer,
		compactObject,
		dashCaseToTitle,
		encodeDecode,
		getIcon,
		getParents,
		getSiblings,
		getSlug,
		getUniqueSlug,
		merge,
		round,
		sortObject,
		styles,
	};
}
