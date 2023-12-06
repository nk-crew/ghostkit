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
	 * Is in rendering loop.
	 * We have to check if sidebar is rendering and prevent render another sidebar.
	 * In short, of you insert the dynamic sidebar inside the same sidebar, there will be an infinite loop and PHP fatal error.
	 *
	 * @var boolean
	 */
	private $rendering;

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
		register_block_type_from_metadata(
			dirname( __FILE__ ),
			array(
				'render_callback' => array( $this, 'block_render' ),
			)
		);
	}

	/**
	 * Register gutenberg block output
	 *
	 * @param array $attributes - block attributes.
	 *
	 * @return string
	 */
	public function block_render( $attributes ) {
		if ( $this->rendering ) {
			return '';
		}

		$this->rendering = true;

		ob_start();

		$class  = isset( $attributes['className'] ) ? $attributes['className'] : '';
		$class .= ' ghostkit-widgetized-area';

		if ( $attributes['id'] ) {
			echo '<div class="' . esc_attr( $class ) . '">';
				dynamic_sidebar( $attributes['id'] );
			echo '</div>';
		}

		$this->rendering = false;

		return ob_get_clean();
	}
}
new GhostKit_Widgetized_Area_Block();
