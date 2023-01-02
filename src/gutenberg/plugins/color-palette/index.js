/* eslint-disable max-classes-per-file */
/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';
import { getSlug } from '../../utils/get-unique-slug';
import ColorPicker from '../../components/color-picker';
import Modal from '../../components/modal';

/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

const { __ } = wp.i18n;
const { Component } = wp.element;
const { apiFetch } = wp;

const { compose } = wp.compose;

const { PluginMoreMenuItem } = wp.editPost || {};

const { withSelect, withDispatch } = wp.data;

const { BaseControl, Tooltip, TextControl, Button } = wp.components;

class ColorPaletteModal extends Component {
  constructor(props) {
    super(props);

    this.isUniqueSlug = this.isUniqueSlug.bind(this);
    this.getUniqueSlug = this.getUniqueSlug.bind(this);
  }

  getUniqueSlug(name) {
    let newSlug = '';
    let i = 0;

    name = name.replace(/-/g, ' ');

    while (!newSlug || !this.isUniqueSlug(newSlug)) {
      if (newSlug) {
        i += 1;
      }
      newSlug = `${getSlug(name)}${i ? `-${i}` : ''}`;
    }

    return newSlug;
  }

  isUniqueSlug(slug) {
    const { colors } = this.props;

    let isUnique = true;

    colors.forEach((color) => {
      if (color.slug === slug) {
        isUnique = false;
      }
    });

    return isUnique;
  }

  render() {
    const { updateColorPalette, onRequestClose, colors } = this.props;

    return (
      <Modal
        className="ghostkit-plugin-color-palette-modal"
        position="top"
        size="md"
        title={__('Color Palette', '@@text_domain')}
        onRequestClose={() => {
          updateColorPalette(colors, true);
          onRequestClose();
        }}
        icon={getIcon('plugin-color-palette')}
      >
        <h4>{__('Default Colors', '@@text_domain')}</h4>
        <div className="ghostkit-plugin-color-palette-list ghostkit-plugin-color-palette-list-default">
          {colors.map((data) => {
            if (/^ghostkit-color-/g.test(data.slug)) {
              return null;
            }

            return (
              <ColorPicker
                key={data.slug}
                value={data.color}
                hint={data.name}
                colorPalette={false}
                onChange={() => {}}
              />
            );
          })}
        </div>

        <h4>{__('Custom Colors', '@@text_domain')}</h4>
        <div className="ghostkit-plugin-color-palette-list">
          {colors.map((data, i) => {
            if (!/^ghostkit-color-/g.test(data.slug)) {
              return null;
            }

            const colorName = `palette-item-${i}`;

            return (
              <ColorPicker
                key={colorName}
                value={data.color}
                hint={data.name}
                colorPalette={false}
                onChange={(value) => {
                  const newColors = colors.map((thisData) => ({
                    ...thisData,
                    color: data.slug === thisData.slug ? value : thisData.color,
                  }));
                  updateColorPalette(newColors);
                }}
                afterDropdownContent={
                  <Fragment>
                    <TextControl
                      label={__('Name', '@@text_domain')}
                      value={data.name}
                      onChange={(value) => {
                        const newColors = colors.map((thisData) => ({
                          ...thisData,
                          slug:
                            data.slug === thisData.slug
                              ? this.getUniqueSlug(`ghostkit-color-${value}`)
                              : thisData.slug,
                          name: data.slug === thisData.slug ? value : thisData.name,
                        }));
                        updateColorPalette(newColors);
                      }}
                      style={{ marginTop: 0 }}
                    />
                    <BaseControl>
                      <Button
                        onClick={() => {
                          if (
                            // eslint-disable-next-line no-alert
                            window.confirm(
                              __(`Remove color "${data.color}" with name "${data.name}"?`)
                            )
                          ) {
                            const newColors = colors.filter(
                              (thisData) => data.slug !== thisData.slug
                            );
                            updateColorPalette(newColors);
                          }
                        }}
                        isSecondary
                        isSmall
                      >
                        {__('Remove', '@@text_domain')}
                      </Button>
                    </BaseControl>
                  </Fragment>
                }
              />
            );
          })}
          <div className="ghostkit-plugin-color-palette-list-add-new components-base-control ghostkit-component-color-picker-wrapper">
            <div className="components-base-control__field">
              <div className="components-color-palette__item-wrapper components-circular-option-picker__option-wrapper">
                <Tooltip text={__('Add Custom Color', '@@text_domain')}>
                  <button
                    type="button"
                    className="components-color-palette__item components-circular-option-picker__option"
                    onClick={() => {
                      updateColorPalette([
                        ...colors,
                        {
                          slug: this.getUniqueSlug('ghostkit-color-blue'),
                          color: '#0366d6',
                          name: __('Blue', '@@text_domain'),
                        },
                      ]);
                    }}
                  >
                    <span className="components-color-palette__custom-color-gradient">+</span>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const ColorPaletteModalWithSelect = compose([
  withSelect((select) => {
    const { getSettings } = select('core/block-editor');
    const settings = getSettings();

    // const colorPalette = select( 'ghostkit/plugins/color-palette' ).getColorPalette();

    return {
      colors: settings.colors || [],
    };
  }),
  withDispatch((dispatch) => ({
    updateColorPalette(newColors, ajaxSave) {
      const { updateSettings } = dispatch('core/block-editor');

      updateSettings({ colors: newColors });

      if (ajaxSave) {
        const customColors = newColors.filter((data) => /^ghostkit-color-/g.test(data.slug));

        apiFetch({
          path: '/ghostkit/v1/update_color_palette',
          method: 'POST',
          data: {
            data: customColors,
          },
        });
      }
    },
  })),
])(ColorPaletteModal);

export { ColorPaletteModalWithSelect as ColorPaletteModal };

export const name = 'ghostkit-color-palette';

export const icon = null;

export class Plugin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };
  }

  render() {
    const { isModalOpen } = this.state;

    return (
      <Fragment>
        {PluginMoreMenuItem ? (
          <PluginMoreMenuItem
            icon={null}
            onClick={() => {
              this.setState({ isModalOpen: true });
            }}
          >
            {__('Color Palette', '@@text_domain')}
          </PluginMoreMenuItem>
        ) : null}
        {isModalOpen ? (
          <ColorPaletteModalWithSelect
            onRequestClose={() => this.setState({ isModalOpen: false })}
          />
        ) : (
          ''
        )}
      </Fragment>
    );
  }
}
