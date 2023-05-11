/**
 * Import CSS
 */
import './fonts.scss';

/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

import ApplyFilters from '../../gutenberg/components/apply-filters';
import GoogleFonts from '../../gutenberg/components/google-fonts';

/**
 * WordPress dependencies
 */
const { Component } = wp.element;

const { ExternalLink, TabPanel } = wp.components;

const { __ } = wp.i18n;

const { withSelect, withDispatch } = wp.data;

const { compose } = wp.compose;

const { merge } = window.lodash;

const { apiFetch } = wp;

const { isFseTheme, typographyExist } = window.ghostkitVariables;

let reloadPage = false;

class FontsSettings extends Component {
  /**
   * We should reload page after fonts updated and when we visit the Fonts settings page.
   */
  componentWillUnmount() {
    if (reloadPage) {
      setTimeout(() => {
        window.location.reload();
      }, 0);
    }
  }

  render() {
    const { getIcon, customFonts, updateFonts } = this.props;

    const classes = classnames('ghostkit-settings-content-wrapper ghostkit-settings-fonts');

    return (
      <ApplyFilters name="ghostkit.fonts.settings" props={this.props}>
        {isFseTheme && !typographyExist ? (
          <div className={classes}>
            <TabPanel
              className="ghostkit-settings-fonts-tabs"
              tabs={[
                {
                  name: 'google',
                  title: (
                    <span>
                      {getIcon('icon-typography-google-fonts', false)}
                      {__('Google Fonts', '@@text_domain')}
                    </span>
                  ),
                },
                {
                  name: 'adobe',
                  title: (
                    <span>
                      {getIcon('icon-typography-adobe-fonts', false)}
                      {__('Adobe Fonts', '@@text_domain')}
                    </span>
                  ),
                },
                {
                  name: 'custom',
                  title: (
                    <span>
                      {getIcon('icon-typography-custom-fonts', false)}
                      {__('Custom Fonts', '@@text_domain')}
                    </span>
                  ),
                },
              ]}
            >
              {(data) => {
                if (data.name === 'google') {
                  return <GoogleFonts customFonts={customFonts} updateFonts={updateFonts} />;
                }

                if (data.name === 'custom') {
                  return (
                    <div className="ghostkit-settings-content-wrapper ghostkit-settings-fonts">
                      {__(
                        'Custom Fonts available for Pro users only. Read more about Ghost Kit Pro plugin here - ',
                        '@@text_domain'
                      )}
                      <ExternalLink href="https://ghostkit.io/pricing/?utm_source=plugin&utm_medium=settings&utm_campaign=fonts&utm_content=@@plugin_version">
                        https://ghostkit.io/pricing/
                      </ExternalLink>
                    </div>
                  );
                }

                return (
                  <div className="ghostkit-settings-content-wrapper ghostkit-settings-fonts">
                    {__(
                      'Adobe Fonts available for Pro users only. Read more about Ghost Kit Pro plugin here - ',
                      '@@text_domain'
                    )}
                    <ExternalLink href="https://ghostkit.io/pricing/?utm_source=plugin&utm_medium=settings&utm_campaign=fonts&utm_content=@@plugin_version">
                      https://ghostkit.io/pricing/
                    </ExternalLink>
                  </div>
                );
              }}
            </TabPanel>
          </div>
        ) : (
          <div className="ghostkit-settings-content-wrapper ghostkit-settings-fonts">
            {__(
              'Adobe and Custom Fonts available for Pro users only. Read more about Ghost Kit Pro plugin here - ',
              '@@text_domain'
            )}
            <ExternalLink href="https://ghostkit.io/pricing/?utm_source=plugin&utm_medium=settings&utm_campaign=fonts&utm_content=@@plugin_version">
              https://ghostkit.io/pricing/
            </ExternalLink>
          </div>
        )}
      </ApplyFilters>
    );
  }
}

const ComposeFontsSettings = compose([
  withSelect((select) => {
    const { getIcon } = select('ghostkit/base/utils').get();

    const customFonts = select('ghostkit/plugins/fonts').getCustomFonts();

    const defaultCustomFonts = {
      adobe: {
        token: false,
        errors: false,
        kits: false,
        kit: false,
        fonts: false,
      },
      google: false,
      custom: false,
    };

    return {
      getIcon,
      customFonts: merge(defaultCustomFonts, customFonts),
    };
  }),
  withDispatch((dispatch) => ({
    updateFonts(value) {
      dispatch('ghostkit/plugins/fonts').setCustomFonts(value);

      apiFetch({
        path: '/ghostkit/v1/update_custom_fonts',
        method: 'POST',
        data: {
          data: value,
        },
      }).then(() => {
        reloadPage = true;
      });
    },
  })),
])(FontsSettings);

export default function addFontSettings(Control, props) {
  return <ComposeFontsSettings {...props} />;
}
