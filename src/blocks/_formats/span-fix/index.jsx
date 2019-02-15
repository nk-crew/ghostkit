/*
 * For some reason we can't use <span> tag formats with custom classes (badges, uppercase, etc...)
 * These registered formats creates in editor automatically and adds classes, that we don't need to add on a simple <span>text</span>
 */

const { __ } = wp.i18n;

const {
    Component,
} = wp.element;

export const name = 'ghostkit/span-fix';

export const settings = {
    title: __( 'Span fix' ),
    tagName: 'span',
    className: null,
    edit: class SpanFixFormat extends Component {
        render() {
            return '';
        }
    },
};
