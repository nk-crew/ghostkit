<?php
/**
 * Deprecated Extensions.
 *
 * @since v3.1.0
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Deprecated_Extensions
 */
class GhostKit_Deprecated_Extensions {
	/**
	 * GhostKit_Deprecated_Extensions constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_attributes' ), 20 );
	}

	/**
	 * Register deprecated attributes in all blocks.
	 */
	public function register_attributes() {
		$block_registry         = WP_Block_Type_Registry::get_instance();
		$registered_block_types = $block_registry->get_all_registered();

		foreach ( $registered_block_types as $block_type ) {
			if ( ! ( $block_type instanceof WP_Block_Type ) ) {
				continue;
			}
			if ( ! $block_type->attributes ) {
				$block_type->attributes = array();
			}

			$block_type->attributes['ghostkitId'] = array(
				'type' => 'string',
			);

			$block_type->attributes['ghostkitClassname'] = array(
				'type' => 'string',
			);

			$block_type->attributes['ghostkitStyles'] = array(
				'type' => 'object',
			);

			$block_type->attributes['ghostkitSR'] = array(
				'type' => 'string',
			);

			$block_type->attributes['ghostkitCustomCSS'] = array(
				'type' => 'string',
			);

			$block_type->attributes['ghostkitPosition'] = array(
				'type' => 'object',
			);

			$block_type->attributes['ghostkitSpacings'] = array(
				'type' => 'object',
			);

			$block_type->attributes['ghostkitFrame'] = array(
				'type' => 'object',
			);
		}
	}
}

new GhostKit_Deprecated_Extensions();


require_once ghostkit()->plugin_path . 'gutenberg/extend/deprecated/styles/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/extend/deprecated/custom-css/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/extend/deprecated/scroll-reveal/index.php';
