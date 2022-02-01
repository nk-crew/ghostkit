/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { RichText } = wp.blockEditor;

const { Component } = wp.element;

const { applyFilters } = wp.hooks;

export default [
  // v2.17.0
  {
    ...metadata,
    save: class BlockSave extends Component {
      render() {
        const {
          caption,
          height,
          percent,
          striped,
          showCount,
          countPrefix,
          countSuffix,
          animateInViewport,
        } = this.props.attributes;

        let className = 'ghostkit-progress';

        className = applyFilters('ghostkit.blocks.className', className, {
          ...{
            name: metadata.name,
          },
          ...this.props,
        });

        return (
          <div className={className}>
            {!RichText.isEmpty(caption) ? (
              <div className="ghostkit-progress-caption">
                <RichText.Content value={caption} />
              </div>
            ) : (
              ''
            )}
            {showCount ? (
              <div className="ghostkit-progress-bar-count" style={{ width: `${percent}%` }}>
                <div>
                  <span>{countPrefix}</span>
                  <span>{percent}</span>
                  <span>{countSuffix}</span>
                </div>
              </div>
            ) : (
              ''
            )}
            <div
              className={classnames(
                'ghostkit-progress-wrap',
                striped ? 'ghostkit-progress-bar-striped' : ''
              )}
            >
              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              <div
                className={classnames(
                  'ghostkit-progress-bar',
                  animateInViewport ? 'ghostkit-count-up' : ''
                )}
                role="progressbar"
                style={{ width: `${percent}%`, height: `${height}px` }}
                aria-valuenow={percent}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>
        );
      }
    },
  },
];
