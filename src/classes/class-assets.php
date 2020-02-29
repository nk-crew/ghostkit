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
     * Visual_Portfolio_Extend constructor.
     */
    public function __construct() {
        add_action( 'init', array( $this, 'register_scripts' ) );

        add_action( 'wp_enqueue_scripts', array( $this, 'wp_enqueue_head_assets' ), 9 );

        add_action( 'wp_footer', array( $this, 'wp_enqueue_foot_assets' ) );

        add_action( 'ghostkit_parse_blocks', array( $this, 'maybe_enqueue_blocks_assets' ), 10, 2 );

        add_action( 'wp_enqueue_scripts', array( $this, 'add_blocks_assets' ), 100 );
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

            return;
        }

        self::$stored_assets[ $type ][ $name ] = array(
            'value'    => $value,
            'priority' => $priority,
        );
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

                return $a['priority'] < $b['priority'] ? -1 : 1;
            }
        );

        foreach ( self::$stored_assets[ $type ] as $name => $data ) {
            $val = $data['value'];

            if ( $val ) {
                if ( 'script' === $type ) {
                    wp_enqueue_script( $name );
                } elseif ( 'style' === $type ) {
                    wp_enqueue_style( $name );
                } elseif ( 'custom-css' === $type ) {
                    self::add_custom_css( $name, $val );
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
     * Register scripts that will be used in the future when portfolio will be printed.
     */
    public function register_scripts() {
        $css_deps = array();
        $js_deps  = array( 'jquery', 'ghostkit-helper', 'wp-i18n' );

        do_action( 'gkt_before_assets_register' );

        // Object Fit Images.
        if ( apply_filters( 'gkt_enqueue_plugin_object_fit_images', true ) ) {
            wp_register_script( 'object-fit-images', ghostkit()->plugin_url . 'assets/vendor/object-fit-images/ofi.min.js', array(), '3.2.4', true );

            $js_deps[] = 'object-fit-images';
        }

        // ScrollReveal.
        if ( apply_filters( 'gkt_enqueue_plugin_scrollreveal', true ) ) {
            wp_register_script( 'scrollreveal', ghostkit()->plugin_url . 'assets/vendor/scrollreveal/scrollreveal.min.js', array(), '4.0.5', true );

            $js_deps[] = 'scrollreveal';
        }

        // Jarallax.
        if ( apply_filters( 'gkt_enqueue_plugin_jarallax', true ) ) {
            wp_register_script( 'jarallax', ghostkit()->plugin_url . 'assets/vendor/jarallax/dist/jarallax.min.js', array( 'jquery' ), '1.12.0', true );
            wp_register_script( 'jarallax-video', ghostkit()->plugin_url . 'assets/vendor/jarallax/dist/jarallax-video.min.js', array( 'jarallax' ), '1.12.0', true );
        }

        // Swiper.
        if ( apply_filters( 'gkt_enqueue_plugin_swiper', true ) ) {
            wp_register_style( 'swiper', ghostkit()->plugin_url . 'assets/vendor/swiper/css/swiper.min.css', array(), '5.1.0' );
            wp_register_script( 'swiper', ghostkit()->plugin_url . 'assets/vendor/swiper/js/swiper.min.js', array(), '5.1.0', true );
        }

        // GistEmbed.
        if ( apply_filters( 'gkt_enqueue_plugin_gist_simple', true ) ) {
            wp_register_style( 'gist-simple', ghostkit()->plugin_url . 'assets/vendor/gist-simple/gist-simple.css', array(), '1.0.1' );
            wp_register_script( 'gist-simple', ghostkit()->plugin_url . 'assets/vendor/gist-simple/gist-simple.min.js', array( 'jquery' ), '1.0.1', true );
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

        wp_localize_script(
            'ghostkit-helper',
            'ghostkitVariables',
            array(
                'themeName'            => $theme_data->get( 'Name' ),
                'settings'             => get_option( 'ghostkit_settings', array() ),
                'disabledBlocks'       => get_option( 'ghostkit_disabled_blocks', array() ),

                // TODO: Move this to plugin options (part 1).
                'media_sizes'          => array(
                    'sm' => 576,
                    'md' => 768,
                    'lg' => 992,
                    'xl' => 1200,
                ),
                'googleMapsAPIKey'     => get_option( 'ghostkit_google_maps_api_key' ),
                'googleMapsAPIUrl'     => 'https://maps.googleapis' . $gmaps_suffix . '/maps/api/js?v=3.exp&language=' . esc_attr( $gmaps_locale ),
                'googleMapsLibrary'    => apply_filters( 'gkt_enqueue_plugin_gmaps', true ) ? array(
                    'url' => ghostkit()->plugin_url . 'assets/vendor/gmaps/gmaps.min.js?ver=0.4.25',
                ) : false,
                'sidebars'             => $sidebars,
                'icons'                => is_admin() ? apply_filters(
                    'gkt_icons_list',
                    array(
                    /**
                    * Example:
                        array(
                            'font-awesome' => array(
                                'name' => 'FontAwesome',
                                'icons' => array(
                                    array(
                                        'keys' => 'adobe,brand',
                                        'svg' => '<svg class="ghostkit-svg-icon ghostkit-svg-icon-fa" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M315.5 64h170.9v384L315.5 64zm-119 0H25.6v384L196.5 64zM256 206.1L363.5 448h-73l-30.7-76.8h-78.7L256 206.1z"></path></svg>',
                                    ),
                                    ...
                                ),
                            ),
                        )
                    */
                    )
                ) : array(),
                'shapes'               => is_admin() ? apply_filters(
                    'gkt_shapes_list',
                    array(
                    /**
                    * Example:
                        array(
                            'default' => array(
                                'name' => 'Default',
                                'shapes' => array(
                                    array(
                                        'label'                 => esc_html__( 'Wave', '@@text_domain' ),
                                        'name'                  => 'wave',
                                        'allow_flip_vertical'   => true,
                                        'allow_flip_horizontal' => true,
                                        'path'                  => ghostkit()->plugin_path . '/gutenberg/shapes/wave.svg',
                                    ),
                                    ...
                                ),
                            ),
                        )
                    */
                    )
                ) : array(),
                'fonts'                => is_admin() ? apply_filters(
                    'gkt_fonts_list',
                    array(
                        /**
                         * Example:
                            array(
                                'google-fonts' => array(
                                    'name' => 'Google Fonts',
                                        'fonts' => array(
                                            array(
                                                'Abhaya Libre' => array(
                                                    '500',
                                                    '600',
                                                ),
                                            ),
                                        ...
                                    ),
                                ),
                            )
                         */
                    )
                ) : array(),
                'customTypographyList' => is_admin() ? apply_filters(
                    'gkt_custom_typography',
                    array(
                        /**
                         * Example:
                            array(
                                'titles' => array(
                                    'label' => esc_html__( 'Titles', '@@text_domain' ),
                                    'defaults' => array(
                                        'font-family-category' => 'google-fonts',
                                        'font-family' => 'Roboto',
                                        'font-size' => '',
                                        'font-weight' => '',
                                        // 'line-height',
                                        // 'letter-spacing',
                                    ),
                                    'output' => array(
                                        array(
                                            'body',
                                        ),
                                        array(
                                            '.edit-post-visual-editor.editor-styles-wrapper',
                                            'context' => array( 'editor' ),
                                        ),
                                    ),
                                ),
                            )
                         */
                    )
                ) : array(),
                'variants'             => array(
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
                'admin_url'            => admin_url(),
                'admin_templates_url'  => admin_url( 'edit.php?post_type=ghostkit_template' ),
            )
        );

        // Ghost Kit.
        wp_register_style(
            'ghostkit',
            ghostkit()->plugin_url . 'assets/css/main.min.css',
            $css_deps,
            '@@plugin_version'
        );
        wp_register_script(
            'ghostkit',
            ghostkit()->plugin_url . 'assets/js/main.min.js',
            $js_deps,
            '@@plugin_version',
            true
        );

        // Blocks.
        foreach ( glob( ghostkit()->plugin_path . 'assets/js/block-*.min.js' ) as $template ) {
            $file_name     = basename( $template );
            $block_name    = preg_replace( '/^block-/', '', $file_name );
            $block_name    = preg_replace( '/.min.js/', '', $block_name );
            $block_js_deps = array( 'ghostkit', 'jquery' );

            switch ( $block_name ) {
                case 'grid':
                case 'grid-column':
                    $block_js_deps[] = 'jarallax';
                    $block_js_deps[] = 'jarallax-video';
                    break;
                case 'video':
                    $block_js_deps[] = 'jarallax-video';
                    break;
                case 'gist':
                    $block_js_deps[] = 'gist-simple';
                    break;
                case 'carousel':
                    $block_js_deps[] = 'swiper';
                    break;
                case 'countdown':
                    $block_js_deps[] = 'moment';
                    break;
            }

            wp_register_script(
                'ghostkit-block-' . $block_name,
                ghostkit()->plugin_url . 'assets/js/' . $file_name,
                array_unique( $block_js_deps ),
                '@@plugin_version',
                true
            );
        }
        foreach ( glob( ghostkit()->plugin_path . 'assets/css/block-*.min.css' ) as $template ) {
            $file_name      = basename( $template );
            $block_name     = preg_replace( '/^block-/', '', $file_name );
            $block_name     = preg_replace( '/.min.css$/', '', $block_name );
            $block_css_deps = array( 'ghostkit' );

            switch ( $block_name ) {
                case 'gist':
                    $block_css_deps[] = 'gist-simple';
                    break;
                case 'carousel':
                    $block_css_deps[] = 'swiper';
                    break;
            }

            wp_register_style(
                'ghostkit-block-' . $block_name,
                ghostkit()->plugin_url . 'assets/css/' . $file_name,
                array_unique( $block_css_deps ),
                '@@plugin_version'
            );
        }

        do_action( 'gkt_after_assets_register' );
    }

    /**
     * Enqueue styles in head.
     */
    public function wp_enqueue_head_assets() {
        self::enqueue_stored_assets( 'style' );
        self::enqueue_stored_assets( 'custom-css' );
        self::enqueue_stored_assets( 'script' );
    }

    /**
     * Enqueue scripts and styles in foot.
     */
    public function wp_enqueue_foot_assets() {
        self::enqueue_stored_assets( 'style' );
        self::enqueue_stored_assets( 'custom-css' );
        self::enqueue_stored_assets( 'script' );
    }

    /**
     * Enqueue blocks assets.
     *
     * @param array $blocks - blocks array.
     * @param array $location - blocks location [content,widget].
     */
    public function maybe_enqueue_blocks_assets( $blocks, $location ) {
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
    public function add_blocks_assets( $post_id ) {
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
