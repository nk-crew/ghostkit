/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import URLPicker from '../../components/url-picker';
import ColorIndicator from '../../components/color-indicator';
import ToggleGroup from '../../components/toggle-group';
import ApplyFilters from '../../components/apply-filters';
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Component, Fragment } = wp.element;

const { withSelect } = wp.data;

const {
  BaseControl,
  PanelBody,
  TextControl,
  RangeControl,
  ToggleControl,
  TabPanel,
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
} = wp.components;

const { InspectorControls, InnerBlocks, BlockControls, RichText } = wp.blockEditor;

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
  render() {
    const { attributes, setAttributes, isSelected, hasChildBlocks } = this.props;

    let { className = '' } = this.props;

    const {
      number,
      animateInViewport,
      animateInViewportFrom,
      numberPosition,
      numberAlign,
      numberSize,
      showContent,
      numberColor,
      hoverNumberColor,
      url,
      target,
      rel,
    } = attributes;

    className = classnames('ghostkit-counter-box', className);
    className = applyFilters('ghostkit.editor.className', className, this.props);

    const classNameNumber = classnames(
      'ghostkit-counter-box-number',
      `ghostkit-counter-box-number-align-${numberPosition || 'left'}`,
      'top' === numberPosition
        ? `ghostkit-counter-box-number-top-align-${numberAlign || 'center'}`
        : ''
    );

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody>
            <RangeControl
              label={__('Number Size', '@@text_domain')}
              value={numberSize}
              onChange={(value) => setAttributes({ numberSize: value })}
              min={20}
              max={100}
              beforeIcon="editor-textcolor"
              afterIcon="editor-textcolor"
            />
            <BaseControl label={__('Number Position', '@@text_domain')}>
              <div>
                <Toolbar label={__('Number Position', '@@text_domain')}>
                  <ToolbarButton
                    icon="align-center"
                    title={__('Top', '@@text_domain')}
                    onClick={() => setAttributes({ numberPosition: 'top' })}
                    isActive={'top' === numberPosition}
                  />
                  <ToolbarButton
                    icon="align-left"
                    title={__('Left', '@@text_domain')}
                    onClick={() => setAttributes({ numberPosition: 'left' })}
                    isActive={'left' === numberPosition}
                  />
                  <ToolbarButton
                    icon="align-right"
                    title={__('Right', '@@text_domain')}
                    onClick={() => setAttributes({ numberPosition: 'right' })}
                    isActive={'right' === numberPosition}
                  />
                </Toolbar>
              </div>
            </BaseControl>
            {'top' === numberPosition ? (
              <ToggleGroup
                label={__('Number Alignment', '@@text_domain')}
                value={numberAlign || 'center'}
                options={[
                  {
                    label: getIcon('icon-horizontal-start'),
                    value: 'left',
                  },
                  {
                    label: getIcon('icon-horizontal-center'),
                    value: 'center',
                  },
                  {
                    label: getIcon('icon-horizontal-end'),
                    value: 'right',
                  },
                ]}
                onChange={(value) => {
                  setAttributes({ numberAlign: value });
                }}
              />
            ) : null}
          </PanelBody>
          <PanelBody>
            <ToggleControl
              label={__('Show Content', '@@text_domain')}
              checked={!!showContent}
              onChange={(val) => setAttributes({ showContent: val })}
            />
            <ToggleControl
              label={__('Animate in viewport', '@@text_domain')}
              checked={!!animateInViewport}
              onChange={(val) => setAttributes({ animateInViewport: val })}
            />
            {animateInViewport ? (
              <TextControl
                label={__('Animate from', '@@text_domain')}
                type="number"
                value={animateInViewportFrom}
                onChange={(value) => setAttributes({ animateInViewportFrom: parseInt(value, 10) })}
              />
            ) : null}
          </PanelBody>
          <PanelBody
            title={
              <Fragment>
                {__('Colors', '@@text_domain')}
                <ColorIndicator colorValue={numberColor} />
              </Fragment>
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
                const isHover = 'hover' === tabData.name;
                return (
                  <ApplyFilters
                    name="ghostkit.editor.controls"
                    attribute={isHover ? 'hoverNumberColor' : 'numberColor'}
                    props={this.props}
                  >
                    <ColorPicker
                      label={__('Color', '@@text_domain')}
                      value={isHover ? hoverNumberColor : numberColor}
                      onChange={(val) =>
                        setAttributes(isHover ? { hoverNumberColor: val } : { numberColor: val })
                      }
                      alpha
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
          target={target}
          onChange={(data) => {
            setAttributes(data);
          }}
          isSelected={isSelected}
          toolbarSettings
          inspectorSettings
        />
        <BlockControls>
          <ToolbarGroup>
            <ToolbarButton
              icon="align-center"
              title={__('Top', '@@text_domain')}
              onClick={() => setAttributes({ numberPosition: 'top' })}
              isActive={'top' === numberPosition}
            />
            <ToolbarButton
              icon="align-left"
              title={__('Left', '@@text_domain')}
              onClick={() => setAttributes({ numberPosition: 'left' })}
              isActive={'left' === numberPosition}
            />
            <ToolbarButton
              icon="align-right"
              title={__('Right', '@@text_domain')}
              onClick={() => setAttributes({ numberPosition: 'right' })}
              isActive={'right' === numberPosition}
            />
          </ToolbarGroup>
        </BlockControls>
        <div className={className}>
          <div className={classNameNumber}>
            <RichText
              tagName="div"
              className="ghostkit-counter-box-number-wrap"
              placeholder={__('Write number…', '@@text_domain')}
              value={number}
              onChange={(value) => setAttributes({ number: value })}
              withoutInteractiveFormatting
            />
          </div>
          {showContent ? (
            <div className="ghostkit-counter-box-content">
              <InnerBlocks
                templateLock={false}
                renderAppender={
                  hasChildBlocks ? undefined : () => <InnerBlocks.ButtonBlockAppender />
                }
              />
            </div>
          ) : null}
        </div>
      </Fragment>
    );
  }
}

export default withSelect((select, props) => {
  const { clientId } = props;
  const blockEditor = select('core/block-editor');

  return {
    hasChildBlocks: blockEditor ? 0 < blockEditor.getBlockOrder(clientId).length : false,
  };
})(BlockEdit);
