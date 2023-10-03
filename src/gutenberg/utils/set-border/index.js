export default function setBorder(borderStyle) {
  const {
    borderWidth,
    borderColor = '',
    borderTopWidth,
    borderRightWidth,
    borderBottomWidth,
    borderLeftWidth,
    borderTopColor = '',
    borderRightColor = '',
    borderBottomColor = '',
    borderLeftColor = '',

    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
  } = borderStyle;

  const isCustomBorder = borderTopWidth || borderRightWidth || borderBottomWidth || borderLeftWidth;
  const isCustomRadius =
    borderTopLeftRadius ||
    borderTopRightRadius ||
    borderBottomRightRadius ||
    borderBottomLeftRadius;

  const conf = {
    border: undefined,
    borderTop: undefined,
    borderRight: undefined,
    borderBottom: undefined,
    borderLeft: undefined,
    borderRadius: undefined,
  };

  if (borderWidth) {
    conf.border = `${borderWidth} solid ${borderColor}`;
  }

  if (isCustomBorder) {
    conf.borderTop = !!borderTopWidth && `${borderTopWidth} solid ${borderTopColor}`;
    conf.borderRight = !!borderRightWidth && `${borderRightWidth} solid ${borderRightColor}`;
    conf.borderBottom = !!borderBottomWidth && `${borderBottomWidth} solid ${borderBottomColor}`;
    conf.borderLeft = !!borderLeftWidth && `${borderLeftWidth} solid ${borderLeftColor}`;
  }

  if (borderRadius) {
    conf.borderRadius = borderRadius;
  }

  if (isCustomRadius) {
    conf.borderRadius = `
      ${borderTopLeftRadius || '0px'}
      ${borderTopRightRadius || '0px'}
      ${borderBottomRightRadius || '0px'}
      ${borderBottomLeftRadius || '0px'}
    `;
  }

  return conf;
}
