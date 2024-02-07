<?php
/**
 * Attributes Extension.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Extension_Attributes
 */
class GhostKit_Extension_Attributes {
	/**
	 * GhostKit_Extension_Attributes constructor.
	 */
	public function __construct() {
		GhostKit_Extensions::register(
			'attributes',
			array(
				'default_supports' => array(
					'attributes' => true,
				),
			)
		);
	}
}

new GhostKit_Extension_Attributes();
