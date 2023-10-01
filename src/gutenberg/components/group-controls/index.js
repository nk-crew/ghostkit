export default function GroupControls(props) {
  const { children, gap = '10px' } = props;
  let { style } = props;
  style = { ...style };

  if (gap) {
    style.gap = gap;
  }

  return (
    <div className="ghostkit-group-controls" style={style}>
      {children}
    </div>
  );
}
