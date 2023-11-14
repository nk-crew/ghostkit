/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import ColorIndicator from '../../components/color-indicator';
import RangeControl from '../../components/range-control';
import ApplyFilters from '../../components/apply-filters';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const { __ } = wp.i18n;
const { PanelBody, TextControl, ToggleControl, TabPanel, ResizableBox } = wp.components;
const { InspectorControls, RichText, useBlockProps } = wp.blockEditor;

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, isSelected, toggleSelection } = props;

  let { className = '' } = props;

  const {
    caption,
    height,
    percent,
    borderRadius,
    striped,
    animateInViewport,
    showCount,
    countPrefix,
    countSuffix,
    color,
    backgroundColor,
    hoverColor,
    hoverBackgroundColor,
  } = attributes;

  className = classnames('ghostkit-progress', className);

  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });

  return (
    <>
      <InspectorControls>
        <PanelBody>
          <RangeControl
            label={__('Height', '@@text_domain')}
            value={height || ''}
            onChange={(value) => setAttributes({ height: value })}
            min={1}
            allowCustomMax
          />
          <RangeControl
            label={__('Percent', '@@text_domain')}
            value={percent || ''}
            onChange={(value) => setAttributes({ percent: value })}
            min={0}
            max={100}
          />
          <RangeControl
            label={__('Corner Radius', '@@text_domain')}
            value={borderRadius}
            min={0}
            max={10}
            onChange={(value) => setAttributes({ borderRadius: value })}
            allowCustomMax
          />
        </PanelBody>
        <PanelBody>
          <ToggleControl
            label={__('Show Count', '@@text_domain')}
            checked={!!showCount}
            onChange={(val) => setAttributes({ showCount: val })}
          />
          {showCount ? (
            <>
              <TextControl
                label={__('Count Prefix', '@@text_domain')}
                value={countPrefix}
                onChange={(value) => setAttributes({ countPrefix: value })}
              />
              <TextControl
                label={__('Count Suffix', '@@text_domain')}
                value={countSuffix}
                onChange={(value) => setAttributes({ countSuffix: value })}
              />
            </>
          ) : (
            ''
          )}
          <ToggleControl
            label={__('Striped', '@@text_domain')}
            checked={!!striped}
            onChange={(val) => setAttributes({ striped: val })}
          />
          <ToggleControl
            label={__('Animate in viewport', '@@text_domain')}
            checked={!!animateInViewport}
            onChange={(val) => setAttributes({ animateInViewport: val })}
          />
        </PanelBody>
        <PanelBody
          title={
            <>
              {__('Colors', '@@text_domain')}
              <ColorIndicator colorValue={color} />
              <ColorIndicator colorValue={backgroundColor} />
            </>
          }
          initialOpen={false}
        >
          <TabPanel
            className="ghostkit-control-tabs ghostkit-control-tabs-wide"
            tabs={[
              {
                name: 'normal',
                title: __('Normal', '@@text_domain'),
                className: 'ghostkit-control-tabs-tab',
              },
              {
                name: 'hover',
                title: __('Hover', '@@text_domain'),
                className: 'ghostkit-control-tabs-tab',
              },
            ]}
          >
            {(tabData) => {
              const isHover = tabData.name === 'hover';
              return (
                <>
                  <ApplyFilters
                    name="ghostkit.editor.controls"
                    attribute={isHover ? 'hoverColor' : 'color'}
                    props={props}
                  >
                    <ColorPicker
                      label={__('Bar', '@@text_domain')}
                      value={isHover ? hoverColor : color}
                      onChange={(val) =>
                        setAttributes(isHover ? { hoverColor: val } : { color: val })
                      }
                      alpha
                      gradient
                    />
                  </ApplyFilters>
                  <ApplyFilters
                    name="ghostkit.editor.controls"
                    attribute={isHover ? 'hoverBackgroundColor' : 'backgroundColor'}
                    props={props}
                  >
                    <ColorPicker
                      label={__('Background', '@@text_domain')}
                      value={isHover ? hoverBackgroundColor : backgroundColor}
                      onChange={(val) =>
                        setAttributes(
                          isHover ? { hoverBackgroundColor: val } : { backgroundColor: val }
                        )
                      }
                      alpha
                      gradient
                    />
                  </ApplyFilters>
                </>
              );
            }}
          </TabPanel>
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        {!RichText.isEmpty(caption) || isSelected ? (
          <RichText
            inlineToolbar
            tagName="div"
            className="ghostkit-progress-caption"
            placeholder={__('Write caption…', '@@text_domain')}
            value={caption}
            onChange={(newCaption) => setAttributes({ caption: newCaption })}
          />
        ) : (
          ''
        )}
        {showCount ? (
          <div className="ghostkit-progress-bar-count" style={{ width: `${percent}%` }}>
            <div>
              {countPrefix}
              {percent}
              {countSuffix}
            </div>
          </div>
        ) : (
          ''
        )}
        <ResizableBox
          className={classnames({ 'is-selected': isSelected })}
          size={{
            width: '100%',
            height,
          }}
          minWidth="0%"
          maxWidth="100%"
          minHeight="1"
          enable={{ bottom: true }}
          onResizeStart={() => {
            toggleSelection(false);
          }}
          onResizeStop={(event, direction, elt, delta) => {
            setAttributes({
              height: parseInt(height + delta.height, 10),
            });
            toggleSelection(true);
          }}
        >
          <div
            className={classnames({
              'ghostkit-progress-wrap': true,
              'ghostkit-progress-bar-striped': striped,
            })}
          >
            <ResizableBox
              className={classnames('ghostkit-progress-bar', { 'is-selected': isSelected })}
              size={{ width: `${percent}%` }}
              minWidth="0%"
              maxWidth="100%"
              minHeight="100%"
              maxHeight="100%"
              enable={{ right: true }}
              onResizeStart={() => {
                toggleSelection(false);
              }}
              onResizeStop={(event, direction, elt, delta) => {
                setAttributes({
                  percent: Math.min(
                    100,
                    Math.max(
                      0,
                      percent +
                        parseInt(
                          (100 * delta.width) / elt.parentNode.getBoundingClientRect().width,
                          10
                        )
                    )
                  ),
                });
                toggleSelection(true);
              }}
            />
          </div>
        </ResizableBox>
      </div>
    </>
  );
}
