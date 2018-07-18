<?php
/**
 * Plugin Name:  GhostKit
 * Description:  Extendable Gutenberg blocks
 * Version:      1.0.0
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

        // additional blocks php.
        require_once( $this->plugin_path . 'blocks/index.php' );

        // rest.
        require_once( $this->plugin_path . 'classes/class-rest.php' );
    }


    /**
     * Init hooks
     */
    public function init_hooks() {
        add_action( 'admin_init', array( $this, 'admin_init' ) );

        add_action( 'save_post', array( $this, 'parse_styles_from_blocks' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'add_styles_from_blocks' ), 100 );

        // include blocks.
        // work only if Gutenberg available.
        if ( function_exists( 'register_block_type' ) ) {
            add_action( 'init', array( $this, 'register_scripts' ) );

            // we need to enqueue the main script earlier to let 3rd-party plugins add custom styles support.
            add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ), 9 );
            add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_block_assets' ) );
        }
    }

    /**
     * Register scripts.
     */
    public function register_scripts() {
        // FontAwesome.
        if ( apply_filters( 'gkt_enqueue_plugin_font_awesome', true ) ) {
            wp_register_script( 'font-awesome-v4-shims', plugins_url( 'assets/vendor/font-awesome/fa-v4-shims.min.js', __FILE__ ), array(), '5.0.13' );
            wp_register_script( 'font-awesome', plugins_url( 'assets/vendor/font-awesome/fontawesome-all.min.js', __FILE__ ), array( 'font-awesome-v4-shims' ), '5.0.13' );
        }

        // helper script.
        wp_register_script(
            'ghostkit-helper',
            plugins_url( 'assets/js/helper.min.js', __FILE__ ),
            array(),
            filemtime( plugin_dir_path( __FILE__ ) . 'assets/js/helper.min.js' )
        );
        $default_variant = array(
            'default' => array(
                'title' => esc_html__( 'Default', '@@text_domain' ),
            ),
        );
        wp_localize_script( 'ghostkit-helper', 'ghostkitVariables', array(
            // TODO: Move this to plugin options (part 1).
            'media_sizes' => array(
                'sm' => '(max-width: 576px)',
                'md' => '(max-width: 768px)',
                'lg' => '(max-width: 992px)',
                'xl' => '(max-width: 1200px)',
            ),
            'variants'   => array(
                'alert'       => array_merge( $default_variant, apply_filters( 'gkt_alert_variants', array() ) ),
                'button'      => array_merge( $default_variant, apply_filters( 'gkt_button_variants', array() ) ),
                'counter_box' => array_merge( $default_variant, apply_filters( 'gkt_counter_box_variants', array() ) ),
                'tabs'        => array_merge( $default_variant, apply_filters( 'gkt_tabs_variants', array() ) ),
                'accordion'   => array_merge( $default_variant, apply_filters( 'gkt_accordion_variants', array() ) ),
                'grid'        => array_merge( $default_variant, apply_filters( 'gkt_grid_variants', array() ) ),
                'icon_box'    => array_merge( $default_variant, apply_filters( 'gkt_icon_box_variants', array() ) ),
                'progress'    => array_merge( $default_variant, apply_filters( 'gkt_progress_variants', array() ) ),
            ),
        ) );
    }

    /**
     * Enqueue editor assets
     */
    public function enqueue_block_editor_assets() {
        // FontAwesome.
        if ( apply_filters( 'gkt_enqueue_plugin_font_awesome', true ) ) {
            wp_enqueue_script( 'font-awesome' );
        }

        // GhostKit.
        wp_enqueue_style(
            'ghostkit-editor',
            plugins_url( 'assets/admin/css/style.min.css', __FILE__ ),
            array( 'wp-blocks' ),
            filemtime( plugin_dir_path( __FILE__ ) . 'assets/admin/css/style.min.css' )
        );
        wp_enqueue_script(
            'ghostkit-editor',
            plugins_url( 'blocks/index.min.js', __FILE__ ),
            array( 'ghostkit-helper', 'wp-editor', 'wp-i18n', 'wp-element', 'underscore', 'wp-components' ),
            filemtime( plugin_dir_path( __FILE__ ) . 'blocks/index.min.js' )
        );
    }

    /**
     * Enqueue editor frontend assets
     */
    public function enqueue_block_assets() {
        // FontAwesome.
        if ( apply_filters( 'gkt_enqueue_plugin_font_awesome', true ) ) {
            wp_enqueue_script( 'font-awesome' );
        }

        // GhostKit.
        wp_enqueue_style(
            'ghostkit',
            plugins_url( 'blocks/style.min.css', __FILE__ ),
            array( 'wp-blocks' ),
            filemtime( plugin_dir_path( __FILE__ ) . 'blocks/style.min.css' )
        );
        wp_enqueue_script(
            'ghostkit',
            plugins_url( 'assets/js/script.min.js', __FILE__ ),
            array( 'ghostkit-helper', 'jquery', 'wp-blocks' ),
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
