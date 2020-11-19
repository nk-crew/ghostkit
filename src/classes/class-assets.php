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
    private $already_added_custom_assets = false;

    /**
     * Visual_Portfolio_Extend constructor.
     */
    public function __construct() {
        add_action( 'init', array( $this, 'register_scripts' ) );

        add_action( 'plugins_loaded', array( $this, 'enqueue_scripts_action' ), 11 );

        add_action( 'ghostkit_parse_blocks', array( $this, 'maybe_enqueue_blocks_assets' ), 11, 2 );

        add_action( 'wp_enqueue_scripts', array( $this, 'add_custom_assets' ), 100 );
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
        $js_deps  = array( 'jquery', 'ghostkit-helper' );

        do_action( 'gkt_before_assets_register' );

        // Object Fit Images.
        if ( apply_filters( 'gkt_enqueue_plugin_object_fit_images', true ) ) {
            wp_register_script( 'object-fit-images', ghostkit()->plugin_url . 'assets/vendor/object-fit-images/dist/ofi.min.js', array(), '3.2.4', true );

            $js_deps[] = 'object-fit-images';
        }

        // ScrollReveal.
        if ( apply_filters( 'gkt_enqueue_plugin_scrollreveal', true ) ) {
            wp_register_script( 'scrollreveal', ghostkit()->plugin_url . 'assets/vendor/scrollreveal/dist/scrollreveal.min.js', array(), '4.0.7', true );

            $js_deps[] = 'scrollreveal';
        }

        // Jarallax.
        if ( apply_filters( 'gkt_enqueue_plugin_jarallax', true ) ) {
            wp_register_script( 'jarallax', ghostkit()->plugin_url . 'assets/vendor/jarallax/dist/jarallax.min.js', array( 'jquery' ), '1.12.4', true );
            wp_register_script( 'jarallax-video', ghostkit()->plugin_url . 'assets/vendor/jarallax/dist/jarallax-video.min.js', array( 'jarallax' ), '1.12.4', true );
        }

        // Swiper.
        if ( apply_filters( 'gkt_enqueue_plugin_swiper', true ) ) {
            // Add legacy swiper version in order to support Elementor plugin.
            // https://wordpress.org/support/topic/visual-portfolio-elementor-issue/.
            if ( class_exists( '\Elementor\Plugin' ) ) {
                wp_register_style( 'swiper', ghostkit()->plugin_url . 'assets/vendor/swiper-5-4-5/swiper.min.css', array(), '5.4.5' );
                wp_register_script( 'swiper', ghostkit()->plugin_url . 'assets/vendor/swiper-5-4-5/swiper.min.js', array(), '5.4.5', true );
            } else {
                wp_register_style( 'swiper', ghostkit()->plugin_url . 'assets/vendor/swiper/swiper-bundle.min.css', array(), '6.3.4' );
                wp_register_script( 'swiper', ghostkit()->plugin_url . 'assets/vendor/swiper/swiper-bundle.min.js', array(), '6.3.4', true );
            }
        }

        // GistEmbed.
        if ( apply_filters( 'gkt_enqueue_plugin_gist_simple', true ) ) {
            wp_register_style( 'gist-simple', ghostkit()->plugin_url . 'assets/vendor/gist-simple/dist/gist-simple.css', array(), '1.0.1' );
            wp_register_script( 'gist-simple', ghostkit()->plugin_url . 'assets/vendor/gist-simple/dist/gist-simple.min.js', array( 'jquery' ), '1.0.1', true );
        }

        // Google reCaptcha.
        if ( apply_filters( 'gkt_enqueue_google_recaptcha', true ) ) {
            $recaptcha_site_key   = get_option( 'ghostkit_google_recaptcha_api_site_key' );
            $recaptcha_secret_key = get_option( 'ghostkit_google_recaptcha_api_secret_key' );

            if ( $recaptcha_site_key && $recaptcha_secret_key ) {
                wp_register_script( 'google-recaptcha', 'https://www.google.com/recaptcha/api.js?render=' . esc_attr( $recaptcha_site_key ), array(), '3.0.0', true );
            }
        }

        // Parsley.
        if ( apply_filters( 'gkt_enqueue_plugin_parsley', true ) ) {
            wp_register_script( 'parsley', ghostkit()->plugin_url . 'assets/vendor/parsleyjs/dist/parsley.min.js', array( 'jquery' ), '2.9.2', true );

            $locale = get_locale();

            // phpcs:disable
            wp_add_inline_script(
                'parsley',
                'Parsley.addMessages("' . esc_attr( $locale ) . '", {
                    defaultMessage: "' . esc_attr__( 'This value seems to be invalid.', '@@text_domain' ) . '",
                    type: {
                        email:        "' . esc_attr__( 'This value should be a valid email.', '@@text_domain' ) . '",
                        url:          "' . esc_attr__( 'This value should be a valid url.', '@@text_domain' ) . '",
                        number:       "' . esc_attr__( 'This value should be a valid number.', '@@text_domain' ) . '",
                        integer:      "' . esc_attr__( 'This value should be a valid integer.', '@@text_domain' ) . '",
                        digits:       "' . esc_attr__( 'This value should be digits.', '@@text_domain' ) . '",
                        alphanum:     "' . esc_attr__( 'This value should be alphanumeric.', '@@text_domain' ) . '"
                    },
                    notblank:       "' . esc_attr__( 'This value should not be blank.', '@@text_domain' ) . '",
                    required:       "' . esc_attr__( 'This value is required.', '@@text_domain' ) . '",
                    pattern:        "' . esc_attr__( 'This value seems to be invalid.', '@@text_domain' ) . '",
                    min:            "' . esc_attr__( 'This value should be greater than or equal to %s.', '@@text_domain' ) . '",
                    max:            "' . esc_attr__( 'This value should be lower than or equal to %s.', '@@text_domain' ) . '",
                    range:          "' . esc_attr__( 'This value should be between %s and %s.', '@@text_domain' ) . '",
                    minlength:      "' . esc_attr__( 'This value is too short. It should have %s characters or more.', '@@text_domain' ) . '",
                    maxlength:      "' . esc_attr__( 'This value is too long. It should have %s characters or fewer.', '@@text_domain' ) . '",
                    length:         "' . esc_attr__( 'This value length is invalid. It should be between %s and %s characters long.', '@@text_domain' ) . '",
                    mincheck:       "' . esc_attr__( 'You must select at least %s choices.', '@@text_domain' ) . '",
                    maxcheck:       "' . esc_attr__( 'You must select %s choices or fewer.', '@@text_domain' ) . '",
                    check:          "' . esc_attr__( 'You must select between %s and %s choices.', '@@text_domain' ) . '",
                    equalto:        "' . esc_attr__( 'This value should be the same.', '@@text_domain' ) . '",
                    euvatin:        "' . esc_attr__( 'It\'s not a valid VAT Identification Number.', '@@text_domain' ) . '",
                    confirmEmail:   "' . esc_attr__( 'These emails should match.', '@@text_domain' ) . '",
                });

                Parsley.setLocale("' . esc_attr( $locale ) . '");',
                'after'
            );
            // phpcs:enable
        }

        // Get all sidebars.
        $sidebars = false;
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
            array( 'jquery' ),
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

        wp_localize_script(
            'ghostkit-helper',
            'ghostkitVariables',
            array(
                'themeName'                   => $theme_data->get( 'Name' ),
                'settings'                    => get_option( 'ghostkit_settings', array() ),
                'disabledBlocks'              => get_option( 'ghostkit_disabled_blocks', array() ),

                // TODO: Due to different formats in scss and assets there is an offset.
                'media_sizes'                 => array(
                    'sm' => $breakpoints['xs'],
                    'md' => $breakpoints['sm'],
                    'lg' => $breakpoints['md'],
                    'xl' => $breakpoints['lg'],
                ),
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
                'variants'                    => array(
                    'accordion'          => array_merge( $default_variant, apply_filters( 'gkt_accordion_variants', array() ) ),
                    'accordion_item'     => array_merge( $default_variant, apply_filters( 'gkt_accordion_item_variants', array() ) ),
                    'alert'              => array_merge( $default_variant, apply_filters( 'gkt_alert_variants', array() ) ),
                    'button_wrapper'     => array_merge( $default_variant, apply_filters( 'gkt_button_wrapper_variants', array() ) ),
                    'button'             => array_merge( $default_variant, apply_filters( 'gkt_button_variants', array() ) ),
                    'carousel'           => array_merge( $default_variant, apply_filters( 'gkt_carousel_variants', array() ) ),
                    'carousel_slide'     => array_merge( $default_variant, apply_filters( 'gkt_carousel_slide_variants', array() ) ),
                    'changelog'          => array_merge( $default_variant, apply_filters( 'gkt_changelog_variants', array() ) ),
                    'counter_box'        => array_merge( $default_variant, apply_filters( 'gkt_counter_box_variants', array() ) ),
                    'divider'            => array_merge( $default_variant, apply_filters( 'gkt_divider_variants', array() ) ),
                    'gist'               => array_merge( $default_variant, apply_filters( 'gkt_gist_variants', array() ) ),
                    'google_maps'        => array_merge( $default_variant, apply_filters( 'gkt_google_maps_variants', array() ) ),
                    'grid'               => array_merge( $default_variant, apply_filters( 'gkt_grid_variants', array() ) ),
                    'grid_column'        => array_merge( $default_variant, apply_filters( 'gkt_grid_column_variants', array() ) ),
                    'icon_box'           => array_merge( $default_variant, apply_filters( 'gkt_icon_box_variants', array() ) ),
                    'instagram'          => array_merge( $default_variant, apply_filters( 'gkt_instagram_variants', array() ) ),
                    'pricing_table'      => array_merge( $default_variant, apply_filters( 'gkt_pricing_table_variants', array() ) ),
                    'pricing_table_item' => array_merge( $default_variant, apply_filters( 'gkt_pricing_table_item_variants', array() ) ),
                    'progress'           => array_merge( $default_variant, apply_filters( 'gkt_progress_variants', array() ) ),
                    'tabs'               => array_merge( $default_variant, apply_filters( 'gkt_tabs_variants', array() ) ),
                    'tabs_tab'           => array_merge( $default_variant, apply_filters( 'gkt_tabs_tab_variants', array() ) ),
                    'testimonial'        => array_merge( $default_variant, apply_filters( 'gkt_testimonial_variants', array() ) ),
                    'twitter'            => array_merge( $default_variant, apply_filters( 'gkt_twitter_variants', array() ) ),
                    'video'              => array_merge( $default_variant, apply_filters( 'gkt_video_variants', array() ) ),
                ),
                'admin_url'                   => admin_url(),
                'admin_templates_url'         => admin_url( 'edit.php?post_type=ghostkit_template' ),
            )
        );

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

        // Blocks.
        foreach ( glob( ghostkit()->plugin_path . 'gutenberg/blocks/*/frontend.min.js' ) as $template ) {
            $block_name       = basename( dirname( $template ) );
            $block_script_url = ghostkit()->plugin_url . 'gutenberg/blocks/' . $block_name . '/frontend.min.js';
            $block_js_deps    = array( 'ghostkit', 'jquery' );

            switch ( $block_name ) {
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
                    $block_js_deps[] = 'moment';
                    break;
                case 'form':
                    if ( wp_script_is( 'parsley' ) || wp_script_is( 'parsley', 'registered' ) ) {
                        $block_js_deps[] = 'parsley';
                    }
                    if ( wp_script_is( 'google-recaptcha' ) || wp_script_is( 'google-recaptcha', 'registered' ) ) {
                        $block_js_deps[] = 'google-recaptcha';
                    }
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
        foreach ( glob( ghostkit()->plugin_path . 'gutenberg/blocks/*/styles/style.min.css' ) as $template ) {
            $block_name      = basename( dirname( dirname( $template ) ) );
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
        if ( $this->already_added_custom_assets ) {
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

        $this->already_added_custom_assets = true;
    }

    /**
     * Add custom CSS.
     *
     * @param String $name - handle name.
     * @param String $css - code.
     */
    public static function add_custom_css( $name, $css ) {
        $css = wp_kses( $css, array( '\'', '\"' ) );
        $css = str_replace( '&gt;', '>', $css );

        wp_register_style( $name, false, array(), '@@plugin_version' );
        wp_enqueue_style( $name );
        wp_add_inline_style( $name, $css );
    }

    /**
     * Add custom JS.
     *
     * @param String  $name - handle name.
     * @param String  $js - code.
     * @param Boolean $footer - print in footer.
     */
    public static function add_custom_js( $name, $js, $footer = false ) {
        wp_register_script( $name, '', array(), '@@plugin_version', $footer );
        wp_enqueue_script( $name );
        wp_add_inline_script( $name, $js );
    }
}

new GhostKit_Assets();
