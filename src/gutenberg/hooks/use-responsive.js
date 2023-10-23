const { useSelect, useDispatch } = wp.data;

export default function useResponsive() {
  const { device } = useSelect((select) => {
    const { getDevice } = select('ghostkit/responsive');

    return {
      device: getDevice(),
    };
  });

  const { setDevice } = useDispatch('ghostkit/responsive');

  return {
    device,
    setDevice,
  };
}
