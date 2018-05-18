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
    }


    /**
     * Init hooks
     */
    public function init_hooks() {
        add_action( 'admin_init', array( $this, 'admin_init' ) );

        add_action( 'save_post', array( $this, 'parse_styles_from_blocks' ) );
        add_action( 'wp_head', array( $this, 'add_styles_from_blocks' ), 100 );

        // include blocks.
        // work only if Gutenberg available.
        if ( function_exists( 'register_block_type' ) ) {
            add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
            add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_block_assets' ) );
        }
    }

    /**
     * Enqueue editor assets
     */
    public function enqueue_block_editor_assets() {
        // FontAwesome.
        wp_enqueue_script( 'font-awesome-v4-shims', plugins_url( 'assets/vendor/font-awesome/svg-with-js/js/fa-v4-shims.min.js', __FILE__ ), array(), '5.0.10' );
        wp_enqueue_script( 'font-awesome', plugins_url( 'assets/vendor/font-awesome/svg-with-js/js/fontawesome-all.min.js', __FILE__ ), array( 'font-awesome-v4-shims' ), '5.0.10' );

        // GhostKit.
        wp_enqueue_script(
            'ghostkit-editor',
            plugins_url( 'blocks/index.min.js', __FILE__ ),
            array( 'wp-editor', 'wp-i18n', 'wp-element', 'underscore', 'wp-components' ),
            filemtime( plugin_dir_path( __FILE__ ) . 'blocks/index.min.js' )
        );

        // GhostKit.
        wp_enqueue_style(
            'ghostkit-editor',
            plugins_url( 'assets/admin/css/style.min.css', __FILE__ ),
            array( 'wp-blocks' ),
            filemtime( plugin_dir_path( __FILE__ ) . 'assets/admin/css/style.min.css' )
        );
    }

    /**
     * Enqueue editor frontend assets
     */
    public function enqueue_block_assets() {
        // FontAwesome.
        wp_enqueue_script( 'font-awesome-v4-shims', plugins_url( 'assets/vendor/font-awesome/svg-with-js/js/fa-v4-shims.min.js', __FILE__ ), array(), '5.0.10' );
        wp_enqueue_script( 'font-awesome', plugins_url( 'assets/vendor/font-awesome/svg-with-js/js/fontawesome-all.min.js', __FILE__ ), array( 'font-awesome-v4-shims' ), '5.0.10' );

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
            array( 'jquery', 'wp-blocks' ),
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

        $css = '';

        // TODO: add fallback for this method (maybe JS will be enough).
        $dom = new DOMDocument();
        $dom->loadHTML( $post->post_content );
        foreach ( $dom->getElementsByTagName( '*' ) as $node ) {
            $styles = $node->getAttribute( 'data-ghostkit-styles' );
            if ( $styles ) {
                $css .= ' ' . $styles;
            }
        }

        if ( empty( $css ) || ! $css ) {
            delete_post_meta( $post_id, '_ghostkit_blocks_custom_css' );
        } else {
            update_post_meta( $post_id, '_ghostkit_blocks_custom_css', $css );
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

            if ( ! empty( $css ) ) {
                echo "<style type=\"text/css\" id=\"ghostkit-blocks-custom-css\">\n";
                echo wp_kses( wp_unslash( $css ), array( '\'', '\"' ) );
                echo "\n</style>\n";
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
