<?php
/**
 * Widgetized area block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Widgetized_Area_Block
 */
class GhostKit_Widgetized_Area_Block {
    /**
     * GhostKit_Widgetized_Area_Block constructor.
     */
    public function __construct() {
        add_action( 'init', array( $this, 'init' ) );
    }

    /**
     * Init.
     */
    public function init() {
        if ( function_exists( 'register_block_type' ) ) {
            register_block_type(
                'ghostkit/widgetized-area',
                array(
                    'render_callback' => array( $this, 'block_render' ),
                )
            );
        }
    }

    /**
     * Register gutenberg block output
     *
     * @param array $attributes - block attributes.
     *
     * @return string
     */
    public function block_render( $attributes ) {
        ob_start();

        $class  = isset( $attributes['className'] ) ? $attributes['className'] : '';
        $class .= ' ghostkit-widgetized-area';

        if ( $attributes['id'] ) {
            echo '<div class="' . esc_attr( $class ) . '">';
                dynamic_sidebar( $attributes['id'] );
            echo '</div>';
        }

        return ob_get_clean();
    }
}
new GhostKit_Widgetized_Area_Block();
