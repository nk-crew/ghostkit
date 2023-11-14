/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import { loadBlockEditorAssets } from '../../utils/block-editor-asset-loader';

import GistFilesSelect from './file-select';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Fragment, useEffect, useState, useRef } = wp.element;

const { PanelBody, TextControl, ToggleControl, Placeholder, ExternalLink } = wp.components;

const { InspectorControls, useBlockProps } = wp.blockEditor;

const { gistSimple } = window;

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes } = props;
  const { url, file, caption, showFooter, showLineNumbers } = attributes;

  const [sUrl, setUrl] = useState(attributes.url);
  const gistNode = useRef();
  const cachedRequest = useRef();
  const urlTimeout = useRef();

  let { className = '' } = props;

  function getValidGistUrl() {
    if (url) {
      const match = /^https:\/\/gist.github.com?.+\/(.+)/g.exec(url);

      if (match && typeof match[1] !== 'undefined') {
        return match[1].split('#')[0];
      }
    }

    return false;
  }

  function onUpdate() {
    if (!url || !gistNode?.current) {
      return;
    }

    const validUrl = getValidGistUrl();

    if (!validUrl) {
      return;
    }

    if (typeof gistSimple === 'undefined') {
      // eslint-disable-next-line no-console
      console.warn(__('Gist Simple plugin is not defined.', '@@text_domain'));
      return;
    }

    // cache request to prevent reloading.
    const newCachedRequest =
      validUrl + file + caption + (showFooter ? 1 : 0) + (showLineNumbers ? 1 : 0);
    if (newCachedRequest === cachedRequest?.current) {
      return;
    }
    cachedRequest.current = newCachedRequest;

    setTimeout(() => {
      if (gistNode.current.GistSimple) {
        gistNode.current.GistSimple.destroy();
      }

      gistSimple(gistNode.current, {
        id: validUrl,
        file,
        caption,
        showFooter,
        showLineNumbers,
      });
    }, 0);
  }

  // Mount and update.
  useEffect(() => {
    onUpdate();
  });

  // Load assets.
  useEffect(() => {
    if (gistNode?.current) {
      loadBlockEditorAssets('css', 'gist-simple-css', gistNode.current);
    }
  }, [gistNode]);

  function urlOnChange(value, timeout = 1000) {
    setUrl(value);

    clearTimeout(urlTimeout.current);

    urlTimeout.current = setTimeout(() => {
      setAttributes({ url: value });
    }, timeout);
  }

  className = classnames('ghostkit-gist', className);
  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody>
          <TextControl
            label={__('URL', '@@text_domain')}
            type="url"
            value={sUrl}
            onChange={(val) => urlOnChange(val)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                urlOnChange(sUrl, 0);
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

      <div {...blockProps}>
        {!url ? (
          <Placeholder
            icon={getIcon('block-gist')}
            label={__('Gist URL', '@@text_domain')}
            className={className}
          >
            <TextControl
              placeholder="https://gist.github.com/..."
              value={sUrl}
              onChange={(val) => urlOnChange(val)}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  urlOnChange(sUrl, 0);
                }
              }}
            />
            <ExternalLink href="https://gist.github.com/">
              {__('Visit GitHub Gist Site', '@@text_domain')}
            </ExternalLink>
          </Placeholder>
        ) : null}
        {url ? (
          <div
            ref={gistNode}
            className={className}
            data-url={url}
            data-file={file}
            data-caption={caption}
            data-show-footer={showFooter ? 'true' : 'false'}
            data-show-line-numbers={showLineNumbers ? 'true' : 'false'}
          />
        ) : null}
      </div>
    </Fragment>
  );
}
