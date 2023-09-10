const { __ } = wp.i18n;

export default {
  default: {
    label: __('Default', '@@text_domain'),
    stiffness: 100,
    damping: 10,
    mass: 0.75,
    delay: 0,
  },
  gentle: {
    label: __('Gentle', '@@text_domain'),
    stiffness: 100,
    damping: 14,
    mass: 1,
    delay: 0,
  },
  wobbly: {
    label: __('Wobbly', '@@text_domain'),
    stiffness: 200,
    damping: 10,
    mass: 1,
    delay: 0,
  },
  slow: {
    label: __('Slow', '@@text_domain'),
    stiffness: 8,
    damping: 4,
    mass: 1,
    delay: 0,
  },
  molasses: {
    label: __('Molasses', '@@text_domain'),
    stiffness: 10,
    damping: 20,
    mass: 4,
    delay: 0,
  },
};
