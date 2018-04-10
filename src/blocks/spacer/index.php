<?php
/**
 * GhostKit Spacer Block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Spacer_Block
 */
class GhostKit_Spacer_Block {
    /**
     * GhostKit_Spacer_Block constructor.
     */
    public function __construct() {
        // work only if Gutenberg available.
        if ( function_exists( 'register_block_type' ) ) {
            add_action( 'init', array( $this, 'register_block' ) );
        }
    }

    /**
     * Register block.
     */
    public function register_block() {
        // enqueue block js.
        wp_register_script(
            'ghostkit-spacer-editor',
            plugins_url( 'block.min.js', __FILE__ ),
            array( 'wp-blocks', 'wp-i18n', 'wp-element', 'underscore', 'wp-components' ),
            filemtime( plugin_dir_path( __FILE__ ) . 'block.min.js' )
        );

        // enqueue block css.
        wp_register_style(
            'ghostkit-spacer-editor',
            plugins_url( 'style.min.css', __FILE__ ),
            array( 'wp-blocks' ),
            filemtime( plugin_dir_path( __FILE__ ) . 'style.min.css' )
        );

        // register block.
        register_block_type( 'ghostkit/spacer', array(
            'editor_script'   => 'ghostkit-spacer-editor',
            'editor_style'    => 'ghostkit-spacer-editor',
        ) );
    }
}

new GhostKit_Spacer_Block();
