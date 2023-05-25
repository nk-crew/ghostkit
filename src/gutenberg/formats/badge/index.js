/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import ApplyFilters from '../../components/apply-filters';
import ColorPalette from '../../components/color-palette';

import { BadgePopover } from './badge-popover';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Component } = wp.element;

const { toggleFormat, applyFormat, getActiveFormat } = wp.richText;

const { RichTextToolbarButton } = wp.blockEditor;

export const name = 'ghostkit/badge';

export const settings = {
  title: __('Badge', '@@text_domain'),
  tagName: 'span',
  className: 'ghostkit-badge',
  attributes: {
    style: 'style',
  },
  edit: class BadgeFormat extends Component {
    constructor(props) {
      super(props);

      this.state = {
        openedPopover: false,
      };

      this.getCurrentColor = this.getCurrentColor.bind(this);
      this.toggleFormat = this.toggleFormat.bind(this);
    }

    componentDidUpdate() {
      const { isActive } = this.props;

      const { openedPopover } = this.state;

      // Close popover.
      if (!isActive && openedPopover) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          openedPopover: false,
        });
      }
    }

    getCurrentColor() {
      const { value } = this.props;

      const { attributes } = getActiveFormat(value, name);

      let color = '';

      if (attributes && attributes.style) {
        color = attributes.style.replace(/^background:\s*/, '').replace(/;$/, '');
      }

      return color;
    }

    toggleFormat(color, toggle = true) {
      const { value, onChange } = this.props;

      const attributes = {};

      if (color) {
        attributes.style = `background: ${color};`;
      } else {
        this.setState({ openedPopover: true });
      }

      const runFormat = toggle ? toggleFormat : applyFormat;

      onChange(
        runFormat(value, {
          type: name,
          attributes,
        })
      );
    }

    render() {
      const { value, isActive, contentRef } = this.props;

      const { openedPopover } = this.state;

      let currentColor = '';

      if (isActive) {
        currentColor = this.getCurrentColor();
      }

      return (
        <>
          <RichTextToolbarButton
            icon={getIcon('icon-badge')}
            title={__('Badge', '@@text_domain')}
            onClick={() => {
              if (!isActive) {
                this.toggleFormat();
              }

              this.setState({
                openedPopover: !openedPopover,
              });
            }}
            isActive={isActive}
          />
          {isActive && openedPopover ? (
            <BadgePopover value={value} name={name} contentRef={contentRef}>
              <ApplyFilters
                name="ghostkit.editor-format.controls"
                property="background"
                value={currentColor}
                format={name}
                data={this}
              >
                <ColorPalette
                  value={currentColor}
                  onChange={(color) => {
                    this.toggleFormat(color, !color);
                  }}
                  alpha
                  gradient
                />
              </ApplyFilters>
            </BadgePopover>
          ) : null}
        </>
      );
    }
  },
};
