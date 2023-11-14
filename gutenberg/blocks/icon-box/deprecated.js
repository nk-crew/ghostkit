/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import IconPicker from '../../components/icon-picker';

import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { Component } = wp.element;

const { InnerBlocks } = wp.blockEditor;

const { name } = metadata;

export default [
  // v2.23.2
  {
    ...metadata,
    attributes: {
      icon: {
        type: 'string',
        default:
          '%3Csvg%20class%3D%22ghostkit-svg-icon%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M16.7813%209.75C16.7813%207.10939%2014.6406%204.96875%2012%204.96875C9.35939%204.96875%207.21875%207.10939%207.21875%209.75C7.21875%2012.3906%209.35939%2014.5312%2012%2014.5312C14.6406%2014.5312%2016.7813%2012.3906%2016.7813%209.75Z%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3Cpath%20d%3D%22M8.15625%2018C10.6023%2019.25%2013.3977%2019.25%2015.8437%2018%22%20stroke%3D%22currentColor%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E',
      },
      iconPosition: {
        type: 'string',
        default: 'left',
      },
      iconSize: {
        type: 'number',
      },
      showContent: {
        type: 'boolean',
        default: true,
      },
      iconColor: {
        type: 'string',
      },
      hoverIconColor: {
        type: 'string',
      },
      url: {
        type: 'string',
      },
      target: {
        type: 'string',
      },
      rel: {
        type: 'string',
      },
    },
    save: class BlockSave extends Component {
      render() {
        const { icon, iconPosition, showContent, url, target, rel } = this.props.attributes;

        let className = classnames('ghostkit-icon-box', url ? 'ghostkit-icon-box-with-link' : '');
        className = applyFilters('ghostkit.blocks.className', className, {
          ...{
            name,
          },
          ...this.props,
        });

        const classNameIcon = classnames(
          'ghostkit-icon-box-icon',
          `ghostkit-icon-box-icon-align-${iconPosition || 'left'}`
        );

        return (
          <div className={className}>
            {url ? (
              <a
                className="ghostkit-icon-box-link"
                href={url}
                target={target || false}
                rel={rel || false}
              >
                <span />
              </a>
            ) : null}
            {icon ? <IconPicker.Render name={icon} tag="div" className={classNameIcon} /> : null}
            {showContent ? (
              <div className="ghostkit-icon-box-content">
                <InnerBlocks.Content />
              </div>
            ) : null}
          </div>
        );
      }
    },
  },
];
