/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import getAllHeadings from './get-all-headings';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Fragment, RawHTML, useRef } = wp.element;

const { PanelBody, Placeholder, SelectControl, Spinner, Disabled } = wp.components;

const { applyFilters } = wp.hooks;

const { useSelect } = wp.data;

const { InspectorControls, RichText, useBlockProps } = wp.blockEditor;

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const oldTocHTML = useRef();

  let { className } = props;

  const { setAttributes, attributes, isSelected } = props;

  const { title, allowedHeaders, listStyle } = attributes;

  const { headings, tocHTML } = useSelect((select) => {
    const { getBlocks } = select('core/block-editor');

    const blocks = getBlocks();
    const foundHeadings = getAllHeadings(blocks, allowedHeaders);

    return {
      headings: foundHeadings,
      tocHTML: select('ghostkit/blocks/table-of-contents').getTOC({
        headings: foundHeadings,
        allowedHeaders,
        listStyle,
      }),
    };
  });

  className = classnames('ghostkit-toc', className);

  className = applyFilters('ghostkit.editor.className', className, props);

  // Save old toc HTML.
  if (
    headings &&
    headings.length &&
    tocHTML &&
    (!oldTocHTML.current || oldTocHTML.current !== tocHTML)
  ) {
    oldTocHTML.current = tocHTML;
  }

  const blockProps = useBlockProps({ className });

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody>
          <SelectControl
            label={__('Allowed Headers', '@@text_domain')}
            value={allowedHeaders}
            options={[
              {
                value: 1,
                label: __('Heading 1', '@@text_domain'),
              },
              {
                value: 2,
                label: __('Heading 2', '@@text_domain'),
              },
              {
                value: 3,
                label: __('Heading 3', '@@text_domain'),
              },
              {
                value: 4,
                label: __('Heading 4', '@@text_domain'),
              },
              {
                value: 5,
                label: __('Heading 5', '@@text_domain'),
              },
              {
                value: 6,
                label: __('Heading 6', '@@text_domain'),
              },
            ]}
            onChange={(val) => {
              setAttributes({
                allowedHeaders: val.map((level) => parseInt(level, 10)),
              });
            }}
            multiple
          />
          <SelectControl
            label={__('List Style', '@@text_domain')}
            value={listStyle}
            options={[
              {
                value: 'ol',
                label: __('Numbered List', '@@text_domain'),
              },
              {
                value: 'ul',
                label: __('Dotted List', '@@text_domain'),
              },
              {
                value: 'ol-styled',
                label: __('Numbered List Styled', '@@text_domain'),
              },
              {
                value: 'ul-styled',
                label: __('Dotted List Styled', '@@text_domain'),
              },
            ]}
            onChange={(val) => setAttributes({ listStyle: val })}
          />
        </PanelBody>
      </InspectorControls>
      {headings && headings.length ? (
        <div {...blockProps}>
          {!RichText.isEmpty(title) || isSelected ? (
            <RichText
              inlineToolbar
              tagName="h5"
              className="ghostkit-toc-title"
              placeholder={__('Write title…', '@@text_domain')}
              format="string"
              value={title}
              onChange={(val) => setAttributes({ title: val })}
            />
          ) : null}
          {!tocHTML ? (
            <div className="ghostkit-toc-spinner">
              <Spinner />
            </div>
          ) : null}
          {tocHTML || oldTocHTML.current ? (
            <Disabled>
              <div className="ghostkit-toc-list block-library-list">
                <RawHTML>{tocHTML || oldTocHTML.current}</RawHTML>
              </div>
            </Disabled>
          ) : null}
        </div>
      ) : (
        <Placeholder
          icon={getIcon('block-table-of-contents')}
          label={__('Table of Contents', '@@text_domain')}
          instructions={__(
            'Start adding Heading blocks to create a table of contents. Headings with HTML anchors will be linked here.',
            '@@text_domain'
          )}
          {...blockProps}
        />
      )}
    </Fragment>
  );
}
