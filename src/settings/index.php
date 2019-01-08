<?php
/**
 * Additional PHP for blocks.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Ghostkit_Settings
 */
class Ghostkit_Settings {
    /**
     * Slug of the plugin screen.
     *
     * @var $plugin_screen_hook_suffix
     */
    protected $plugin_screen_hook_suffix = null;

    /**
     * Ghostkit_Settings constructor.
     */
    public function __construct() {
        // work only if Gutenberg available.
        if ( ! function_exists( 'register_block_type' ) ) {
            return;
        }

        // Load admin style sheet and JavaScript.
        add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );

        // Add the options page and menu item.
        add_action( 'admin_menu', array( $this, 'admin_menu' ) );
    }

    /**
     * Register and enqueue admin-specific style sheet.
     */
    public function admin_enqueue_scripts() {
        global $post;

        $screen = get_current_screen();

        wp_enqueue_style(
            'ghostkit-settings',
            ghostkit()->plugin_url . 'assets/admin/css/settings.min.css',
            array(),
            filemtime( ghostkit()->plugin_path . 'assets/admin/css/settings.min.css' )
        );

        if ( 'toplevel_page_ghostkit' !== $screen->id ) {
            return;
        }

        $block_categories = array();
        if ( function_exists( 'get_block_categories' ) ) {
            $block_categories = get_block_categories( get_post() );
        } else if ( function_exists( 'gutenberg_get_block_categories' ) ) {
            $block_categories = gutenberg_get_block_categories( get_post() );
        }

        // enqueue blocks library.
        wp_enqueue_script( 'wp-block-library' );

        wp_add_inline_script(
            'wp-blocks',
            sprintf( 'wp.blocks.setCategories( %s );', wp_json_encode( $block_categories ) ),
            'after'
        );

        // Ghost Kit Settings.
        wp_enqueue_script(
            'ghostkit-settings',
            ghostkit()->plugin_url . 'settings/index.min.js',
            array( 'ghostkit-helper', 'wp-data', 'wp-element', 'wp-components', 'wp-api', 'wp-api-request', 'wp-i18n' ),
            filemtime( ghostkit()->plugin_path . 'settings/index.min.js' )
        );

        wp_localize_script( 'ghostkit-settings', 'ghostkitSettingsData', array(
            'api_nonce' => wp_create_nonce( 'wp_rest' ),
            'api_url' => rest_url( 'ghostkit/v1/' ),
        ) );

        do_action( 'enqueue_block_editor_assets' );
    }

    /**
     * Add admin menu.
     */
    public function admin_menu() {
        add_menu_page(
            esc_html__( 'Ghost Kit', '@@text_domain' ),
            esc_html__( 'Ghost Kit', '@@text_domain' ),
            'manage_options',
            'ghostkit',
            array( $this, 'display_admin_page' ),
            'dashicons-admin-ghostkit',
            105
        );
    }

    /**
     * Render the admin page.
     */
    public function display_admin_page() {
        ?>
        <div class="ghostkit-admin-page"></div>
        <?php
    }
}

new Ghostkit_Settings();
