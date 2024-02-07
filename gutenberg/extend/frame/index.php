<?php
/**
 * Frame Extension.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Extension_Frame
 */
class GhostKit_Extension_Frame {
	/**
	 * GhostKit_Extension_Frame constructor.
	 */
	public function __construct() {
		GhostKit_Extensions::register(
			'frame',
			array(
				'default_supports' => array(
					'frame' => array(
						'border'       => true,
						'borderRadius' => true,
						'shadow'       => true,
					),
				),
			)
		);
	}
}

new GhostKit_Extension_Frame();
