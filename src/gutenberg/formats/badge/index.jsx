// Import CSS
import './style.scss';
import './editor.scss';

import { BadgePopover, getSelectedBadge } from './badge-popover';

const { __ } = wp.i18n;

const {
    Component,
    Fragment,
} = wp.element;

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

            this.state = {
                currentColor: '',
            };

            this.toggleFormat = this.toggleFormat.bind( this );
        }

        componentDidUpdate() {
            const {
                isActive,
            } = this.props;

            if ( ! this.state.currentColor && isActive ) {
                const $badge = getSelectedBadge();

                if ( $badge ) {
                    const currentColor = $badge.style.getPropertyValue( 'background-color' );

                    if ( currentColor ) {
                        this.setState( { currentColor } );
                    }
                }
            }
        }

        toggleFormat( color, toggle = true ) {
            const {
                value,
                onChange,
            } = this.props;

            const attributes = {};

            if ( color ) {
                attributes.style = `background-color: ${ color };`;

                this.setState( { currentColor: color } );
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
                        <BadgePopover>
                            <ColorPalette
                                value={ this.state.currentColor }
                                onChange={ ( color ) => {
                                    this.toggleFormat( color, false );
                                } }
                            />
                        </BadgePopover>
                    ) : '' }
                </Fragment>
            );
        }
    },
};
