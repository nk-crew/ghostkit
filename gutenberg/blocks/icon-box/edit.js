/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import URLPicker from '../../components/url-picker';
import ColorIndicator from '../../components/color-indicator';
import ToggleGroup from '../../components/toggle-group';
import RangeControl from '../../components/range-control';
import ApplyFilters from '../../components/apply-filters';
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { BaseControl, PanelBody, ToggleControl, TabPanel, Toolbar, ToolbarGroup, ToolbarButton } from '@wordpress/components';

import { InspectorControls, InnerBlocks, BlockControls, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, isSelected, clientId } = props;

  let { className = '' } = props;

  const {
    icon,
    iconPosition,
    iconAlign,
    iconSize,
    showContent,
    iconColor,
    hoverIconColor,
    url,
    ariaLabel,
    target,
    rel,
  } = attributes;

  const hasChildBlocks = useSelect(
    (select) => {
      const blockEditor = select('core/block-editor');

      return blockEditor ? blockEditor.getBlockOrder(clientId).length > 0 : false;
    },
    [clientId]
  );

  className = classnames('ghostkit-icon-box', className);
  className = applyFilters('ghostkit.editor.className', className, props);

  const classNameIcon = classnames(
    'ghostkit-icon-box-icon',
    `ghostkit-icon-box-icon-align-${iconPosition || 'left'}`,
    iconPosition === 'top' ? `ghostkit-icon-box-icon-top-align-${iconAlign || 'center'}` : ''
  );

  const blockProps = useBlockProps({ className });
  const innerBlockProps = useInnerBlocksProps(
    { className: 'ghostkit-icon-box-content' },
    {
      renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
      templateLock: false,
    }
  );

  return (
    <>
      <InspectorControls>
        <PanelBody>
          <IconPicker
            label={__('Icon', 'ghostkit')}
            value={icon}
            onChange={(value) => setAttributes({ icon: value })}
            insideInspector
          />
          {icon ? (
            <>
              <RangeControl
                label={__('Icon Size', 'ghostkit')}
                value={iconSize}
                onChange={(value) => setAttributes({ iconSize: value })}
                min={20}
                beforeIcon="editor-textcolor"
                afterIcon="editor-textcolor"
                allowCustomMin
                allowCustomMax
              />
              <BaseControl label={__('Icon Position', 'ghostkit')}>
                <div>
                  <Toolbar label={__('Icon Position', 'ghostkit')}>
                    <ToolbarButton
                      icon="align-center"
                      title={__('Top', 'ghostkit')}
                      onClick={() => setAttributes({ iconPosition: 'top' })}
                      isActive={iconPosition === 'top'}
                    />
                    <ToolbarButton
                      icon="align-left"
                      title={__('Left', 'ghostkit')}
                      onClick={() => setAttributes({ iconPosition: 'left' })}
                      isActive={iconPosition === 'left'}
                    />
                    <ToolbarButton
                      icon="align-right"
                      title={__('Right', 'ghostkit')}
                      onClick={() => setAttributes({ iconPosition: 'right' })}
                      isActive={iconPosition === 'right'}
                    />
                  </Toolbar>
                </div>
              </BaseControl>
              {iconPosition === 'top' ? (
                <ToggleGroup
                  label={__('Icon Alignment', 'ghostkit')}
                  value={iconAlign || 'center'}
                  options={[
                    {
                      icon: getIcon('icon-horizontal-start'),
                      label: __('Start', 'ghostkit'),
                      value: 'left',
                    },
                    {
                      icon: getIcon('icon-horizontal-center'),
                      label: __('Center', 'ghostkit'),
                      value: 'center',
                    },
                    {
                      icon: getIcon('icon-horizontal-end'),
                      label: __('End', 'ghostkit'),
                      value: 'right',
                    },
                  ]}
                  onChange={(value) => {
                    setAttributes({ iconAlign: value });
                  }}
                />
              ) : null}
            </>
          ) : null}
        </PanelBody>
        {!showContent || icon ? (
          <PanelBody>
            <ToggleControl
              label={__('Show Content', 'ghostkit')}
              checked={!!showContent}
              onChange={(val) => setAttributes({ showContent: val })}
            />
          </PanelBody>
        ) : null}
        <PanelBody
          title={
            <>
              {__('Colors', 'ghostkit')}
              <ColorIndicator colorValue={iconColor} />
            </>
          }
          initialOpen={false}
        >
          <TabPanel
            className="ghostkit-control-tabs ghostkit-control-tabs-wide"
            tabs={[
              {
                name: 'normal',
                title: __('Normal', 'ghostkit'),
                className: 'ghostkit-control-tabs-tab',
              },
              {
                name: 'hover',
                title: __('Hover', 'ghostkit'),
                className: 'ghostkit-control-tabs-tab',
              },
            ]}
          >
            {(tabData) => {
              const isHover = tabData.name === 'hover';
              return (
                <ApplyFilters
                  name="ghostkit.editor.controls"
                  attribute={isHover ? 'hoverIconColor' : 'iconColor'}
                  props={props}
                >
                  <ColorPicker
                    label={__('Icon', 'ghostkit')}
                    value={isHover ? hoverIconColor : iconColor}
                    onChange={(val) =>
                      setAttributes(isHover ? { hoverIconColor: val } : { iconColor: val })
                    }
                    alpha
                    gradient
                  />
                </ApplyFilters>
              );
            }}
          </TabPanel>
        </PanelBody>
      </InspectorControls>
      <URLPicker
        url={url}
        rel={rel}
        ariaLabel={ariaLabel}
        target={target}
        onChange={(data) => {
          setAttributes(data);
        }}
        isSelected={isSelected}
        toolbarSettings
        inspectorSettings
      />
      {icon ? (
        <BlockControls>
          <ToolbarGroup>
            <ToolbarButton
              icon="align-center"
              title={__('Top', 'ghostkit')}
              onClick={() => setAttributes({ iconPosition: 'top' })}
              isActive={iconPosition === 'top'}
            />
            <ToolbarButton
              icon="align-left"
              title={__('Left', 'ghostkit')}
              onClick={() => setAttributes({ iconPosition: 'left' })}
              isActive={iconPosition === 'left'}
            />
            <ToolbarButton
              icon="align-right"
              title={__('Right', 'ghostkit')}
              onClick={() => setAttributes({ iconPosition: 'right' })}
              isActive={iconPosition === 'right'}
            />
          </ToolbarGroup>
        </BlockControls>
      ) : null}
      <div {...blockProps}>
        {icon ? (
          <div className={classNameIcon}>
            <IconPicker.Dropdown
              onChange={(value) => setAttributes({ icon: value })}
              value={icon}
              renderToggle={({ onToggle }) => <IconPicker.Preview onClick={onToggle} name={icon} />}
            />
          </div>
        ) : null}
        {showContent ? <div {...innerBlockProps} /> : null}
      </div>
    </>
  );
}
