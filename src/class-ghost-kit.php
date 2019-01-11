<?php
/**
 * Plugin Name:  Ghost Kit
 * Description:  Blocks collection and extensions for Gutenberg
 * Version:      @@plugin_version
 * Author:       nK
 * Author URI:   https://nkdev.info
 * License:      GPLv2 or later
 * License URI:  https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:  ghostkit
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * GhostKit Class
 */
class GhostKit {

    /**
     * The single class instance.
     *
     * @var $_instance
     */
    private static $_instance = null;

    /**
     * Path to the plugin directory
     *
     * @var $plugin_path
     */
    public $plugin_path;

    /**
     * URL to the plugin directory
     *
     * @var $plugin_url
     */
    public $plugin_url;

    /**
     * Plugin name
     *
     * @var $plugin_name
     */
    public $plugin_name;

    /**
     * Plugin version
     *
     * @var $plugin_version
     */
    public $plugin_version;

    /**
     * Plugin slug
     *
     * @var $plugin_slug
     */
    public $plugin_slug;

    /**
     * Plugin name sanitized
     *
     * @var $plugin_name_sanitized
     */
    public $plugin_name_sanitized;

    /**
     * GhostKit constructor.
     */
    public function __construct() {
        /* We do nothing here! */
    }

    /**
     * Main Instance
     * Ensures only one instance of this class exists in memory at any one time.
     */
    public static function instance() {
        if ( is_null( self::$_instance ) ) {
            self::$_instance = new self();
            self::$_instance->init_options();
            self::$_instance->init_hooks();
        }
        return self::$_instance;
    }

    /**
     * Init options
     */
    public function init_options() {
        $this->plugin_path = plugin_dir_path( __FILE__ );
        $this->plugin_url = plugin_dir_url( __FILE__ );

        // load textdomain.
        load_plugin_textdomain( '@@text_domain', false, basename( dirname( __FILE__ ) ) . '/languages' );

        // settings.
        require_once( $this->plugin_path . 'settings/index.php' );

        // additional blocks php.
        require_once( $this->plugin_path . 'blocks/index.php' );

        // rest.
        require_once( $this->plugin_path . 'classes/class-rest.php' );

        // reusable widget.
        require_once( $this->plugin_path . 'classes/class-reusable-widget.php' );

        // icons.
        require_once( $this->plugin_path . 'classes/class-icons.php' );
    }


    /**
     * Init hooks
     */
    public function init_hooks() {
        add_action( 'admin_init', array( $this, 'admin_init' ) );

        add_action( 'init', array( $this, 'add_custom_fields_support' ), 100 );

        add_action( 'save_post', array( $this, 'parse_styles_from_blocks' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'add_styles_from_blocks' ), 100 );

        // include blocks.
        // work only if Gutenberg available.
        if ( function_exists( 'register_block_type' ) ) {
            add_action( 'init', array( $this, 'register_scripts' ) );

            // add Ghost Kit blocks category.
            add_filter( 'block_categories', array( $this, 'block_categories' ), 9 );

            // we need to enqueue the main script earlier to let 3rd-party plugins add custom styles support.
            add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ), 9 );
            add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_block_assets' ) );
        }
    }

    /**
     * Register Ghost Kit blocks category
     *
     * @param array $categories - available categories.
     * @return array
     */
    public function block_categories( $categories ) {
        return array_merge(
            array(
                array(
                    'slug'  => 'ghostkit',
                    'title' => __( 'Ghost Kit', '@@text_domain' ),
                ),
            ),
            $categories
        );
    }

    /**
     * Register scripts.
     */
    public function register_scripts() {
        // VideoWorker.
        if ( apply_filters( 'gkt_enqueue_plugin_video_worker', true ) ) {
            wp_register_script( 'video-worker', plugins_url( 'assets/vendor/video-worker/dist/video-worker.min.js', __FILE__ ), array(), '1.1.6' );
        }

        // Object Fit Images.
        if ( apply_filters( 'gkt_enqueue_plugin_object_fit_images', true ) ) {
            wp_register_script( 'object-fit-images', plugins_url( 'assets/vendor/object-fit-images/ofi.min.js', __FILE__ ), array(), '3.2.4', true );
        }

        // Swiper.
        if ( apply_filters( 'gkt_enqueue_plugin_swiper', true ) ) {
            wp_register_style( 'swiper', plugins_url( 'assets/vendor/swiper/css/swiper.min.css', __FILE__ ), array(), '4.4.6' );
            wp_register_script( 'swiper', plugins_url( 'assets/vendor/swiper/js/swiper.min.js', __FILE__ ), array(), '4.4.6', true );
        }

        // GistEmbed.
        if ( apply_filters( 'gkt_enqueue_plugin_gist_embed', true ) ) {
            wp_register_script( 'gist-embed', plugins_url( 'assets/vendor/gist-embed/gist-embed.min.js', __FILE__ ), array( 'jquery' ), '2.7.1', true );
        }

        // ScrollReveal.
        if ( apply_filters( 'gkt_enqueue_plugin_scrollreveal', true ) ) {
            wp_register_script( 'scrollreveal', plugins_url( 'assets/vendor/scrollreveal/scrollreveal.min.js', __FILE__ ), array(), '4.0.5', true );
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
            plugins_url( 'assets/js/helper.min.js', __FILE__ ),
            array( 'jquery' ),
            filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/helper.min.js' )
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

        wp_localize_script( 'ghostkit-helper', 'ghostkitVariables', array(
            'settings'          => get_option( 'ghostkit_settings', array() ),

            'disabledBlocks'    => get_option( 'ghostkit_disabled_blocks', array() ),

            // TODO: Move this to plugin options (part 1).
            'media_sizes'       => array(
                'sm' => 576,
                'md' => 768,
                'lg' => 992,
                'xl' => 1200,
            ),
            'googleMapsAPIKey'  => get_option( 'ghostkit_google_maps_api_key' ),
            'googleMapsAPIUrl'  => 'https://maps.googleapis' . $gmaps_suffix . '/maps/api/js?v=3.exp&language=' . esc_attr( $gmaps_locale ),
            'googleMapsLibrary' => apply_filters( 'gkt_enqueue_plugin_gmaps', true ) ? array(
                'url' => plugins_url( 'assets/vendor/gmaps/gmaps.min.js', __FILE__ ) . '?ver=0.4.25',
            ) : false,
            'sidebars'          => $sidebars,
            'icons'             => is_admin() ? apply_filters( 'gkt_icons_list', array(
                /**
                 * Example:
                   array(
                       'font-awesome' => array(
                           'name' => 'FontAwesome',
                           'icons' => array(
                               array(
                                    'class': 'fab fa-google',
                                    'keys': 'google',
                                    // optional preview for editor.
                                    'preview': `<span class="fab fa-google"></span>`,
                               ),
                               ...
                           ),
                       ),
                   )
                 */
            ) ) : array(),
            'variants'          => array(
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
            'admin_url'         => admin_url(),
        ) );
    }

    /**
     * Enqueue editor assets
     */
    public function enqueue_block_editor_assets() {
        $css_deps = array();
        $js_deps = array( 'ghostkit-helper', 'wp-editor', 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-edit-post', 'wp-compose', 'underscore', 'wp-components', 'jquery' );

        // VideoWorker.
        if ( apply_filters( 'gkt_enqueue_plugin_video_worker', true ) ) {
            $js_deps[] = 'video-worker';
        }

        // GistEmbed.
        if ( apply_filters( 'gkt_enqueue_plugin_gist_embed', true ) ) {
            $js_deps[] = 'gist-embed';
        }

        // Ghost Kit.
        wp_enqueue_style(
            'ghostkit-editor',
            plugins_url( 'assets/admin/css/style.min.css', __FILE__ ),
            $css_deps,
            filemtime( plugin_dir_path( __FILE__ ) . 'assets/admin/css/style.min.css' )
        );
        wp_enqueue_script(
            'ghostkit-editor',
            plugins_url( 'blocks/index.min.js', __FILE__ ),
            $js_deps,
            filemtime( plugin_dir_path( __FILE__ ) . 'blocks/index.min.js' )
        );
    }

    /**
     * Enqueue editor frontend assets
     */
    public function enqueue_block_assets() {
        $css_deps = array();
        $js_deps = array( 'jquery', 'ghostkit-helper' );

        // VideoWorker.
        if ( apply_filters( 'gkt_enqueue_plugin_video_worker', true ) ) {
            $js_deps[] = 'video-worker';
        }

        // Object Fit Images.
        if ( apply_filters( 'gkt_enqueue_plugin_object_fit_images', true ) ) {
            $js_deps[] = 'object-fit-images';
        }

        // Swiper.
        if ( apply_filters( 'gkt_enqueue_plugin_swiper', true ) ) {
            $css_deps[] = 'swiper';
            $js_deps[] = 'swiper';
        }

        // GistEmbed.
        if ( apply_filters( 'gkt_enqueue_plugin_gist_embed', true ) ) {
            $js_deps[] = 'gist-embed';
        }

        // ScrollReveal.
        if ( apply_filters( 'gkt_enqueue_plugin_scrollreveal', true ) ) {
            $js_deps[] = 'scrollreveal';
        }

        // Ghost Kit.
        wp_enqueue_style(
            'ghostkit',
            plugins_url( 'blocks/style.min.css', __FILE__ ),
            $css_deps,
            filemtime( plugin_dir_path( __FILE__ ) . 'blocks/style.min.css' )
        );
        wp_enqueue_script(
            'ghostkit',
            plugins_url( 'assets/js/script.min.js', __FILE__ ),
            $js_deps,
            filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/script.min.js' )
        );
    }

    /**
     * Init variables
     */
    public function admin_init() {
        // get current plugin data.
        $data = get_plugin_data( __FILE__ );
        $this->plugin_name = $data['Name'];
        $this->plugin_version = $data['Version'];
        $this->plugin_slug = plugin_basename( __FILE__, '.php' );
        $this->plugin_name_sanitized = basename( __FILE__, '.php' );
    }

    /**
     * Add support for 'custom-fields' for all post types.
     * Required by Customizer and Custom CSS blocks.
     */
    public function add_custom_fields_support() {
        $available_post_types = get_post_types( array(
            'show_ui' => true,
        ), 'object' );

        foreach ( $available_post_types as $post_type ) {
            if ( 'attachment' !== $post_type->name ) {
                add_post_type_support( $post_type->name, 'custom-fields' );
            }
        }
    }

    /**
     * Parse styles from blocks and save it to the post meta.
     *
     * @param int $post_id - current post id.
     */
    public function parse_styles_from_blocks( $post_id ) {
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }
        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }

        $post = get_post( $post_id );

        if ( ! $post->post_content ) {
            return;
        }

        if ( class_exists( 'DOMDocument' ) ) {
            $css = '';
            $dom = new DOMDocument();
            @$dom->loadHTML( $post->post_content );
            foreach ( $dom->getElementsByTagName( '*' ) as $node ) {
                $styles = $node->getAttribute( 'data-ghostkit-styles' );
                if ( $styles ) {
                    $css .= ' ' . $styles;
                }
            }

            if ( empty( $css ) || ! $css ) {
                delete_post_meta( $post_id, '_ghostkit_blocks_custom_css' );
            } else {
                // TODO: Move this to plugin options (part 2).
                $vars = array(
                    'media_sm' => '(max-width: 576px)',
                    'media_md' => '(max-width: 768px)',
                    'media_lg' => '(max-width: 992px)',
                    'media_xl' => '(max-width: 1200px)',
                );

                foreach ( $vars as $k => $var ) {
                    $css = preg_replace( "/#{ghostkitvar:$k}/", $var, $css );
                }

                update_post_meta( $post_id, '_ghostkit_blocks_custom_css', $css );
            }
        }
    }

    /**
     * Add styles from blocks to the head section.
     *
     * @param int $post_id - current post id.
     */
    public function add_styles_from_blocks( $post_id ) {
        if ( ! is_singular() ) {
            return;
        }
        if ( ! $post_id ) {
            $post_id = get_the_ID();
        }

        if ( $post_id ) {
            $css = get_post_meta( $post_id, '_ghostkit_blocks_custom_css', true );
            $custom_css = get_post_meta( $post_id, 'ghostkit_custom_css', true );

            if ( ! empty( $css ) ) {
                $custom_css_handle = 'ghostkit-blocks-custom-css';
                $css = wp_kses( $css, array( '\'', '\"' ) );
                $css = str_replace( '&gt;', '>', $css );

                wp_register_style( $custom_css_handle, false );
                wp_enqueue_style( $custom_css_handle );
                wp_add_inline_style( $custom_css_handle, $css );
            }
            if ( ! empty( $custom_css ) ) {
                $custom_css_handle = 'ghostkit-custom-css';
                $css = wp_kses( $custom_css, array( '\'', '\"' ) );
                $css = str_replace( '&gt;', '>', $css );

                wp_register_style( $custom_css_handle, false );
                wp_enqueue_style( $custom_css_handle );
                wp_add_inline_style( $custom_css_handle, $css );
            }
        }
    }
}

/**
 * Function works with the GhostKit class instance
 *
 * @return object GhostKit
 */
function ghostkit() {
    return GhostKit::instance();
}
add_action( 'plugins_loaded', 'ghostkit' );
