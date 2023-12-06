<?php
/**
 * Spacings Extension.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Extension_Position
 */
class GhostKit_Extension_Position {
	/**
	 * GhostKit_Extension_Position constructor.
	 */
	public function __construct() {
		GhostKit_Extensions::register(
			'position',
			array(
				'default_supports' => array(
					'position' => array(
						'position'     => true,
						'distance'     => true,
						'width'        => true,
						'height'       => true,
						'minMaxWidth'  => true,
						'minMaxHeight' => true,
						'zIndex'       => true,
					),
				),
			)
		);
	}
}

new GhostKit_Extension_Position();
