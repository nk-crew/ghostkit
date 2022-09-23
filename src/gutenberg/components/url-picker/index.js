/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { Popover, ToolbarGroup, ToolbarButton, KeyboardShortcuts, PanelBody, TextControl } =
  wp.components;

const { InspectorControls, BlockControls, __experimentalLinkControl: LinkControl } = wp.blockEditor;

const { rawShortcut, displayShortcut } = wp.keycodes;

/**
 * Internal dependencies
 */
const NEW_TAB_REL = 'noreferrer noopener';

/**
 * Component Class
 */
export default class URLPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toolbarSettingsOpened: false,
    };

    this.onChange = this.onChange.bind(this);
    this.toggleToolbarSettings = this.toggleToolbarSettings.bind(this);
    this.linkControl = this.linkControl.bind(this);
  }

  onChange(data) {
    const { rel, target, url, ariaLabel } = this.props;

    const newData = {
      rel,
      target,
      url,
      ariaLabel,
      ...data,
    };

    if (target !== newData.target) {
      let updatedRel = newData.rel;

      if (newData.target && !newData.rel) {
        updatedRel = NEW_TAB_REL;
      } else if (!newData.target && newData.rel === NEW_TAB_REL) {
        updatedRel = undefined;
      }

      newData.rel = updatedRel;
    }

    this.props.onChange(newData);
  }

  toggleToolbarSettings(open) {
    this.setState((prevState) => ({
      toolbarSettingsOpened: 'undefined' !== typeof open ? open : !prevState.toolbarSettingsOpened,
    }));
  }

  linkControl() {
    const { url, target } = this.props;

    const { onChange } = this;

    return (
      <LinkControl
        className="wp-block-navigation-link__inline-link-input"
        value={{
          url,
          opensInNewTab: '_blank' === target,
        }}
        onChange={({ url: newURL = '', opensInNewTab: newOpensInNewTab }) => {
          onChange({
            url: newURL,
            target: newOpensInNewTab ? '_blank' : '',
          });
        }}
        onRemove={() => {
          onChange({
            url: '',
            target: '',
            rel: '',
          });
          this.toggleToolbarSettings(false);
        }}
      />
    );
  }

  render() {
    const { rel, ariaLabel, toolbarSettings = true, inspectorSettings = true, isSelected } = this.props;

    const { onChange } = this;

    const { toolbarSettingsOpened } = this.state;

    return (
      <Fragment>
        {toolbarSettings ? (
          <Fragment>
            <BlockControls>
              <ToolbarGroup>
                <ToolbarButton
                  name="link"
                  icon={
                    <svg
                      width="24"
                      height="24"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      role="img"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M15.6 7.2H14v1.5h1.6c2 0 3.7 1.7 3.7 3.7s-1.7 3.7-3.7 3.7H14v1.5h1.6c2.8 0 5.2-2.3 5.2-5.2 0-2.9-2.3-5.2-5.2-5.2zM4.7 12.4c0-2 1.7-3.7 3.7-3.7H10V7.2H8.4c-2.9 0-5.2 2.3-5.2 5.2 0 2.9 2.3 5.2 5.2 5.2H10v-1.5H8.4c-2 0-3.7-1.7-3.7-3.7zm4.6.9h5.3v-1.5H9.3v1.5z" />
                    </svg>
                  }
                  title={__('Link')}
                  shortcut={displayShortcut.primary('k')}
                  onClick={this.toggleToolbarSettings}
                />
              </ToolbarGroup>
            </BlockControls>
            {isSelected && (
              <KeyboardShortcuts
                bindGlobal
                shortcuts={{
                  [rawShortcut.primary('k')]: this.toggleToolbarSettings,
                }}
              />
            )}
            {toolbarSettingsOpened ? (
              <Popover position="bottom center" onClose={() => this.toggleToolbarSettings(false)}>
                {this.linkControl()}
              </Popover>
            ) : (
              ''
            )}
          </Fragment>
        ) : (
          ''
        )}
        {inspectorSettings ? (
          <InspectorControls>
            <PanelBody
              title={__('Link Settings')}
              initialOpen={false}
              className="ghostkit-components-url-picker-inspector"
            >
              {this.linkControl()}
              <TextControl
                label={__('Link Rel')}
                value={rel || ''}
                onChange={(val) => {
                  onChange({
                    rel: val,
                  });
                }}
              />
              <TextControl
                label={__('Accessible Label')}
                value={ariaLabel || ''}
                onChange={(val) => {
                  onChange({
                    ariaLabel: val,
                  });
                }}
              />
            </PanelBody>
          </InspectorControls>
        ) : (
          ''
        )}
      </Fragment>
    );
  }
}
