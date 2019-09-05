/**
 * Internal dependencies
 */
import getIcon from '../../../utils/get-icon';
import fixXmlImportedContent from '../../../utils/fix-xml-imported-content';
import dashCaseToTitle from '../../../utils/dash-case-to-title';
import camelCaseToDash from '../../../utils/camel-case-to-dash';
import * as classesReplacer from '../../../utils/classes-replacer';

export function get() {
    return {
        getIcon,
        fixXmlImportedContent,
        dashCaseToTitle,
        camelCaseToDash,
        classesReplacer,
    };
}
