/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import ColorIndicator from '../../components/color-indicator';
import RangeControl from '../../components/range-control';
import ApplyFilters from '../../components/apply-filters';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;
const { __ } = wp.i18n;
const { useSelect } = wp.data;
const { PanelBody, ToggleControl, ToolbarGroup, ToolbarDropdownMenu, TabPanel } = wp.components;
const { InspectorControls, InnerBlocks, BlockControls, useBlockProps, useInnerBlocksProps } =
  wp.blockEditor;

/**
 * Block Edit Class.
 *
 * @param {Object} props - component props.
 *
 * @return {JSX} component.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes } = props;
  let { className = '' } = props;

  const { color, hoverColor, icon, iconSize, hideButton } = attributes;

  const hasChildBlocks = useSelect(
    (select) => {
      const blockEditor = select('core/block-editor');

      return blockEditor ? blockEditor.getBlockOrder(props.clientId).length > 0 : false;
    },
    [props.clientId]
  );

  className = classnames('ghostkit-alert', className);

  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });

  const innerBlockProps = useInnerBlocksProps(
    {
      className: 'ghostkit-alert-content',
    },
    {
      renderAppender: hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender,
      templateLock: false,
    }
  );

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarDropdownMenu
            icon="info"
            label={__('Type', '@@text_domain')}
            controls={[
              {
                title: __('Primary', '@@text_domain'),
                icon: 'editor-help',
                isActive: color === '#2E77C3',
                onClick: () => setAttributes({ color: '#2E77C3' }),
              },
              {
                title: __('Success', '@@text_domain'),
                icon: 'marker',
                isActive: color === '#22CF6E',
                onClick: () => setAttributes({ color: '#22CF6E' }),
              },
              {
                title: __('Danger', '@@text_domain'),
                icon: 'dismiss',
                isActive: color === '#DC3232',
                onClick: () => setAttributes({ color: '#DC3232' }),
              },
              {
                title: __('Warning', '@@text_domain'),
                icon: 'warning',
                isActive: color === '#E47F3B',
                onClick: () => setAttributes({ color: '#E47F3B' }),
              },
              {
                title: __('Info', '@@text_domain'),
                icon: 'info',
                isActive: color === '#2DC7E8',
                onClick: () => setAttributes({ color: '#2DC7E8' }),
              },
            ]}
          />
        </ToolbarGroup>
      </BlockControls>
      <InspectorControls>
        <PanelBody>
          <IconPicker
            label={__('Icon', '@@text_domain')}
            value={icon}
            onChange={(value) => setAttributes({ icon: value })}
          />
          {icon ? (
            <RangeControl
              label={__('Icon Size', '@@text_domain')}
              value={iconSize}
              onChange={(value) => setAttributes({ iconSize: value })}
              min={20}
              max={100}
              beforeIcon="editor-textcolor"
              afterIcon="editor-textcolor"
              allowCustomMin
              allowCustomMax
            />
          ) : (
            ''
          )}
        </PanelBody>
        <PanelBody>
          <ToggleControl
            label={__('Dismiss button', '@@text_domain')}
            checked={!!hideButton}
            onChange={(val) => setAttributes({ hideButton: val })}
          />
        </PanelBody>
        <PanelBody
          title={
            <>
              {__('Colors', '@@text_domain')}
              <ColorIndicator colorValue={color} />
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
                <ApplyFilters
                  name="ghostkit.editor.controls"
                  attribute={isHover ? 'hoverColor' : 'color'}
                  props={props}
                >
                  <ColorPicker
                    label={__('Color', '@@text_domain')}
                    value={isHover ? hoverColor : color}
                    onChange={(val) =>
                      setAttributes(isHover ? { hoverColor: val } : { color: val })
                    }
                    alpha
                  />
                </ApplyFilters>
              );
            }}
          </TabPanel>
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        {icon ? (
          <div className="ghostkit-alert-icon">
            <IconPicker.Dropdown
              onChange={(value) => setAttributes({ icon: value })}
              value={icon}
              renderToggle={({ onToggle }) => <IconPicker.Preview onClick={onToggle} name={icon} />}
            />
          </div>
        ) : (
          ''
        )}
        <div {...innerBlockProps} />
        {hideButton ? (
          <div className="ghostkit-alert-hide-button">
            <svg
              className="ghostkit-svg-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.21967 6.21967C6.51256 5.92678 6.98744 5.92678 7.28033 6.21967L12 10.9393L16.7197 6.21967C17.0126 5.92678 17.4874 5.92678 17.7803 6.21967C18.0732 6.51256 18.0732 6.98744 17.7803 7.28033L13.0607 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4874 18.0732 17.0126 18.0732 16.7197 17.7803L12 13.0607L7.28033 17.7803C6.98744 18.0732 6.51256 18.0732 6.21967 17.7803C5.92678 17.4874 5.92678 17.0126 6.21967 16.7197L10.9393 12L6.21967 7.28033C5.92678 6.98744 5.92678 6.51256 6.21967 6.21967Z"
                fill="currentColor"
              />
            </svg>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
