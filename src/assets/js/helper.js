import EventHandler from './utils/event-handler';
import Instance from './utils/instance';

const {
  version,
  pro,

  themeName,
  settings,
  media_sizes: mediaSizes,
  disabledBlocks,
  allowPluginColorPalette,
  allowPluginCustomizer,
  allowTemplates,
  sidebars,
  timezone,

  googleMapsAPIKey,
  googleMapsAPIUrl,
  googleMapsLibrary,

  googleReCaptchaAPISiteKey,
  googleReCaptchaAPISecretKey,

  icons,
  shapes,
  fonts,
  customTypographyList,

  admin_url: adminUrl,
  admin_templates_url: adminTemplatesUrl,
} = window.ghostkitVariables;

// prepare media vars.
const vars = {};
const screenSizes = [];
Object.keys(mediaSizes).forEach((k) => {
  vars[`media_${k}`] = mediaSizes[k];
  screenSizes.push(mediaSizes[k]);
});

function escapeRegExp(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const GHOSTKIT = {
  version,
  pro,

  themeName,
  settings,

  disabledBlocks,

  allowPluginColorPalette,
  allowPluginCustomizer,
  allowTemplates,

  vars,
  replaceVars(str) {
    Object.keys(this.vars).forEach((key) => {
      str = str.replace(
        new RegExp(`#{ghostkitvar:${escapeRegExp(key)}}`, 'g'),
        `(max-width: ${this.vars[key]}px)`
      );
    });

    return str;
  },

  screenSizes,
  sidebars,
  timezone,

  googleMapsAPIKey,
  googleMapsAPIUrl,
  googleMapsLibrary,

  googleReCaptchaAPISiteKey,
  googleReCaptchaAPISecretKey,

  icons,
  shapes,
  fonts,
  customTypographyList,

  adminUrl,
  adminTemplatesUrl,

  /**
   * Instance helper functions.
   */
  instance: Instance,

  /**
   * Events helper functions.
   */
  events: EventHandler,

  /**
   * Check for block support GhostKit features.
   *
   * @param {Mixed} block - block props / block name
   * @param {String} featureName - feature name
   * @param {Mixed} defaultVal - default return value
   *
   * @return {Mixed} - supports flag
   */
  hasBlockSupport(block, featureName, defaultVal = false) {
    if (typeof block === 'string' && wp && wp.blocks) {
      const { getBlockType } = wp.blocks;

      if (getBlockType) {
        block = getBlockType(block);
      }
    }

    if (
      block &&
      block.ghostkit &&
      block.ghostkit.supports &&
      typeof block.ghostkit.supports[featureName] !== 'undefined'
    ) {
      return block.ghostkit.supports[featureName];
    }

    return defaultVal;
  },
};

window.GHOSTKIT = GHOSTKIT;
