/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import RangeControl from '../../components/range-control';

import PreviewLottie from './preview-lottie';

/**
 * WordPress dependencies
 */
const { useState } = wp.element;

const { applyFilters } = wp.hooks;

const { __ } = wp.i18n;

const {
  PanelBody,
  TextControl,
  SelectControl,
  ToggleControl,
  Button,
  UnitControl: __stableUnitControl,
  __experimentalUnitControl,
} = wp.components;

const UnitControl = __stableUnitControl || __experimentalUnitControl;

const { InspectorControls, MediaPlaceholder, useBlockProps } = wp.blockEditor;

/**
 * Block Edit Class.
 *
 * @param {Object} props - component props.
 *
 * @return {JSX} component.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, isSelected } = props;

  let { className = '' } = props;

  const { fileUrl, fileWidth, fileHeight, trigger, loop, direction, speed, width } = attributes;

  const [isWidthPercent, setIsWidthPercent] = useState(width.endsWith('%'));

  className = classnames('ghostkit-lottie', className);

  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({
    className,
    'data-trigger': trigger,
    style:
      fileWidth && fileHeight
        ? {
            '--gkt-lottie__ar': `${fileWidth} / ${fileHeight}`,
            '--gkt-lottie__width': width,
          }
        : {},
  });

  return (
    <>
      {fileUrl ? (
        <InspectorControls>
          <PanelBody>
            <SelectControl
              label={__('Animation Trigger', '@@text_domain')}
              value={trigger}
              options={[
                { label: __('Auto', '@@text_domain'), value: '' },
                { label: __('In Viewport', '@@text_domain'), value: 'viewport' },
                { label: __('Hover', '@@text_domain'), value: 'hover' },
                { label: __('Click', '@@text_domain'), value: 'click' },
                { label: __('Scroll Position', '@@text_domain'), value: 'scroll' },
              ]}
              onChange={(value) => setAttributes({ trigger: value })}
            />
            {trigger !== 'scroll' ? (
              <>
                <RangeControl
                  label={__('Speed', 'otter-blocks')}
                  value={speed}
                  onChange={(val) => setAttributes({ speed: val })}
                  step={0.1}
                  min={0}
                  max={10}
                />
                <ToggleControl
                  label={__('Loop', '@@text_domain')}
                  checked={!!loop}
                  onChange={() => setAttributes({ loop: !loop })}
                />
              </>
            ) : null}
            <ToggleControl
              label={__('Reverse', '@@text_domain')}
              checked={direction === -1}
              onChange={() => {
                setAttributes({
                  direction: direction === 1 ? -1 : 1,
                });
              }}
            />
            <UnitControl
              label={__('Width', '@@text_domain')}
              value={width}
              onChange={(val) => setAttributes({ width: val })}
              onUnitChange={(unit) => setIsWidthPercent(unit === '%')}
              labelPosition="edge"
              __unstableInputWidth="70px"
              units={[
                { value: 'px', label: 'px' },
                { value: '%', label: '%' },
              ]}
              min={0}
              max={isWidthPercent ? 100 : Infinity}
            />
          </PanelBody>
          <PanelBody>
            <TextControl label={__('Lottie File', '@@text_domain')} value={fileUrl} disabled />
            <Button
              isSecondary
              onClick={() => {
                setAttributes({
                  fileId: undefined,
                  fileUrl: undefined,
                  fileWidth: undefined,
                  fileHeight: undefined,
                });
              }}
            >
              {__('Clear', '@@text_domain')}
            </Button>
          </PanelBody>
        </InspectorControls>
      ) : null}
      <div {...blockProps}>
        {fileUrl ? (
          <PreviewLottie
            url={fileUrl}
            trigger={trigger}
            speed={speed}
            loop={loop}
            direction={direction}
            isSelected={isSelected}
            onLoad={(e) => {
              // eslint-disable-next-line no-underscore-dangle
              const newWidth = e?.target?._lottie?.animationData?.w;
              // eslint-disable-next-line no-underscore-dangle
              const newHeight = e?.target?._lottie?.animationData?.h;

              if (newWidth && newHeight && (newWidth !== fileWidth || newHeight !== fileHeight)) {
                setAttributes({
                  fileWidth: newWidth,
                  fileHeight: newHeight,
                });
              }
            }}
          />
        ) : (
          <MediaPlaceholder
            icon="format-image"
            labels={{
              title: __('Lottie JSON', '@@text_domain'),
              name: __('lottie', '@@text_domain'),
              instructions: __('Upload a JSON file or pick one from your media library.'),
            }}
            onSelect={(file) => {
              setAttributes({ fileId: file.id, fileUrl: file.url });
            }}
            onSelectURL={(url) => {
              setAttributes({ fileId: undefined, fileUrl: url });
            }}
            accept={['application/json']}
            allowedTypes={['application/json']}
            disableMaxUploadErrorMessages
            onError={() => {
              setAttributes({ fileId: undefined, fileUrl: undefined });
            }}
          />
        )}
      </div>
    </>
  );
}
