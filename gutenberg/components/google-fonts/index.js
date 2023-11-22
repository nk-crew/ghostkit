/**
 * Styles
 */
import './style.scss';

import Select from '../select';

/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element';

import { Button, BaseControl, SelectControl, Spinner } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

const { fonts } = window.GHOSTKIT;

const defaultFont =
  typeof fonts['google-fonts'].fonts !== 'undefined' ? fonts['google-fonts'].fonts[0].name : '';

function getGoogleFontFamilyOptions() {
  const fontFamilies = [];

  if (
    typeof fonts['google-fonts'] !== 'undefined' &&
    typeof fonts['google-fonts'].fonts !== 'undefined'
  ) {
    Object.keys(fonts['google-fonts'].fonts).forEach((key) => {
      fontFamilies.push({
        value: fonts['google-fonts'].fonts[key].name,
        label: fonts['google-fonts'].fonts[key].name,
      });
    });
  }

  return fontFamilies;
}

function getGoogleFontWeightsByFamily(fontFamily) {
  const fontWeights = {
    normal: [],
    italic: [],
  };

  if (
    typeof fonts['google-fonts'] !== 'undefined' &&
    typeof fonts['google-fonts'].fonts !== 'undefined'
  ) {
    const font = fonts['google-fonts'].fonts.find((item) => item.name === fontFamily);
    const { widths } = font;

    Object.keys(widths).forEach((key) => {
      const weight = {
        value: widths[key].replace('i', ''),
        label: __(widths[key].replace('i', ''), '@@text_domain'),
      };

      if (widths[key].indexOf('i') === -1) {
        fontWeights.normal.push(weight);
      } else {
        fontWeights.italic.push(weight);
      }
    });
  }

  return fontWeights;
}

class GoogleFonts extends Component {
  constructor(props) {
    super(props);

    const { fontWeightOptions, styleOptions } = this.getFontWeightAndStyleOptions(defaultFont);

    this.state = {
      isLoading: true,
      // isEdit: false,
      name: defaultFont,
      weight: ['400'],
      style: 'normal',
      fontFamilyOptions: getGoogleFontFamilyOptions(),
      fontWeightOptions,
      styleOptions,
      error: '',
      isEdit: false,
      editKey: null,
      notice: '',
    };
  }

  componentDidMount() {
    this.setState({ isLoading: false });
  }

  // eslint-disable-next-line class-methods-use-this
  getFontWeightAndStyleOptions(fontFamily, fontStyle = 'normal') {
    const styleOptions = [];
    const fontWeights = getGoogleFontWeightsByFamily(fontFamily);
    const fontWeightOptions = fontStyle === 'normal' ? fontWeights.normal : fontWeights.italic;
    if (fontWeights.normal.length > 0) {
      styleOptions.push({
        value: 'normal',
        label: __('Normal', '@@text_domain'),
      });
    }

    if (fontWeights.italic.length > 0) {
      styleOptions.push({
        value: 'italic',
        label: __('Italic', '@@text_domain'),
      });
    }
    return {
      fontWeightOptions,
      styleOptions,
    };
  }

  renderEditor() {
    const {
      fontFamilyOptions,
      fontWeightOptions,
      styleOptions,
      style,
      name,
      weight,
      error,
      notice,
      isEdit,
      editKey,
    } = this.state;

    const { customFonts, updateFonts } = this.props;

    return (
      <div className="editor-styles-wrapper">
        <div className="ghostkit-settings-fonts-google-form">
          {!isEdit ? (
            <BaseControl label={__('Font', '@@text_domain')}>
              <Select
                value={{
                  value: name,
                  label: name,
                }}
                onChange={(opt) => {
                  let options = this.getFontWeightAndStyleOptions(opt.value, style);
                  const newWeight = [];
                  let newStyle = false;

                  if (options.fontWeightOptions.length === 0) {
                    newStyle = style === 'normal' ? 'italic' : 'normal';
                    options = this.getFontWeightAndStyleOptions(opt.value, newStyle);
                  }

                  Object.keys(weight).forEach((key) => {
                    const findWeight = options.fontWeightOptions.find((el) => el.value === weight);

                    if (typeof findWeight !== 'undefined') {
                      newWeight.push(weight[key]);
                    }
                  });

                  if (newWeight.length === 0 && options.fontWeightOptions.length !== 0) {
                    newWeight.push(options.fontWeightOptions[0].value);
                  }

                  this.setState({
                    name: opt.value,
                    style: newStyle || style,
                    weight: newWeight,
                    fontWeightOptions: options.fontWeightOptions,
                    styleOptions: options.styleOptions,
                  });
                }}
                options={fontFamilyOptions}
                placeholder={__('--- Select ---', '@@text_domain')}
              />
            </BaseControl>
          ) : null}
          <SelectControl
            multiple
            label={__('Weight', '@@text_domain')}
            value={weight}
            onChange={(val) => {
              this.setState({
                weight: val,
              });
            }}
            options={fontWeightOptions}
          />
          <SelectControl
            label={__('Style', '@@text_domain')}
            value={style}
            onChange={(val) => {
              this.setState({
                style: val,
              });
            }}
            options={styleOptions}
          />
          {error ? <div className="ghostkit-settings-fonts-google-form-error">{error}</div> : null}
          {notice ? (
            <div className="ghostkit-settings-fonts-google-form-notice">{notice}</div>
          ) : null}
          {isEdit ? (
            <Button
              isPrimary
              onClick={() => {
                let findFont = false;
                Object.keys(customFonts.google).forEach((fontKey) => {
                  if (
                    customFonts.google[fontKey].name === name &&
                    customFonts.google[fontKey].style === style &&
                    fontKey !== editKey
                  ) {
                    findFont = true;
                  }
                });
                if (name && editKey && !findFont) {
                  updateFonts({
                    google: {
                      ...customFonts.google,
                      [editKey]: {
                        name: this.state.name,
                        weight: this.state.weight,
                        style: this.state.style,
                      },
                    },
                  });

                  const options = this.getFontWeightAndStyleOptions(defaultFont);

                  this.setState({
                    name: defaultFont,
                    weight: ['400'],
                    style: 'normal',
                    fontWeightOptions: options.fontWeightOptions,
                    styleOptions: options.styleOptions,
                    error: '',
                    isEdit: false,
                    editKey: null,
                    notice: __('The font has been successfully edited', '@@text_domain'),
                  });
                } else if (!this.state.name) {
                  this.setState({
                    error: __('You should specify the `Name` to add new font.', '@@text_domain'),
                  });
                } else if (findFont) {
                  this.setState({
                    error: __('The font has already been added with style.', '@@text_domain'),
                  });
                }
              }}
            >
              {__('Edit Font', '@@text_domain')}
            </Button>
          ) : (
            <Button
              isPrimary
              onClick={() => {
                let findFont = false;
                Object.keys(customFonts.google).forEach((fontKey) => {
                  if (
                    customFonts.google[fontKey].name === name &&
                    customFonts.google[fontKey].style === style
                  ) {
                    findFont = true;
                  }
                });
                if (name && !findFont) {
                  updateFonts({
                    google: {
                      ...customFonts.google,
                      [Math.random().toString(36).substr(2, 9)]: {
                        name: this.state.name,
                        weight: this.state.weight,
                        style: this.state.style,
                      },
                    },
                  });

                  const options = this.getFontWeightAndStyleOptions(defaultFont);

                  this.setState({
                    name: defaultFont,
                    weight: ['400'],
                    style: 'normal',
                    fontWeightOptions: options.fontWeightOptions,
                    styleOptions: options.styleOptions,
                    error: '',
                    notice: '',
                    isEdit: false,
                  });
                } else if (!this.state.name) {
                  this.setState({
                    error: __('You should specify the `Name` to add new font.', '@@text_domain'),
                  });
                } else if (findFont) {
                  this.setState({
                    error: __(
                      'The font has already been added. To edit, use the font edit button in the table.',
                      '@@text_domain'
                    ),
                  });
                }
              }}
            >
              {__('Add Font', '@@text_domain')}
            </Button>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { isLoading, isEdit, editKey } = this.state;

    const { customFonts, updateFonts } = this.props;

    return (
      <div className={isLoading ? 'ghostkit-settings-fonts-loading' : ''}>
        {isLoading ? <Spinner /> : ''}
        {!isEdit ? this.renderEditor() : ''}
        {customFonts.google && Object.keys(customFonts.google).length ? (
          <Fragment>
            <br />
            <table className="widefat fixed striped">
              <thead>
                <tr>
                  <td>{__('Font Family', '@@text_domain')}</td>
                  <td>{__('Font Weights', '@@text_domain')}</td>
                  <td>{__('Font Style', '@@text_domain')}</td>
                  <td>{__('Actions', '@@text_domain')}</td>
                </tr>
              </thead>
              <tbody>
                {Object.keys(customFonts.google).map((key) => (
                  <Fragment key={customFonts.google[key].name + key}>
                    <tr>
                      <td>{customFonts.google[key].name}</td>
                      <td>
                        {Object.keys(customFonts.google[key].weight).map((weightKey) => {
                          weightKey = Number(weightKey);
                          return (
                            <Fragment key={customFonts.google[key].name + key + weightKey}>
                              {customFonts.google[key].weight[weightKey]}
                              {Number(customFonts.google[key].weight.length) === weightKey + 1
                                ? ''
                                : ', '}
                            </Fragment>
                          );
                        })}
                      </td>
                      <td>{customFonts.google[key].style}</td>
                      <td>
                        <Button
                          isLink
                          onClick={() => {
                            const result = { ...customFonts.google };

                            delete result[key];

                            updateFonts({
                              google: {
                                ...result,
                              },
                            });
                          }}
                        >
                          {__('Remove', '@@text_domain')}
                        </Button>
                        &nbsp;|&nbsp;
                        <Button
                          isLink
                          onClick={() => {
                            const result = { ...customFonts.google };

                            const options = this.getFontWeightAndStyleOptions(
                              result[key].name,
                              result[key].style
                            );

                            this.setState({
                              name: result[key].name,
                              style: result[key].style,
                              weight: result[key].weight,
                              fontWeightOptions: options.fontWeightOptions,
                              styleOptions: options.styleOptions,
                              isEdit: true,
                              editKey: key,
                            });
                          }}
                        >
                          {__('Edit', '@@text_domain')}
                        </Button>
                      </td>
                    </tr>
                    {isEdit && editKey === key ? (
                      <tr>
                        <td colSpan={4}>{this.renderEditor()}</td>
                      </tr>
                    ) : (
                      ''
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </Fragment>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default GoogleFonts;
