// Import CSS
import './style.scss';
import './editor.scss';

import PositionedAtSelection from './positioned-at-selection';

const { __ } = wp.i18n;

const {
    Component,
    Fragment,
} = wp.element;

const {
    Popover,
} = wp.components;

const {
    RichTextToolbarButton,
    ColorPalette,
} = wp.editor;

export const name = 'ghostkit/badge';

export const settings = {
    title: __( 'Badge' ),
    tagName: 'span',
    className: 'ghostkit-badge',
    attributes: {
        style: 'style',
    },
    edit: class BadgeFormat extends Component {
        constructor() {
            super( ...arguments );

            this.toggleFormat = this.toggleFormat.bind( this );
        }

        toggleFormat( color, toggle = true ) {
            const {
                value,
                onChange,
            } = this.props;

            const attributes = {};

            if ( color ) {
                attributes.style = `background-color: ${ color };`;
            }

            const toggleFormat = toggle ? wp.richText.toggleFormat : wp.richText.applyFormat;

            onChange( toggleFormat(
                value,
                {
                    type: name,
                    attributes: attributes,
                }
            ) );
        }

        render() {
            const {
                value,
                isActive,
            } = this.props;

            return (
                <Fragment>
                    <RichTextToolbarButton
                        icon="tag"
                        title="Badge"
                        onClick={ () => {
                            this.toggleFormat();
                        } }
                        isActive={ isActive }
                    />
                    { isActive ? (
                        <PositionedAtSelection
                            key={ `${ value.start }${ value.end }` /* Used to force rerender on selection change */ }
                        >
                            <Popover
                                focusOnMount={ false }
                                position="bottom"
                                className="ghostkit-format-badge-popover"
                            >
                                <ColorPalette
                                    value={ value }
                                    onChange={ ( color ) => {
                                        this.toggleFormat( color, false );
                                    } }
                                />
                            </Popover>
                        </PositionedAtSelection>
                    ) : '' }
                </Fragment>
            );
        }
    },
};
