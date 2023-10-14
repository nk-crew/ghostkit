/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ResponsiveTabPanel from '../../components/responsive-tab-panel';
import ImagePicker from '../../components/image-picker';
import ColorPicker from '../../components/color-picker';
import ProNote from '../../components/pro-note';
import RangeControl from '../../components/range-control';
import getIcon from '../../utils/get-icon';
import { maybeEncode, maybeDecode } from '../../utils/encode-decode';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const { Fragment, useEffect } = wp.element;

const { PanelBody, ToolbarGroup, ToolbarButton, Dropdown } = wp.components;

const { InspectorControls, BlockControls, useBlockProps } = wp.blockEditor;

const { GHOSTKIT, ghostkitVariables } = window;

const { shapes } = GHOSTKIT;

function getShapeData(svg) {
  let result = {
    allow_flip_vertical: true,
    allow_flip_horizontal: true,
  };
  let ready = false;

  Object.keys(shapes).forEach((k) => {
    const data = shapes[k];

    Object.keys(data.shapes).forEach((i) => {
      const shape = data.shapes[i];

      if (shape.svg && shape.svg === maybeDecode(svg) && !ready) {
        result = shape;
        ready = true;
      }
    });
  });

  return result;
}

/**
 * Block Edit Class.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes } = props;
  const { svg, flipVertical, flipHorizontal, color } = attributes;

  let { className = '' } = props;

  // Mounted.
  useEffect(() => {
    // Block inserted on the page.
    if (!svg) {
      const newAttrs = {};

      // Set default svg.
      Object.keys(shapes).forEach((k) => {
        const data = shapes[k];

        Object.keys(data.shapes).forEach((i) => {
          const shape = data.shapes[i];

          if (shape.svg && !newAttrs.svg) {
            newAttrs.svg = shape.svg;
          }
        });
      });

      // Remove top and bottom margins.
      newAttrs.ghostkitSpacings = {
        marginTop: '0',
        marginBottom: '0',
        '!important': true,
      };

      setAttributes(newAttrs);
    }
  }, []);

  function getShapesPicker() {
    return (
      <div className="ghostkit-shape-divider-control-styles">
        {Object.keys(shapes).map((k) => {
          const data = shapes[k];
          const shapesOptions = [];

          Object.keys(data.shapes).forEach((i) => {
            const shape = data.shapes[i];

            shapesOptions.push({
              label: shape.label,
              value: shape.svg,
              image: (
                <div
                  className="ghostkit-shape-divider"
                  style={{ '--gkt-shape-divider__color': color }}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: shape.svg }}
                />
              ),
              className: `ghostkit-shape-divider-control-styles-item-${k}-${shape.name}`,
            });
          });

          return (
            <div key={k}>
              <h3>{data.name}</h3>
              <ImagePicker
                value={maybeDecode(svg)}
                options={shapesOptions}
                onChange={(value) => {
                  const shapeData = getShapeData(value);

                  setAttributes({
                    svg: maybeEncode(value),
                    flipVertical: shapeData.allow_flip_vertical ? flipVertical : false,
                    flipHorizontal: shapeData.allow_flip_horizontal ? flipHorizontal : false,
                  });
                }}
              />
              <ProNote title={__('Pro Shapes', '@@text_domain')}>
                <p>
                  {__(
                    'Additional 30 shapes available in the Ghost Kit Pro plugin only',
                    '@@text_domain'
                  )}
                </p>
                <ProNote.Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://ghostkit.io/shape-divider/?utm_source=plugin&utm_medium=block_settings&utm_campaign=pro_shapes&utm_content=@@plugin_version"
                >
                  {__('Read More', '@@text_domain')}
                </ProNote.Button>
              </ProNote>
            </div>
          );
        })}
      </div>
    );
  }

  const shapeData = getShapeData(svg);

  const filledTabs = {};
  if (
    ghostkitVariables &&
    ghostkitVariables.media_sizes &&
    Object.keys(ghostkitVariables.media_sizes).length
  ) {
    Object.keys(ghostkitVariables.media_sizes).forEach((media) => {
      let heightName = 'height';
      let widthName = 'width';

      if (media !== 'all') {
        heightName = `${media}_${heightName}`;
        widthName = `${media}_${widthName}`;
      }

      filledTabs[media] = attributes[heightName] || attributes[widthName];
    });
  }

  className = classnames(
    'ghostkit-shape-divider',
    {
      'ghostkit-shape-divider-flip-vertical': shapeData.allow_flip_vertical && flipVertical,
      'ghostkit-shape-divider-flip-horizontal': shapeData.allow_flip_horizontal && flipHorizontal,
    },
    className
  );

  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({
    className,
    dangerouslySetInnerHTML: { __html: maybeDecode(svg) },
  });

  return (
    <Fragment>
      <BlockControls>
        <ToolbarGroup>
          {shapeData.allow_flip_vertical ? (
            <ToolbarButton
              icon={getIcon('icon-flip-vertical')}
              title={__('Vertical Flip', '@@text_domain')}
              onClick={() => setAttributes({ flipVertical: !flipVertical })}
              isActive={flipVertical}
            />
          ) : null}

          {shapeData.allow_flip_horizontal ? (
            <ToolbarButton
              icon={getIcon('icon-flip-horizontal')}
              title={__('Horizontal Flip', '@@text_domain')}
              onClick={() => setAttributes({ flipHorizontal: !flipHorizontal })}
              isActive={flipHorizontal}
            />
          ) : null}

          <Dropdown
            renderToggle={({ onToggle }) => (
              <ToolbarButton
                label={__('Shapes', '@@text_domain')}
                icon="edit"
                className="components-toolbar__control"
                onClick={onToggle}
              />
            )}
            renderContent={() => (
              <div
                style={{
                  minWidth: 260,
                }}
              >
                {getShapesPicker()}
              </div>
            )}
          />
        </ToolbarGroup>
      </BlockControls>
      <InspectorControls>
        <PanelBody title={__('Style', '@@text_domain')}>{getShapesPicker()}</PanelBody>
        <PanelBody title={__('Size', '@@text_domain')}>
          <ResponsiveTabPanel filledTabs={filledTabs}>
            {(tabData) => {
              let heightName = 'height';
              let widthName = 'width';

              if (tabData.name !== 'all') {
                heightName = `${tabData.name}_${heightName}`;
                widthName = `${tabData.name}_${widthName}`;
              }

              return (
                <Fragment>
                  <RangeControl
                    label={__('Height', '@@text_domain')}
                    value={attributes[heightName] ? parseInt(attributes[heightName], 10) : ''}
                    onChange={(value) => {
                      setAttributes({
                        [heightName]: `${typeof value === 'number' ? value : ''}`,
                      });
                    }}
                    min={1}
                    max={700}
                    allowCustomMax
                  />
                  <RangeControl
                    label={__('Width', '@@text_domain')}
                    value={attributes[widthName] ? parseInt(attributes[widthName], 10) : ''}
                    onChange={(value) => {
                      setAttributes({
                        [widthName]: `${typeof value === 'number' ? value : ''}`,
                      });
                    }}
                    min={100}
                    max={400}
                    allowCustomMin
                    allowCustomMax
                  />
                </Fragment>
              );
            }}
          </ResponsiveTabPanel>
        </PanelBody>
        <PanelBody>
          <ColorPicker
            label={__('Color', '@@text_domain')}
            value={color}
            onChange={(val) => setAttributes({ color: val })}
            alpha
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps} />
    </Fragment>
  );
}
