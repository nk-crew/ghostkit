/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { PanelRow, Button } = wp.components;

export default function ButtonClearMedia({
  nameAttributes,
  setAttributes,
  children = __('Clear Media', '@@text_domain'),
}) {
  const handleClick = (e) => {
    const clearAttributes = {};
    nameAttributes.forEach((name) => {
      clearAttributes[name] = '';
    });
    setAttributes(clearAttributes);

    e.preventDefault();
  };

  return (
    <PanelRow>
      <Button
        variant="secondary"
        size="small"
        onClick={handleClick}
        className="is-small"
        style={{ marginLeft: 'auto' }}
      >
        {children}
      </Button>
    </PanelRow>
  );
}
