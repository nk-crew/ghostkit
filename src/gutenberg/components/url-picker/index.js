/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const {
    Popover,
    ToolbarGroup,
    ToolbarButton,
    KeyboardShortcuts,
    PanelBody,
    TextControl,
} = wp.components;

const {
    InspectorControls,
    BlockControls,
    __experimentalLinkControl: LinkControl,
} = wp.blockEditor;

const {
    rawShortcut,
    displayShortcut,
} = wp.keycodes;

/**
 * Internal dependencies
 */
const NEW_TAB_REL = 'noreferrer noopener';

/**
 * Component Class
 */
export default class URLPicker extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            toolbarSettingsOpened: false,
        };

        this.onChange = this.onChange.bind( this );
        this.toggleToolbarSettings = this.toggleToolbarSettings.bind( this );
        this.linkControl = this.linkControl.bind( this );
    }

    onChange( data ) {
        const {
            rel,
            target,
            url,
        } = this.props;

        const newData = {
            rel,
            target,
            url,
            ...data,
        };

        if ( target !== newData.target ) {
            let updatedRel = newData.rel;

            if ( newData.target && ! newData.rel ) {
                updatedRel = NEW_TAB_REL;
            } else if ( ! newData.target && newData.rel === NEW_TAB_REL ) {
                updatedRel = undefined;
            }

            newData.rel = updatedRel;
        }

        this.props.onChange( newData );
    }

    toggleToolbarSettings( open ) {
        this.setState( ( prevState ) => ( {
            toolbarSettingsOpened: 'undefined' !== typeof open ? open : ! prevState.toolbarSettingsOpened,
        } ) );
    }

    linkControl() {
        const {
            url,
            target,
        } = this.props;

        const {
            onChange,
        } = this;

        return (
            <LinkControl
                className="wp-block-navigation-link__inline-link-input"
                value={ {
                    url,
                    opensInNewTab: '_blank' === target,
                } }
                onChange={ ( {
                    url: newURL = '',
                    opensInNewTab: newOpensInNewTab,
                } ) => {
                    onChange( {
                        url: newURL,
                        target: newOpensInNewTab ? '_blank' : '',
                    } );
                } }
            />
        );
    }

    render() {
        const {
            rel,
            toolbarSettings = true,
            inspectorSettings = true,
            isSelected,
        } = this.props;

        const {
            onChange,
        } = this;

        const {
            toolbarSettingsOpened,
        } = this.state;

        return (
            <Fragment>
                { toolbarSettings ? (
                    <Fragment>
                        <BlockControls>
                            <ToolbarGroup>
                                <ToolbarButton
                                    name="link"
                                    icon={ <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" role="img" aria-hidden="true" focusable="false"><path d="M17.74 2.76c1.68 1.69 1.68 4.41 0 6.1l-1.53 1.52c-1.12 1.12-2.7 1.47-4.14 1.09l2.62-2.61.76-.77.76-.76c.84-.84.84-2.2 0-3.04-.84-.85-2.2-.85-3.04 0l-.77.76-3.38 3.38c-.37-1.44-.02-3.02 1.1-4.14l1.52-1.53c1.69-1.68 4.42-1.68 6.1 0zM8.59 13.43l5.34-5.34c.42-.42.42-1.1 0-1.52-.44-.43-1.13-.39-1.53 0l-5.33 5.34c-.42.42-.42 1.1 0 1.52.44.43 1.13.39 1.52 0zm-.76 2.29l4.14-4.15c.38 1.44.03 3.02-1.09 4.14l-1.52 1.53c-1.69 1.68-4.41 1.68-6.1 0-1.68-1.68-1.68-4.42 0-6.1l1.53-1.52c1.12-1.12 2.7-1.47 4.14-1.1l-4.14 4.15c-.85.84-.85 2.2 0 3.05.84.84 2.2.84 3.04 0z" /></svg> }
                                    title={ __( 'Link' ) }
                                    shortcut={ displayShortcut.primary( 'k' ) }
                                    onClick={ this.toggleToolbarSettings }
                                />
                            </ToolbarGroup>
                        </BlockControls>
                        { isSelected && (
                            <KeyboardShortcuts
                                bindGlobal
                                shortcuts={ {
                                    [ rawShortcut.primary( 'k' ) ]: this.toggleToolbarSettings,
                                } }
                            />
                        ) }
                        { toolbarSettingsOpened ? (
                            <Popover
                                position="bottom center"
                                onClose={ () => this.toggleToolbarSettings( false ) }
                            >
                                { this.linkControl() }
                            </Popover>
                        ) : '' }
                    </Fragment>
                ) : '' }
                { inspectorSettings ? (
                    <InspectorControls>
                        <PanelBody
                            title={ __( 'Link Settings' ) }
                            initialOpen={ false }
                            className="ghostkit-components-url-picker-inspector"
                        >
                            { this.linkControl() }
                            <TextControl
                                label={ __( 'Link Rel' ) }
                                value={ rel || '' }
                                onChange={ ( val ) => {
                                    onChange( {
                                        rel: val,
                                    } );
                                } }
                            />
                        </PanelBody>
                    </InspectorControls>
                ) : '' }
            </Fragment>
        );
    }
}
