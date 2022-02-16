/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import GistFilesSelect from './file-select';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { PanelBody, TextControl, ToggleControl, Placeholder, ToolbarGroup, ExternalLink } =
  wp.components;

const { InspectorControls, BlockControls } = wp.blockEditor;

const { jQuery } = window;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: '',
    };

    this.onUpdate = this.onUpdate.bind(this);
    this.urlOnChange = this.urlOnChange.bind(this);
    this.getValidGistUrl = this.getValidGistUrl.bind(this);
  }

  componentDidMount() {
    this.setState({ url: this.props.attributes.url });
    this.onUpdate();
  }

  componentDidUpdate() {
    this.onUpdate();
  }

  onUpdate() {
    const { url, file, caption, showFooter, showLineNumbers } = this.props.attributes;

    if (!url || !this.gistNode) {
      return;
    }

    const validUrl = this.getValidGistUrl();

    if (!validUrl) {
      return;
    }

    if ('undefined' === typeof jQuery.fn.gistsimple) {
      // eslint-disable-next-line no-console
      console.warn(__('Gist Simple plugin is not defined.', '@@text_domain'));
      return;
    }

    // cache request to prevent reloading.
    const cachedRequest =
      validUrl + file + caption + (showFooter ? 1 : 0) + (showLineNumbers ? 1 : 0);
    if (cachedRequest === this.cachedRequest) {
      return;
    }
    this.cachedRequest = cachedRequest;

    setTimeout(() => {
      const $gist = jQuery(this.gistNode);

      if ($gist[0].GistSimple) {
        $gist.gistsimple('destroy');
      }

      $gist.gistsimple({
        id: validUrl,
        file,
        caption,
        showFooter,
        showLineNumbers,
      });
    }, 0);
  }

  getValidGistUrl() {
    const { url } = this.props.attributes;

    if (url) {
      const match = /^https:\/\/gist.github.com?.+\/(.+)/g.exec(url);

      if (match && 'undefined' !== typeof match[1]) {
        return match[1].split('#')[0];
      }
    }

    return false;
  }

  urlOnChange(value, timeout = 1000) {
    this.setState({ url: value });

    clearTimeout(this.urlTimeout);

    this.urlTimeout = setTimeout(() => {
      this.props.setAttributes({ url: value });
    }, timeout);
  }

  render() {
    const { attributes, setAttributes } = this.props;

    let { className = '' } = this.props;

    const { url, file, caption, showFooter, showLineNumbers } = attributes;

    className = classnames('ghostkit-gist', className);

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <Fragment>
        <BlockControls>
          {url ? (
            <ToolbarGroup>
              <TextControl
                type="url"
                value={this.state.url}
                placeholder={__('Gist URL', '@@text_domain')}
                onChange={this.urlOnChange}
                onKeyDown={(e) => {
                  if (13 === e.keyCode) {
                    this.urlOnChange(this.state.url, 0);
                  }
                }}
                className="ghostkit-gist-toolbar-url"
              />
            </ToolbarGroup>
          ) : (
            ''
          )}
          {this.getValidGistUrl() ? (
            <ToolbarGroup>
              <GistFilesSelect
                label={__('File', '@@text_domain')}
                url={url}
                value={file}
                isToolbar
                onChange={(value) => setAttributes({ file: value })}
              />
            </ToolbarGroup>
          ) : (
            ''
          )}
        </BlockControls>
        <InspectorControls>
          <PanelBody>
            <TextControl
              label={__('URL', '@@text_domain')}
              type="url"
              value={this.state.url}
              onChange={this.urlOnChange}
              onKeyDown={(e) => {
                if (13 === e.keyCode) {
                  this.urlOnChange(this.state.url, 0);
                }
              }}
            />
            <GistFilesSelect
              label={__('File', '@@text_domain')}
              url={url}
              value={file}
              onChange={(value) => setAttributes({ file: value })}
            />
          </PanelBody>
          <PanelBody>
            <TextControl
              label={__('Caption', '@@text_domain')}
              value={caption}
              onChange={(value) => setAttributes({ caption: value })}
            />
            <ToggleControl
              label={__('Show footer', '@@text_domain')}
              checked={!!showFooter}
              onChange={(val) => setAttributes({ showFooter: val })}
            />
            <ToggleControl
              label={__('Show line numbers', '@@text_domain')}
              checked={!!showLineNumbers}
              onChange={(val) => setAttributes({ showLineNumbers: val })}
            />
          </PanelBody>
        </InspectorControls>

        <div>
          {!url ? (
            <Placeholder
              icon={getIcon('block-gist')}
              label={__('Gist URL', '@@text_domain')}
              className={className}
            >
              <TextControl
                placeholder="https://gist.github.com/..."
                value={this.state.url}
                onChange={this.urlOnChange}
                onKeyDown={(e) => {
                  if (13 === e.keyCode) {
                    this.urlOnChange(this.state.url, 0);
                  }
                }}
              />
              <ExternalLink href="https://gist.github.com/">
                {__('Visit GitHub Gist Site', '@@text_domain')}
              </ExternalLink>
            </Placeholder>
          ) : (
            ''
          )}
          {url ? (
            <div
              ref={(gistNode) => {
                this.gistNode = gistNode;
              }}
              className={className}
              data-url={url}
              data-file={file}
              data-caption={caption}
              data-show-footer={showFooter ? 'true' : 'false'}
              data-show-line-numbers={showLineNumbers ? 'true' : 'false'}
            />
          ) : (
            ''
          )}
        </div>
      </Fragment>
    );
  }
}

export default BlockEdit;
