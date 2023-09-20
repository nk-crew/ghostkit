/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const { __ } = wp.i18n;

const { RichText, useBlockProps, useInnerBlocksProps } = wp.blockEditor;

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes } = props;
  let { className = '' } = props;

  const { version, date } = attributes;

  className = classnames('ghostkit-changelog', className);

  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });
  const innerBlockProps = useInnerBlocksProps(
    {
      className: 'ghostkit-changelog-inner',
    },
    {
      templateLock: false,
      template: [
        [
          'core/list',
          {
            className: 'is-style-none',
            values: [
              <li key="list-item-1">
                <span className="ghostkit-badge" style={{ backgroundColor: '#4ab866' }}>
                  {__('Added', '@@text_domain')}
                </span>
                {__('Something', '@@text_domain')}
              </li>,
              <li key="list-item-2">
                <span className="ghostkit-badge" style={{ backgroundColor: '#0366d6' }}>
                  {__('Fixed', '@@text_domain')}
                </span>
                {__('Something', '@@text_domain')}
              </li>,
              <li key="list-item-3">
                <span className="ghostkit-badge" style={{ backgroundColor: '#0366d6' }}>
                  {__('Improved', '@@text_domain')}
                </span>
                {__('Something', '@@text_domain')}
              </li>,
            ],
          },
        ],
      ],
    }
  );

  return (
    <div {...blockProps}>
      <div className="ghostkit-changelog-version">
        <RichText
          inlineToolbar
          tagName="span"
          placeholder={__('1.0.0', '@@text_domain')}
          value={version}
          onChange={(value) => setAttributes({ version: value })}
        />
      </div>
      <div className="ghostkit-changelog-date">
        <RichText
          inlineToolbar
          tagName="h2"
          placeholder={__('18 September 2019', '@@text_domain')}
          value={date}
          onChange={(value) => setAttributes({ date: value })}
          style={{ margin: 0 }}
        />
      </div>
      <div className="ghostkit-changelog-more">
        <div {...innerBlockProps} />
      </div>
    </div>
  );
}
