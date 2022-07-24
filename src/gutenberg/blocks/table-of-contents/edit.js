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

const { Component, Fragment, RawHTML } = wp.element;

const { PanelBody, Placeholder, SelectControl, Spinner, Disabled } = wp.components;

const { applyFilters } = wp.hooks;

const { withSelect } = wp.data;

const { InspectorControls, RichText } = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  render() {
    let { className } = this.props;

    const { setAttributes, attributes, headings, tocHTML, isSelected } = this.props;

    const { title, allowedHeaders, listStyle } = attributes;

    className = classnames('ghostkit-toc', className);

    className = applyFilters('ghostkit.editor.className', className, this.props);

    // Save old toc HTML.
    if (
      headings &&
      headings.length &&
      tocHTML &&
      (!this.oldTocHTML || this.oldTocHTML !== tocHTML)
    ) {
      this.oldTocHTML = tocHTML;
    }

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
        {!headings || !headings.length ? (
          <Placeholder
            icon={getIcon('block-table-of-contents')}
            label={__('Table of Contents', '@@text_domain')}
            instructions={__(
              'Start adding Heading blocks to create a table of contents. Headings with HTML anchors will be linked here.',
              '@@text_domain'
            )}
            className={className}
          />
        ) : (
          ''
        )}
        {headings && headings.length ? (
          <div className={className}>
            {!RichText.isEmpty(title) || isSelected ? (
              <RichText
                tagName="h5"
                className="ghostkit-toc-title"
                placeholder={__('Write title…', '@@text_domain')}
                format="string"
                value={title}
                onChange={(val) => setAttributes({ title: val })}
              />
            ) : (
              ''
            )}
            {!tocHTML ? (
              <div className="ghostkit-toc-spinner">
                <Spinner />
              </div>
            ) : (
              ''
            )}
            {tocHTML || this.oldTocHTML ? (
              <Disabled>
                <div className="ghostkit-toc-list block-library-list">
                  <RawHTML>{tocHTML || this.oldTocHTML}</RawHTML>
                </div>
              </Disabled>
            ) : (
              ''
            )}
          </div>
        ) : (
          ''
        )}
      </Fragment>
    );
  }
}

export default withSelect((select, props) => {
  const { getBlocks } = select('core/block-editor');

  const { allowedHeaders, listStyle } = props.attributes;

  const blocks = getBlocks();
  const headings = getAllHeadings(blocks, allowedHeaders);

  return {
    headings,
    tocHTML: select('ghostkit/blocks/table-of-contents').getTOC({
      headings,
      allowedHeaders,
      listStyle,
    }),
  };
})(BlockEdit);
