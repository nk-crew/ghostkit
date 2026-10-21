<?php
/**
 * Twitter block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Twitter_Block
 */
class GhostKit_Twitter_Block {
	/**
	 * GhostKit_Twitter_Block constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	/**
	 * Init.
	 */
	public function init() {
		register_block_type_from_metadata(
			__DIR__,
			array(
				'render_callback' => array( $this, 'block_render' ),
			)
		);
	}

	/**
	 * The Twitter API this block used was retired and returns no data,
	 * so the block renders nothing. It stays registered to keep saved content valid.
	 *
	 * @return string
	 */
	public function block_render() {
		return '';
	}
}
new GhostKit_Twitter_Block();
