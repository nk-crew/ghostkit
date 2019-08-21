<?php
/**
 * Custom code plugin.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Custom_Code_Plugin
 */
class GhostKit_Custom_Code_Plugin {
    /**
     * GhostKit_Custom_Code_Plugin constructor.
     */
    public function __construct() {
        add_action( 'init', array( $this, 'register_meta' ) );
    }

    /**
     * Register meta.
     */
    public function register_meta() {
        register_meta(
            'post', 'ghostkit_custom_css', array(
                'show_in_rest' => true,
                'single'       => true,
                'type'         => 'string',
            )
        );
        register_meta(
            'post', 'ghostkit_custom_js_head', array(
                'show_in_rest' => true,
                'single'       => true,
                'type'         => 'string',
            )
        );
        register_meta(
            'post', 'ghostkit_custom_js_foot', array(
                'show_in_rest' => true,
                'single'       => true,
                'type'         => 'string',
            )
        );
    }
}
new GhostKit_Custom_Code_Plugin();
