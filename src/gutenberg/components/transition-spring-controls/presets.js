const { __ } = wp.i18n;

export default {
  default: {
    label: __('Default', '@@text_domain'),
    stiffness: 150,
    damping: 30,
    mass: 1,
    delay: 0,
  },
  linear: {
    label: __('Linear', '@@text_domain'),
    stiffness: 1000,
    damping: 100,
    mass: 0,
    delay: 0,
  },
  gentle: {
    label: __('Gentle', '@@text_domain'),
    stiffness: 100,
    damping: 13,
    mass: 1,
    delay: 0,
  },
  wobbly: {
    label: __('Wobbly', '@@text_domain'),
    stiffness: 70,
    damping: 10,
    mass: 1,
    delay: 0,
  },
  slow: {
    label: __('Slow', '@@text_domain'),
    stiffness: 10,
    damping: 10,
    mass: 1,
    delay: 0,
  },
  molasses: {
    label: __('Molasses', '@@text_domain'),
    stiffness: 5,
    damping: 30,
    mass: 5,
    delay: 0,
  },
};
