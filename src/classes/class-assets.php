<?php
/**
 * Assets static and dynamic.
 *
 * @package @@plugin_name
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Assets
 */
class GhostKit_Assets {
    /**
     * List with stored assets.
     *
     * @var array
     */
    private static $stored_assets = array(
        'script'     => array(),
        'style'      => array(),
        'custom-css' => array(),
    );

    /**
     * Already added custom assets in head.
     *
     * @var boolean
     */
    private static $already_added_custom_assets = false;

    /**
     * Already add styles.
     *
     * @var array
     */
    private static $already_added_styles = array();

    /**
     * List with assets to skip from Autoptimize when CSS generated.
     *
     * @var array
     */
    protected static $skip_from_autoptimize = array(
        'ghostkit-blocks-content-custom-css',
        'ghostkit-blocks-widget-custom-css',
    );

    /**
     * Visual_Portfolio_Extend constructor.
     */
    public function __construct() {
        add_action( 'init', array( $this, 'register_scripts' ) );
        add_action( 'plugins_loaded', array( $this, 'enqueue_scripts_action' ), 11 );
        add_action( 'ghostkit_parse_blocks', array( $this, 'maybe_enqueue_blocks_assets' ), 11, 2 );
        add_action( 'wp_enqueue_scripts', array( $this, 'add_custom_assets' ), 100 );

        add_action( 'autoptimize_filter_css_exclude', 'GhostKit_Assets::autoptimize_filter_css_exclude' );
    }

    /**
     * Store used assets, so we can enqueue it later.
     *
     * @param string      $name - asset name.
     * @param bool|string $value - just enqueue flag or url to asset.
     * @param string      $type - assets type [script|style|custom-css].
     * @param int         $priority - asset enqueue priority.
     */
    public static function store_used_assets( $name, $value = true, $type = 'script', $priority = 10 ) {
        if ( ! isset( self::$stored_assets[ $type ] ) ) {
            return;
        }

        // We need to check for duplicate assets, which may be added because of custom locations.
        // Sometimes custom CSS is duplicated in Astra or Blocksy themes.
        if ( 'custom-css' === $type ) {
            if ( in_array( $value, self::$already_added_styles, true ) ) {
                return;
            }
            self::$already_added_styles[] = $value;
        }

        if ( isset( self::$stored_assets[ $type ][ $name ] ) ) {
            if ( 'custom-css' === $type ) {
                if ( ! self::$stored_assets[ $type ][ $name ]['value'] ) {
                    self::$stored_assets[ $type ][ $name ]['value'] = '';
                }

                self::$stored_assets[ $type ][ $name ]['value'] .= $value;
            }

            do_action( 'gkt_assets_store', $name, $value, $type, $priority );

            return;
        }

        self::$stored_assets[ $type ][ $name ] = array(
            'value'    => $value,
            'priority' => $priority,
        );

        do_action( 'gkt_assets_store', $name, $value, $type, $priority );
    }

    /**
     * Enqueue stored assets.
     *
     * @param string $type - assets type [script|style|custom-css].
     */
    public static function enqueue_stored_assets( $type = 'script' ) {
        if ( ! isset( self::$stored_assets[ $type ] ) || empty( self::$stored_assets[ $type ] ) ) {
            return;
        }

        uasort(
            self::$stored_assets[ $type ],
            function ( $a, $b ) {
                if ( $a === $b ) {
                    return 0;
                }

                if ( isset( $a['priority'] ) && isset( $b['priority'] ) ) {
                    return $a['priority'] < $b['priority'] ? -1 : 1;
                }

                return 0;
            }
        );

        foreach ( self::$stored_assets[ $type ] as $name => $data ) {
            if ( isset( $data['value'] ) && $data['value'] ) {
                if ( 'script' === $type ) {
                    wp_enqueue_script( $name );
                } elseif ( 'style' === $type ) {
                    wp_enqueue_style( $name );
                } elseif ( 'custom-css' === $type ) {
                    self::add_custom_css( $name, $data['value'] );
                }

                self::$stored_assets[ $type ]['value'] = false;
            }
        }
    }

    /**
     * Enqueue assets for blocks.
     *
     * @param array  $blocks - blocks array.
     * @param string $location - blocks location [content,widget].
     */
    public static function enqueue( $blocks = array(), $location = 'content' ) {
        self::store_used_assets( 'ghostkit', true, 'style', 9 );
        self::store_used_assets( 'ghostkit', true, 'script', 11 );

        // Prepare blocks assets.
        foreach ( $blocks as $block ) {
            // GhostKit blocks.
            if ( isset( $block['blockName'] ) && strpos( $block['blockName'], 'ghostkit/' ) === 0 ) {
                $block_name = preg_replace( '/^ghostkit\//', '', $block['blockName'] );

                self::store_used_assets( 'ghostkit-block-' . $block_name, true, 'style' );
                self::store_used_assets( 'ghostkit-block-' . $block_name, true, 'script' );
            }
        }

        // Blocks custom CSS.
        $blocks_css = self::parse_blocks_css( $blocks );

        if ( ! empty( $blocks_css ) ) {
            self::store_used_assets( 'ghostkit-blocks-' . $location . '-custom-css', ghostkit()->replace_vars( $blocks_css ), 'custom-css' );
        }
    }

    /**
     * Enqueue scripts and styles actions.
     * We need this to be used inside 'plugins_loaded' action to prevent conflicts with plugins and themes.
     *
     * 1. Enqueue plugins assets
     * 2. Enqueue Ghost Kit assets
     * 3. Enqueue theme assets
     * 4. Enqueue Ghost Kit custom css
     */
    public function enqueue_scripts_action() {
        add_action( 'wp_enqueue_scripts', array( $this, 'wp_enqueue_head_assets' ) );
        add_action( 'wp_footer', array( $this, 'wp_enqueue_foot_assets' ) );

        // Custom css with higher priority to overwrite theme styles.
        add_action( 'wp_enqueue_scripts', array( $this, 'wp_enqueue_head_custom_assets' ), 11 );
        add_action( 'wp_footer', array( $this, 'wp_enqueue_foot_custom_assets' ), 11 );
    }

    /**
     * Register scripts that will be used in the future when portfolio will be printed.
     */
    public function register_scripts() {
        $css_deps = array();
        $js_deps  = array( 'ghostkit-helper', 'ghostkit-event-fallbacks' );

        do_action( 'gkt_before_assets_register' );

        // Motion.
        if ( apply_filters( 'gkt_enqueue_plugin_motion', true ) ) {
            wp_register_script( 'motion', ghostkit()->plugin_url . 'assets/vendor/motion/dist/motion.umd.js', array(), '10.16.2', true );

            $js_deps[] = 'motion';
        }

        // Jarallax.
        if ( apply_filters( 'gkt_enqueue_plugin_jarallax', true ) ) {
            wp_register_script( 'jarallax', ghostkit()->plugin_url . 'assets/vendor/jarallax/dist/jarallax.min.js', array(), '2.0.1', true );
            wp_register_script( 'jarallax-video', ghostkit()->plugin_url . 'assets/vendor/jarallax/dist/jarallax-video.min.js', array( 'jarallax' ), '2.0.1', true );
        }

        // Swiper.
        if ( apply_filters( 'gkt_enqueue_plugin_swiper', true ) ) {
            // Add legacy swiper version in order to support Elementor plugin.
            // https://wordpress.org/support/topic/visual-portfolio-elementor-issue/.
            if ( class_exists( '\Elementor\Plugin' ) ) {
                wp_register_style( 'swiper', ghostkit()->plugin_url . 'assets/vendor/swiper-5-4-5/swiper.min.css', array(), '5.4.5' );
                wp_register_script( 'swiper', ghostkit()->plugin_url . 'assets/vendor/swiper-5-4-5/swiper.min.js', array(), '5.4.5', true );
            } else {
                wp_register_style( 'swiper', ghostkit()->plugin_url . 'assets/vendor/swiper/swiper-bundle.min.css', array(), '8.4.6' );
                wp_register_script( 'swiper', ghostkit()->plugin_url . 'assets/vendor/swiper/swiper-bundle.min.js', array(), '8.4.6', true );
            }
        }

        // Luxon.
        if ( apply_filters( 'gkt_enqueue_plugin_luxon', true ) ) {
            wp_register_script( 'luxon', ghostkit()->plugin_url . 'assets/vendor/luxon/build/global/luxon.min.js', array(), '3.3.0', true );
        }

        // Lottie Player.
        if ( apply_filters( 'gkt_enqueue_plugin_lottie_player', true ) ) {
            wp_register_script( 'lottie-player', ghostkit()->plugin_url . 'assets/vendor/lottie-player/dist/lottie-player.js', array(), '1.7.1', true );
            wp_script_add_data( 'lottie-player', 'async', true );
        }

        // GistEmbed.
        if ( apply_filters( 'gkt_enqueue_plugin_gist_simple', true ) ) {
            wp_register_style( 'gist-simple', ghostkit()->plugin_url . 'assets/vendor/gist-simple/dist/gist-simple.css', array(), '2.0.0' );
            wp_register_script( 'gist-simple', ghostkit()->plugin_url . 'assets/vendor/gist-simple/dist/gist-simple.min.js', array(), '2.0.0', true );
        }

        // Google reCaptcha.
        if ( apply_filters( 'gkt_enqueue_google_recaptcha', true ) ) {
            $recaptcha_site_key   = get_option( 'ghostkit_google_recaptcha_api_site_key' );
            $recaptcha_secret_key = get_option( 'ghostkit_google_recaptcha_api_secret_key' );

            if ( $recaptcha_site_key && $recaptcha_secret_key ) {
                wp_register_script( 'google-recaptcha', 'https://www.google.com/recaptcha/api.js?render=' . esc_attr( $recaptcha_site_key ), array(), '3.0.0', true );
            }
        }

        // Get all sidebars.
        $sidebars = array();
        if ( ! empty( $GLOBALS['wp_registered_sidebars'] ) ) {
            foreach ( $GLOBALS['wp_registered_sidebars'] as $k => $sidebar ) {
                $sidebars[ $k ] = array(
                    'id'   => $sidebar['id'],
                    'name' => $sidebar['name'],
                );
            }
        }

        // helper script.
        wp_register_script(
            'ghostkit-helper',
            ghostkit()->plugin_url . 'assets/js/helper.min.js',
            array(),
            '@@plugin_version',
            true
        );
        $default_variant = array(
            'default' => array(
                'title' => esc_html__( 'Default', '@@text_domain' ),
            ),
        );

        // Google Maps prepare localization as in WordPress settings.
        $gmaps_locale = get_locale();
        $gmaps_suffix = '.com';
        switch ( $gmaps_locale ) {
            case 'he_IL':
                // Hebrew correction.
                $gmaps_locale = 'iw';
                break;
            case 'zh_CN':
                // Chinese integration.
                $gmaps_suffix = '.cn';
                break;
        }
        $gmaps_locale = substr( $gmaps_locale, 0, 2 );

        $theme_data = wp_get_theme( get_template() );

        $breakpoints = GhostKit_Breakpoints::get_breakpoints();

        $timezone = wp_timezone_string();

        if ( substr( $timezone, 0, 1 ) === '+' || substr( $timezone, 0, 1 ) === '-' ) {
            $timezone = 'UTC' . $timezone;
        }

        $global_data = array(
            'version'                     => '@@plugin_version',
            'pro'                         => false,

            'themeName'                   => $theme_data->get( 'Name' ),
            'isFseTheme'                  => current_theme_supports( 'block-templates' ) ? true : false,
            'fontsApiExist'               => class_exists( 'WP_Fonts' ),
            'typographyExist'             => GhostKit_Typography::typography_exist(),
            'settings'                    => get_option( 'ghostkit_settings', array() ),
            'disabledBlocks'              => get_option( 'ghostkit_disabled_blocks', array() ),

            // TODO: Due to different formats in scss and assets there is an offset.
            'media_sizes'                 => array(
                'sm' => $breakpoints['xs'],
                'md' => $breakpoints['sm'],
                'lg' => $breakpoints['md'],
                'xl' => $breakpoints['lg'],
            ),
            'timezone'                    => $timezone,
            'googleMapsAPIKey'            => get_option( 'ghostkit_google_maps_api_key' ),
            'googleMapsAPIUrl'            => 'https://maps.googleapis' . $gmaps_suffix . '/maps/api/js?v=3.exp&language=' . esc_attr( $gmaps_locale ),
            'googleMapsLibrary'           => apply_filters( 'gkt_enqueue_plugin_gmaps', true ) ? array(
                'url' => ghostkit()->plugin_url . 'assets/vendor/gmaps/gmaps.min.js?ver=0.4.25',
            ) : false,
            'googleReCaptchaAPISiteKey'   => get_option( 'ghostkit_google_recaptcha_api_site_key' ),
            'googleReCaptchaAPISecretKey' => is_admin() ? get_option( 'ghostkit_google_recaptcha_api_secret_key' ) : '',
            'sidebars'                    => $sidebars,
            'icons'                       => is_admin() ? apply_filters( 'gkt_icons_list', array() ) : array(),
            'shapes'                      => is_admin() ? apply_filters( 'gkt_shapes_list', array() ) : array(),
            'fonts'                       => is_admin() ? apply_filters( 'gkt_fonts_list', array() ) : array(),
            'customTypographyList'        => is_admin() ? apply_filters( 'gkt_custom_typography', array() ) : array(),
            'admin_url'                   => admin_url(),
            'admin_templates_url'         => admin_url( 'edit.php?post_type=ghostkit_template' ),
        );

        $global_data = apply_filters( 'gkt_global_data', $global_data );

        wp_localize_script(
            'ghostkit-helper',
            'ghostkitVariables',
            $global_data
        );

        // events fallback script.
        wp_register_script(
            'ghostkit-event-fallbacks',
            ghostkit()->plugin_url . 'assets/js/event-fallbacks.min.js',
            array( 'ghostkit-helper' ),
            '@@plugin_version',
            true
        );

        // Fallback for classic themes.
        if ( ! wp_is_block_theme() ) {
            wp_register_style(
                'ghostkit-classic-theme-fallback',
                ghostkit()->plugin_url . 'assets/css/fallback-classic-theme.css',
                array(),
                '@@plugin_version'
            );
            $css_deps[] = 'ghostkit-classic-theme-fallback';
        }

        // Ghost Kit.
        wp_register_style(
            'ghostkit',
            ghostkit()->plugin_url . 'gutenberg/style.min.css',
            $css_deps,
            '@@plugin_version'
        );
        wp_style_add_data( 'ghostkit', 'rtl', 'replace' );
        wp_style_add_data( 'ghostkit', 'suffix', '.min' );

        wp_register_script(
            'ghostkit',
            ghostkit()->plugin_url . 'assets/js/main.min.js',
            $js_deps,
            '@@plugin_version',
            true
        );

        // Extensions.
        foreach ( glob( ghostkit()->plugin_path . 'gutenberg/extend/*/frontend.min.js' ) as $file ) {
            $ext_name       = basename( dirname( $file ) );
            $ext_script_url = ghostkit()->plugin_url . 'gutenberg/extend/' . $ext_name . '/frontend.min.js';
            $ext_js_deps    = array( 'ghostkit' );

            switch ( $ext_name ) {
                case 'animation':
                    $ext_js_deps[] = 'motion';
                    break;
            }

            wp_register_script(
                'ghostkit-extension-' . $ext_name,
                $ext_script_url,
                array_unique( $ext_js_deps ),
                '@@plugin_version',
                true
            );
            self::store_used_assets( 'ghostkit-extension-' . $ext_name, true, 'script' );
        }

        // Style Variants.
        foreach ( glob( ghostkit()->plugin_path . 'gutenberg/style-variants/*/frontend.min.js' ) as $template ) {
            $ext_name       = basename( dirname( $template ) );
            $ext_script_url = ghostkit()->plugin_url . 'gutenberg/style-variants/' . $ext_name . '/frontend.min.js';
            $ext_js_deps    = array( 'ghostkit' );

            wp_register_script(
                'ghostkit-style-variant-' . $ext_name,
                $ext_script_url,
                array_unique( $ext_js_deps ),
                '@@plugin_version',
                true
            );
            self::store_used_assets( 'ghostkit-style-variant-' . $ext_name, true, 'script' );
        }

        // Blocks.
        foreach ( glob( ghostkit()->plugin_path . 'gutenberg/blocks/*/frontend.min.js' ) as $file ) {
            $block_name       = basename( dirname( $file ) );
            $block_script_url = ghostkit()->plugin_url . 'gutenberg/blocks/' . $block_name . '/frontend.min.js';
            $block_js_deps    = array( 'ghostkit' );

            switch ( $block_name ) {
                case 'accordion':
                case 'alert':
                    $block_js_deps[] = 'motion';
                    break;
                case 'grid':
                case 'grid-column':
                    if ( wp_script_is( 'jarallax-video' ) || wp_script_is( 'jarallax-video', 'registered' ) ) {
                        $block_js_deps[] = 'jarallax-video';
                    }
                    if ( wp_script_is( 'jarallax' ) || wp_script_is( 'jarallax', 'registered' ) ) {
                        $block_js_deps[] = 'jarallax';
                    }
                    break;
                case 'video':
                    if ( wp_script_is( 'jarallax-video' ) || wp_script_is( 'jarallax-video', 'registered' ) ) {
                        $block_js_deps[] = 'jarallax-video';
                    }
                    break;
                case 'gist':
                    if ( wp_script_is( 'gist-simple' ) || wp_script_is( 'gist-simple', 'registered' ) ) {
                        $block_js_deps[] = 'gist-simple';
                    }
                    break;
                case 'carousel':
                    if ( wp_script_is( 'swiper' ) || wp_script_is( 'swiper', 'registered' ) ) {
                        $block_js_deps[] = 'swiper';
                    }
                    break;
                case 'countdown':
                    $block_js_deps[] = 'luxon';
                    break;
                case 'form':
                    if ( wp_script_is( 'google-recaptcha' ) || wp_script_is( 'google-recaptcha', 'registered' ) ) {
                        $block_js_deps[] = 'google-recaptcha';
                    }
                    $block_js_deps[] = 'wp-i18n';
                    break;
                case 'lottie':
                    $block_js_deps[] = 'motion';
                    $block_js_deps[] = 'lottie-player';
                    break;
                case 'tabs':
                    $block_name = 'tabs-v2';
                    break;
            }

            wp_register_script(
                'ghostkit-block-' . $block_name,
                $block_script_url,
                array_unique( $block_js_deps ),
                '@@plugin_version',
                true
            );
        }
        foreach ( glob( ghostkit()->plugin_path . 'gutenberg/blocks/*/styles/style.min.css' ) as $file ) {
            $block_name      = basename( dirname( dirname( $file ) ) );
            $block_style_url = ghostkit()->plugin_url . 'gutenberg/blocks/' . $block_name . '/styles/style.min.css';
            $block_css_deps  = array( 'ghostkit' );

            switch ( $block_name ) {
                case 'gist':
                    $block_css_deps[] = 'gist-simple';
                    break;
                case 'carousel':
                    $block_css_deps[] = 'swiper';
                    break;
                case 'tabs':
                    $block_name = 'tabs-v2';
                    break;
            }

            wp_register_style(
                'ghostkit-block-' . $block_name,
                $block_style_url,
                array_unique( $block_css_deps ),
                '@@plugin_version'
            );
            wp_style_add_data( 'ghostkit-block-' . $block_name, 'rtl', 'replace' );
            wp_style_add_data( 'ghostkit-block-' . $block_name, 'suffix', '.min' );
        }

        do_action( 'gkt_after_assets_register' );
    }

    /**
     * Enqueue styles in head.
     */
    public function wp_enqueue_head_assets() {
        self::enqueue_stored_assets( 'style' );
        self::enqueue_stored_assets( 'script' );
    }

    /**
     * Enqueue custom styles in head.
     */
    public function wp_enqueue_head_custom_assets() {
        self::enqueue_stored_assets( 'custom-css' );
    }

    /**
     * Enqueue scripts and styles in foot.
     */
    public function wp_enqueue_foot_assets() {
        self::enqueue_stored_assets( 'style' );
        self::enqueue_stored_assets( 'script' );
    }

    /**
     * Enqueue custom styles in foot.
     */
    public function wp_enqueue_foot_custom_assets() {
        self::enqueue_stored_assets( 'custom-css' );
    }

    /**
     * Enqueue blocks assets.
     *
     * @param array $blocks - blocks array.
     * @param array $location - blocks location [content,widget].
     */
    public function maybe_enqueue_blocks_assets( $blocks, $location ) {
        if ( self::$already_added_custom_assets ) {
            $location = 'widget';
        }

        self::enqueue( $blocks, $location );
    }

    /**
     * Parse blocks and prepare styles
     *
     * @param array $blocks Blocks array with attributes.
     * @return string
     */
    public static function parse_blocks_css( $blocks ) {
        $styles = '';

        foreach ( $blocks as $block ) {
            if ( isset( $block['attrs'] ) ) {
                $styles .= GhostKit_Block_Custom_Styles::get( $block['attrs'] );
                $styles .= GhostKit_Block_Custom_CSS::get( $block['attrs'] );
            }
        }

        return $styles;
    }

    /**
     * Add styles from blocks to the head section.
     *
     * @param int $post_id - current post id.
     */
    public function add_custom_assets( $post_id ) {
        $global_code = get_option( 'ghostkit_custom_code', array() );

        if ( is_singular() && ! $post_id ) {
            $post_id = get_the_ID();
        }

        $is_single = is_singular() && $post_id;

        // Global custom CSS.
        if ( $global_code && isset( $global_code['ghostkit_custom_css'] ) && $global_code['ghostkit_custom_css'] ) {
            self::add_custom_css( 'ghostkit-global-custom-css', $global_code['ghostkit_custom_css'] );
        }

        // Local custom CSS.
        if ( $is_single ) {
            $meta_css = get_post_meta( $post_id, 'ghostkit_custom_css', true );

            if ( ! empty( $meta_css ) ) {
                self::add_custom_css( 'ghostkit-custom-css', $meta_css );
            }
        }

        // Global custom JS head.
        if ( $global_code && isset( $global_code['ghostkit_custom_js_head'] ) && $global_code['ghostkit_custom_js_head'] ) {
            self::add_custom_js( 'ghostkit-global-custom-js-head', $global_code['ghostkit_custom_js_head'] );
        }

        // Local custom JS head.
        if ( $is_single ) {
            $meta_js_head = get_post_meta( $post_id, 'ghostkit_custom_js_head', true );

            if ( ! empty( $meta_js_head ) ) {
                self::add_custom_js( 'ghostkit-custom-js-head', $meta_js_head );
            }
        }

        // Global custom JS foot.
        if ( $global_code && isset( $global_code['ghostkit_custom_js_foot'] ) && $global_code['ghostkit_custom_js_foot'] ) {
            self::add_custom_js( 'ghostkit-global-custom-js-foot', $global_code['ghostkit_custom_js_foot'], true );
        }

        // Local custom JS foot.
        if ( $is_single ) {
            $meta_js_foot = get_post_meta( $post_id, 'ghostkit_custom_js_foot', true );

            if ( ! empty( $meta_js_foot ) ) {
                self::add_custom_js( 'ghostkit-custom-js-foot', $meta_js_foot, true );
            }
        }

        self::$already_added_custom_assets = true;
    }

    /**
     * Skip custom styles from Autoptimize.
     * We need this since generated CSS with custom breakpoints are excluded
     * from Autoptimize by default and this cause conflicts.
     *
     * @param string $result - allowed list.
     * @return string
     */
    public static function autoptimize_filter_css_exclude( $result ) {
        // By default in Autoptimize excluded folder `wp-content/uploads/`.
        // We need to check, if this folder is not excluded, then we
        // don't need to use our hack.
        if ( $result && strpos( $result, 'wp-content/uploads/' ) === false ) {
            return $result;
        }

        foreach ( self::$skip_from_autoptimize as $name ) {
            if ( $result ) {
                $result .= ',';
            } else {
                $result = '';
            }

            $result .= $name;
        }

        return $result;
    }

    /**
     * Add custom CSS.
     *
     * @param string $name - handle name.
     * @param string $css - code.
     */
    public static function add_custom_css( $name, $css ) {
        if ( ! wp_style_is( $name, 'enqueued' ) ) {
            $css = wp_kses( $css, array( '\'', '\"' ) );
            $css = str_replace( '&gt;', '>', $css );

            $allow_js_fallback = apply_filters( 'gkt_custom_css_allow_js_fallback', self::$already_added_custom_assets, $name, $css );

            // Enqueue custom CSS.
            if ( ! $allow_js_fallback ) {
                wp_register_style( $name, false, array(), '@@plugin_version' );
                wp_enqueue_style( $name );
                wp_add_inline_style( $name, $css );

                // Enqueue JS instead of CSS when rendering in <body> to prevent W3C errors.
            } elseif ( ! wp_script_is( $name, 'enqueued' ) ) {
                wp_register_script( $name, false, array(), '@@plugin_version', true );
                wp_enqueue_script( $name );
                wp_add_inline_script(
                    $name,
                    '(function(){
                        var styleTag = document.createElement("style");
                        styleTag.id = "' . esc_attr( $name ) . '-inline-css";
                        styleTag.innerHTML = ' . wp_json_encode( $css ) . ';
                        document.body.appendChild(styleTag);
                    }());'
                );
            }
        }

        self::$stored_assets[] = $name;
    }

    /**
     * Add custom JS.
     *
     * @param string  $name - handle name.
     * @param string  $js - code.
     * @param boolean $footer - print in footer.
     */
    public static function add_custom_js( $name, $js, $footer = false ) {
        wp_register_script( $name, '', array(), '@@plugin_version', $footer );
        wp_enqueue_script( $name );
        wp_add_inline_script( $name, $js );
    }
}

new GhostKit_Assets();
