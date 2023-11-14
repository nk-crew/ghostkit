/* eslint-disable max-classes-per-file */
/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import Modal from '../../components/modal';
import CodeEditor from '../../components/code-editor';

/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

const { __ } = wp.i18n;
const { Component } = wp.element;
const { apiFetch } = wp;

const { compose } = wp.compose;

const { PluginMoreMenuItem } = wp.editPost || {};

const { withSelect, withDispatch } = wp.data;

const { TabPanel, Tooltip } = wp.components;

class CustomCodeModal extends Component {
  constructor(props) {
    super(props);

    const { meta = {} } = this.props;

    this.state = {
      customCSS: meta.ghostkit_custom_css,
      customJSHead: meta.ghostkit_custom_js_head,
      customJSFoot: meta.ghostkit_custom_js_foot,

      globalCustomCSS: false,
      globalCustomJSHead: false,
      globalCustomJSFoot: false,
    };

    this.maybePrepareGlobalCode = this.maybePrepareGlobalCode.bind(this);
  }

  componentDidMount() {
    this.maybePrepareGlobalCode();
  }

  componentDidUpdate() {
    this.maybePrepareGlobalCode();
  }

  maybePrepareGlobalCode() {
    const { customCode = {} } = this.props;

    if (
      customCode &&
      this.state.globalCustomCSS === false &&
      this.state.globalCustomJSHead === false &&
      this.state.globalCustomJSFoot === false
    ) {
      this.setState({
        globalCustomCSS: customCode.ghostkit_custom_css || '',
        globalCustomJSHead: customCode.ghostkit_custom_js_head || '',
        globalCustomJSFoot: customCode.ghostkit_custom_js_foot || '',
      });
    }
  }

  render() {
    const { updateMeta, updateCustomCode, onRequestClose } = this.props;

    return (
      <Modal
        className="ghostkit-plugin-custom-code-modal"
        position="top"
        size="md"
        title={__('CSS & JavaScript', '@@text_domain')}
        onRequestClose={() => {
          const local = this.props.meta || {};
          const global = this.props.customCode || {};
          const newLocal = {};
          const newGlobal = {};

          // Local
          if (this.state.customCSS !== local.ghostkit_custom_css) {
            newLocal.ghostkit_custom_css = this.state.customCSS;
          }
          if (this.state.customJSHead !== local.ghostkit_custom_js_head) {
            newLocal.ghostkit_custom_js_head = this.state.customJSHead;
          }
          if (this.state.customJSFoot !== local.ghostkit_custom_js_foot) {
            newLocal.ghostkit_custom_js_foot = this.state.customJSFoot;
          }
          if (Object.keys(newLocal).length) {
            updateMeta(newLocal);
          }

          // Global
          if (this.state.globalCustomCSS !== global.ghostkit_custom_css) {
            newGlobal.ghostkit_custom_css = this.state.globalCustomCSS;
          }
          if (this.state.globalCustomJSHead !== global.ghostkit_custom_js_head) {
            newGlobal.ghostkit_custom_js_head = this.state.globalCustomJSHead;
          }
          if (this.state.globalCustomJSFoot !== global.ghostkit_custom_js_foot) {
            newGlobal.ghostkit_custom_js_foot = this.state.globalCustomJSFoot;
          }

          if (Object.keys(newGlobal).length) {
            updateCustomCode(newGlobal);
          }

          onRequestClose();
        }}
        icon={getIcon('plugin-custom-code')}
      >
        <TabPanel
          className="ghostkit-control-tabs ghostkit-component-modal-tab-panel"
          tabs={[
            {
              name: 'local',
              title: (
                <Tooltip
                  text={__(
                    'All changes will be applied on the current page only.',
                    '@@text_domain'
                  )}
                >
                  <span>{__('Local', '@@text_domain')}</span>
                </Tooltip>
              ),
              className: 'ghostkit-control-tabs-tab',
            },
            {
              name: 'global',
              title: (
                <Tooltip text={__('All changes will be applied site wide.', '@@text_domain')}>
                  <span>{__('Global', '@@text_domain')}</span>
                </Tooltip>
              ),
              className: 'ghostkit-control-tabs-tab',
            },
          ]}
        >
          {(tabData) => {
            const isGlobal = tabData.name === 'global';

            return (
              <Fragment>
                <h4>{__('CSS', '@@text_domain')}</h4>
                <CodeEditor
                  mode="css"
                  onChange={(value) => {
                    this.setState({
                      [isGlobal ? 'globalCustomCSS' : 'customCSS']: value,
                    });
                  }}
                  value={(isGlobal ? this.state.globalCustomCSS : this.state.customCSS) || ''}
                  maxLines={20}
                  minLines={5}
                  height="300px"
                />

                <h4>{__('JavaScript', '@@text_domain')}</h4>
                <p className="ghostkit-help-text">
                  {__(
                    'Add custom JavaScript code in <head> section or in the end of <body> tag. Insert Google Analytics, Tag Manager or other JavaScript code snippets.',
                    '@@text_domain'
                  )}
                </p>
                <p>
                  <code className="ghostkit-code">{'<head>'}</code> :
                </p>
                <CodeEditor
                  mode="javascript"
                  onChange={(value) => {
                    this.setState({
                      [isGlobal ? 'globalCustomJSHead' : 'customJSHead']: value,
                    });
                  }}
                  value={(isGlobal ? this.state.globalCustomJSHead : this.state.customJSHead) || ''}
                  maxLines={20}
                  minLines={5}
                  height="300px"
                />
                <p>
                  <code className="ghostkit-code">{'<foot>'}</code> :
                </p>
                <CodeEditor
                  mode="javascript"
                  onChange={(value) => {
                    this.setState({
                      [isGlobal ? 'globalCustomJSFoot' : 'customJSFoot']: value,
                    });
                  }}
                  value={(isGlobal ? this.state.globalCustomJSFoot : this.state.customJSFoot) || ''}
                  maxLines={20}
                  minLines={5}
                  height="300px"
                />
              </Fragment>
            );
          }}
        </TabPanel>
      </Modal>
    );
  }
}

const CustomCodeModalWithSelect = compose([
  withSelect((select) => {
    const currentMeta = select('core/editor').getCurrentPostAttribute('meta');
    const editedMeta = select('core/editor').getEditedPostAttribute('meta');
    const customCode = select('ghostkit/plugins/custom-code').getCustomCode();

    return {
      meta: { ...currentMeta, ...editedMeta },
      customCode,
    };
  }),
  withDispatch((dispatch) => ({
    updateMeta(value) {
      dispatch('core/editor').editPost({ meta: value });
    },
    updateCustomCode(value) {
      dispatch('ghostkit/plugins/custom-code').setCustomCode(value);

      apiFetch({
        path: '/ghostkit/v1/update_custom_code',
        method: 'POST',
        data: {
          data: value,
        },
      });
    },
  })),
])(CustomCodeModal);

export { CustomCodeModalWithSelect as CustomCodeModal };

export const name = 'ghostkit-custom-code';

export const icon = null;

export class Plugin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };
  }

  render() {
    const { isModalOpen } = this.state;

    return (
      <Fragment>
        {PluginMoreMenuItem ? (
          <PluginMoreMenuItem
            icon={null}
            onClick={() => {
              this.setState({ isModalOpen: true });
            }}
          >
            {__('CSS & JavaScript', '@@text_domain')}
          </PluginMoreMenuItem>
        ) : null}
        {isModalOpen ? (
          <CustomCodeModalWithSelect onRequestClose={() => this.setState({ isModalOpen: false })} />
        ) : (
          ''
        )}
      </Fragment>
    );
  }
}
