/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import getUniqueSlug from '../../utils/get-unique-slug';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { withSelect } = wp.data;

const { ToolbarButton } = wp.components;

const { BlockControls, InnerBlocks, RichText } = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  constructor(props) {
    super(props);

    this.updateSlug = this.updateSlug.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { attributes } = this.props;

    const { attributes: prevAttributes } = prevProps;

    if (attributes.heading !== prevAttributes.heading || !attributes.slug) {
      this.updateSlug();
    }
  }

  updateSlug() {
    const { attributes, setAttributes, clientId } = this.props;

    const { heading } = attributes;

    const newSlug = getUniqueSlug(`accordion ${heading}`, clientId);

    setAttributes({
      slug: newSlug,
    });
  }

  render() {
    const { attributes, setAttributes, hasChildBlocks } = this.props;

    let { className = '' } = this.props;

    const { heading, active } = attributes;

    className = classnames(
      className,
      'ghostkit-accordion-item',
      active ? 'ghostkit-accordion-item-active' : ''
    );

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <Fragment>
        <BlockControls>
          <ToolbarButton
            icon={getIcon('icon-collapse')}
            label={__('Collapse', '@@text_domain')}
            onClick={() => setAttributes({ active: !active })}
            isActive={active}
          />
        </BlockControls>
        <div className={className}>
          <div className="ghostkit-accordion-item-heading">
            <RichText
              tagName="div"
              className="ghostkit-accordion-item-label"
              placeholder={__('Write label…', '@@text_domain')}
              value={heading}
              onChange={(value) => {
                setAttributes({ heading: value });
              }}
              withoutInteractiveFormatting
            />
            {/* eslint-disable-next-line react/button-has-type */}
            <button
              className="ghostkit-accordion-item-collapse"
              onClick={() => setAttributes({ active: !active })}
            >
              <svg
                className="ghostkit-svg-icon"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.21967 6.2197C9.51256 5.9268 9.98744 5.9268 10.2803 6.2197L15.5303 11.4697C15.8232 11.7626 15.8232 12.2374 15.5303 12.5303L10.2803 17.7803C9.98744 18.0732 9.51256 18.0732 9.21967 17.7803C8.92678 17.4874 8.92678 17.0126 9.21967 16.7197L13.9393 12L9.21967 7.2803C8.92678 6.9874 8.92678 6.5126 9.21967 6.2197Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <div className="ghostkit-accordion-item-content">
            <InnerBlocks
              templateLock={false}
              renderAppender={hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withSelect((select, props) => {
  const { clientId } = props;
  const blockEditor = select('core/block-editor');

  return {
    hasChildBlocks: blockEditor ? blockEditor.getBlockOrder(clientId).length > 0 : false,
  };
})(BlockEdit);
