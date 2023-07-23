// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import getIcon from '../../utils/get-icon';

const { applyFilters } = wp.hooks;
const { __ } = wp.i18n;
const { Component } = wp.element;

const { InnerBlocks } = wp.blockEditor;

class TabBlock extends Component {
  render() {
    let { className = '' } = this.props;

    className = classnames(className, 'ghostkit-tab');

    className = applyFilters('ghostkit.editor.className', className, this.props);

    return (
      <div className={className}>
        <InnerBlocks templateLock={false} />
      </div>
    );
  }
}

export const name = 'ghostkit/tabs-tab';

export const settings = {
  title: __('Tab', '@@text_domain'),
  parent: ['ghostkit/tabs'],
  description: __('A single tab within a tabs block.', '@@text_domain'),
  icon: getIcon('block-tabs', true),
  category: 'ghostkit',
  ghostkit: {
    supports: {
      styles: true,
      spacings: true,
      position: true,
      display: true,
      scrollReveal: true,
    },
  },
  supports: {
    html: false,
    className: false,
    anchor: true,
    inserter: false,
    reusable: false,
  },
  attributes: {
    tabNumber: {
      type: 'number',
    },
  },

  edit: TabBlock,

  getEditWrapperProps(attributes) {
    return { 'data-tab': attributes.tabNumber };
  },

  save(props) {
    const { tabNumber } = props.attributes;

    let className = 'ghostkit-tab';

    className = applyFilters('ghostkit.blocks.className', className, {
      ...{
        name,
      },
      ...props,
    });

    return (
      <div className={className} data-tab={tabNumber}>
        <InnerBlocks.Content />
      </div>
    );
  },
};
