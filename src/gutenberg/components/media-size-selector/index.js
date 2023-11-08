const { useEffect, useState } = wp.element;

const { __ } = wp.i18n;
const { useSelect } = wp.data;
const { SelectControl, __experimentalUnitControl } = wp.components;
const UnitControl = __experimentalUnitControl;

export default function MediaSizeSelector(props) {
  const {
    attributes,
    hasOriginalOption = true,
    hasSizeSelectors = true,
    onChangeAspectRatio,
    onChangeWidth,
    onChangeHeight,
    onChangeResolution,
  } = props;
  const { aspectRatio, width, height, resolution } = attributes;

  const options = [];

  if (hasOriginalOption) {
    options.push({ label: 'Original', value: '' });
  }

  options.push(
    { label: 'Square - 1:1', value: '1:1' },
    { label: 'Standard - 4:3', value: '4:3' },
    { label: 'Portrait - 3:4', value: '3:4' },
    { label: 'Classic - 3:2', value: '3:2' },
    { label: 'Classic Portrait - 2:3', value: '2:3' },
    { label: 'Wide - 16:9', value: '16:9' },
    { label: 'Ultra Wide - 21:9', value: '21:9' },
    { label: 'Tall - 9:16', value: '9:16' }
  );

  if (width && height) {
    options.push({ label: 'Custom', value: 'custom', hidden: true });
  }

  const editorSettings = useSelect((select) => {
    return select('core/block-editor').getSettings();
  });

  const [customAspectRatio, setCustomAspectRatio] = useState(false);

  useEffect(() => {
    setCustomAspectRatio(width && height ? 'custom' : false);
  }, []);

  const handleAspectRatioChange = (val) => {
    setCustomAspectRatio(false);

    const { label } = options.find((opt) => opt.value === val);
    onChangeAspectRatio(val, label);

    if (width && height) {
      onChangeHeight('');
    }
  };

  const handleWidthChange = (val) => {
    onChangeWidth(parseFloat(val) ? val : '');
    setCustomAspectRatio(val && height ? 'custom' : false);
  };

  const handleHeightChange = (val) => {
    onChangeHeight(parseFloat(val) ? val : '');
    setCustomAspectRatio(width && val ? 'custom' : false);
  };

  return (
    <>
      {/* Aspect ratio. */}
      <SelectControl
        label={__('Aspect Ratio', '@@text_domain')}
        value={customAspectRatio || aspectRatio}
        onChange={handleAspectRatioChange}
        options={options}
      />
      {/* Width and height. */}
      {hasSizeSelectors && (
        <>
          <div style={{ display: 'flex', gap: 10 }}>
            <UnitControl
              value={width}
              placeholder={__('Auto', '@@text_domain')}
              label={__('Width', '@@text_domain')}
              onChange={handleWidthChange}
            />
            <UnitControl
              value={height}
              placeholder={__('Auto', '@@text_domain')}
              label={__('Height', '@@text_domain')}
              onChange={handleHeightChange}
            />
          </div>
          {!resolution && <div style={{ marginTop: '-22px' }} />}
        </>
      )}
      {/* Resolution. */}
      {resolution && editorSettings?.imageSizes ? (
        <SelectControl
          label={__('Resolution', '@@text_domain')}
          help={__('Select the size of the source image.', '@@text_domain')}
          value={resolution}
          onChange={onChangeResolution}
          options={editorSettings.imageSizes.map((imgSize) => ({
            value: imgSize.slug,
            label: imgSize.name,
          }))}
        />
      ) : null}
    </>
  );
}
