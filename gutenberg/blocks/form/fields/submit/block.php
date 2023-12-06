<?php
/**
 * Form Field Submit block.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Form_Field_Submit_Block
 */
class GhostKit_Form_Field_Submit_Block {
	/**
	 * GhostKit_Form_Field_Submit_Block constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	/**
	 * Init.
	 */
	public function init() {
		register_block_type_from_metadata( dirname( __FILE__ ) );
	}
}
new GhostKit_Form_Field_Submit_Block();
