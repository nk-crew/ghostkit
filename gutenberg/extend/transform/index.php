<?php
/**
 * Transform Extension.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Extension_Transform
 */
class GhostKit_Extension_Transform {
	/**
	 * GhostKit_Extension_Transform constructor.
	 */
	public function __construct() {
		GhostKit_Extensions::register(
			'transform',
			array(
				'default_supports' => array(
					'transform' => array(
						'translate'   => true,
						'scale'       => true,
						'rotate'      => true,
						'skew'        => true,
						'perspective' => true,
						'origin'      => true,
					),
				),
			)
		);
	}
}

new GhostKit_Extension_Transform();
