<?php
/**
 * Icon block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Icon_Block
 */
class GhostKit_Icon_Block {
	/**
	 * GhostKit_Icon_Block constructor.
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
	 * Register gutenberg block output.
	 * Fixes the problem when we add `aria-label` to the link,
	 * but Gutenberg renders it as `arialabel` for some reason.
	 *
	 * @param array  $attributes - block attributes.
	 * @param string $content - block render.
	 *
	 * @return string
	 */
	public function block_render( $attributes, $content ) {
		$processor = new WP_HTML_Tag_Processor( $content );
		$processor->next_tag( 'a' );

		$aria_label = $processor->get_attribute( 'arialabel' );

		if ( null !== $aria_label ) {
			$processor->set_attribute( 'aria-label', $aria_label );
			$processor->remove_attribute( 'arialabel' );

			return $processor->get_updated_html();
		}

		return $content;
	}
}
new GhostKit_Icon_Block();
