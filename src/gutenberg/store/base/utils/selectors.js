/**
 * Internal dependencies
 */
import camelCaseToDash from '../../../utils/camel-case-to-dash';
import * as classesReplacer from '../../../utils/classes-replacer';
import dashCaseToTitle from '../../../utils/dash-case-to-title';
import * as encodeDecode from '../../../utils/encode-decode';
import getIcon from '../../../utils/get-icon';
import getParents from '../../../utils/get-parents';
import getSiblings from '../../../utils/get-siblings';
import getUniqueSlug, { getSlug } from '../../../utils/get-unique-slug';
import round from '../../../utils/round';
import sortObject from '../../../utils/sort-object';

export function get() {
  return {
    camelCaseToDash,
    classesReplacer,
    dashCaseToTitle,
    encodeDecode,
    getIcon,
    getParents,
    getSiblings,
    getSlug,
    getUniqueSlug,
    round,
    sortObject,
  };
}
