const { ghostkitVariables } = window;
const $ = window.jQuery;
const $doc = $(document);

// prepare media vars.
const vars = {};
Object.keys(ghostkitVariables.media_sizes).forEach((k) => {
  vars[`media_${k}`] = ghostkitVariables.media_sizes[k];
});

function escapeRegExp(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

window.GHOSTKIT = {
  themeName: ghostkitVariables.themeName,

  settings: ghostkitVariables.settings,

  disabledBlocks: ghostkitVariables.disabledBlocks,

  allowPluginCustomizer: ghostkitVariables.allowPluginCustomizer,

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

  sidebars: ghostkitVariables.sidebars,

  timezone: ghostkitVariables.timezone,

  googleMapsAPIKey: ghostkitVariables.googleMapsAPIKey,
  googleMapsAPIUrl: ghostkitVariables.googleMapsAPIUrl,
  googleMapsLibrary: ghostkitVariables.googleMapsLibrary,

  googleReCaptchaAPISiteKey: ghostkitVariables.googleReCaptchaAPISiteKey,
  googleReCaptchaAPISecretKey: ghostkitVariables.googleReCaptchaAPISecretKey,

  icons: ghostkitVariables.icons,
  shapes: ghostkitVariables.shapes,
  fonts: ghostkitVariables.fonts,
  customTypographyList: ghostkitVariables.customTypographyList,
  variants: ghostkitVariables.variants,
  getVariants(name) {
    if ('undefined' !== typeof this.variants[name]) {
      return this.variants[name];
    }
    return false;
  },

  adminUrl: ghostkitVariables.admin_url,
  adminTemplatesUrl: ghostkitVariables.admin_templates_url,

  triggerEvent(name, ...args) {
    $doc.trigger(`${name}.ghostkit`, [...args]);
  },

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
    if ('string' === typeof block && wp && wp.blocks) {
      const { getBlockType } = wp.blocks;

      if (getBlockType) {
        block = getBlockType(block);
      }
    }

    if (
      block &&
      block.ghostkit &&
      block.ghostkit.supports &&
      'undefined' !== typeof block.ghostkit.supports[featureName]
    ) {
      return block.ghostkit.supports[featureName];
    }

    return defaultVal;
  },
};
