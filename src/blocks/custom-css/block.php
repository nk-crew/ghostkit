<?php
/**
 * Custom css block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Custom_CSS_Block
 */
class GhostKit_Custom_CSS_Block {
    /**
     * GhostKit_Custom_CSS_Block constructor.
     */
    public function __construct() {
        add_action( 'init', array( $this, 'register_meta' ) );
    }

    /**
     * Register meta.
     */
    public function register_meta() {
        register_meta( 'post', 'ghostkit_custom_css', array(
            'show_in_rest' => true,
            'single'       => true,
            'type'         => 'string',
        ) );
    }
}
new GhostKit_Custom_CSS_Block();
