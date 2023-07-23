/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component } = wp.element;

const { InnerBlocks, RichText } = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  render() {
    const { attributes, setAttributes } = this.props;

    let { className = '' } = this.props;

    const { version, date } = attributes;

    className = classnames('ghostkit-changelog', className);

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <div className={className}>
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
          />
        </div>
        <div className="ghostkit-changelog-more">
          <InnerBlocks
            template={[
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
            ]}
            templateLock={false}
          />
        </div>
      </div>
    );
  }
}

export default BlockEdit;
