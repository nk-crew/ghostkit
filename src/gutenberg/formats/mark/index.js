/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

const { __ } = wp.i18n;

const {
    Component,
    Fragment,
} = wp.element;

const {
    RichTextToolbarButton,
    RichTextShortcut,
} = wp.blockEditor;

const {
    toggleFormat,
} = wp.richText;

export const name = 'ghostkit/mark';

export const settings = {
    title: __( 'Highlight', '@@text_domain' ),
    tagName: 'mark',
    className: 'ghostkit-highlight',
    edit: class HighlightFormat extends Component {
        constructor( props ) {
            super( props );

            this.toggleMark = this.toggleMark.bind( this );
        }

        toggleMark() {
            const {
                value,
                onChange,
            } = this.props;

            onChange( toggleFormat(
                value,
                {
                    type: name,
                }
            ) );
        }

        render() {
            const {
                isActive,
            } = this.props;

            return (
                <Fragment>
                    <RichTextShortcut
                        type="access"
                        character="m"
                        onUse={ this.toggleMark }
                    />
                    <RichTextToolbarButton
                        shortcutCharacter="m"
                        shortcutType="access"
                        title={ __( 'Highlight', '@@text_domain' ) }
                        icon={ getIcon( 'icon-felt-pen' ) }
                        onClick={ this.toggleMark }
                        isActive={ isActive }
                    />
                </Fragment>
            );
        }
    },
};
