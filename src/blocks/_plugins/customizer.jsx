// Import CSS
import './customizer.scss';

// Internal Dependencies.
import ElementIcon from '../_icons/plugin-customizer.svg';

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

class CustomizerPlugin extends Component {
    render() {
        const {
            meta,
            updateCustomizerData,
        } = this.props;

        return (
            <Fragment>
                <PluginSidebarMoreMenuItem
                    target="ghostkit-customizer"
                >
                    { __( 'Customizer' ) }
                </PluginSidebarMoreMenuItem>
                <PluginSidebar
                    name="ghostkit-customizer"
                    title={ __( 'Customizer' ) }
                >
                    <BlockEdit
                        name="ghostkit/customizer"
                        isSelected={ false }
                        isPlugin={ true }
                        attributes={ {
                            options: meta.ghostkit_customizer_options,
                        } }
                        setAttributes={ ( { options } ) => {
                            updateCustomizerData( options, meta );
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
        updateCustomizerData( value, meta ) {
            meta = {
                ...meta,
                ghostkit_customizer_options: value,
            };

            dispatch( 'core/editor' ).editPost( { meta } );
        },
    } ) ),
] )( CustomizerPlugin );

registerPlugin( 'ghostkit-customizer', {
    icon: <ElementIcon className="ghostkit-customizer-plugin-icon" />,
    render: plugin,
} );
