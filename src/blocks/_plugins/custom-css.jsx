// Import CSS
import './custom-css.scss';

// Internal Dependencies.
import ElementIcon from '../_icons/plugin-custom-css.svg';

const {
    Fragment,
} = wp.element;

const { __ } = wp.i18n;
const { Component } = wp.element;

const { compose } = wp.compose;

const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { registerPlugin } = wp.plugins;

const {
    withSelect,
    withDispatch,
} = wp.data;

const {
    BlockEdit,
} = wp.editor;

class CustomCSSPlugin extends Component {
    render() {
        const {
            meta,
            updateCustomCSS,
        } = this.props;

        return (
            <Fragment>
                <PluginSidebarMoreMenuItem
                    target="ghostkit-custom-css"
                >
                    { __( 'Custom CSS' ) }
                </PluginSidebarMoreMenuItem>
                <PluginSidebar
                    name="ghostkit-custom-css"
                    title={ __( 'Custom CSS' ) }
                >
                    <BlockEdit
                        name="ghostkit/custom-css"
                        isSelected={ false }
                        isPlugin={ true }
                        attributes={ {
                            customCSS: meta.ghostkit_custom_css,
                        } }
                        setAttributes={ ( { customCSS } ) => {
                            updateCustomCSS( customCSS, meta );
                        } }
                        user={ {} }
                    />
                </PluginSidebar>
            </Fragment>
        );
    }
}

const plugin = compose( [
    withSelect( ( select ) => {
        const currentMeta = select( 'core/editor' ).getCurrentPostAttribute( 'meta' );
        const editedMeta = select( 'core/editor' ).getEditedPostAttribute( 'meta' );
        return {
            meta: { ...currentMeta, ...editedMeta },
        };
    } ),
    withDispatch( ( dispatch ) => ( {
        updateCustomCSS( value, meta ) {
            meta = {
                ...meta,
                ghostkit_custom_css: value,
            };
            dispatch( 'core/editor' ).editPost( { meta } );
        },
    } ) ),
] )( CustomCSSPlugin );

registerPlugin( 'ghostkit-custom-css', {
    icon: <ElementIcon className="ghostkit-custom-css-plugin-icon" />,
    render: plugin,
} );
