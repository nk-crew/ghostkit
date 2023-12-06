<?php
/**
 * Display Conditions Extension.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Extension_Display
 */
class GhostKit_Extension_Display {
	/**
	 * GhostKit_Extension_Display constructor.
	 */
	public function __construct() {
		GhostKit_Extensions::register(
			'display',
			array(
				'default_supports' => array(
					'display' => array(
						'screenSize' => true,
					),
				),
			)
		);
	}
}

new GhostKit_Extension_Display();
