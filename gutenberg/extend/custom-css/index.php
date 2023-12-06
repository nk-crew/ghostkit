<?php
/**
 * Custom CSS Extension.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Extension_Custom_CSS
 */
class GhostKit_Extension_Custom_CSS {
	/**
	 * GhostKit_Extension_Custom_CSS constructor.
	 */
	public function __construct() {
		GhostKit_Extensions::register(
			'customCSS',
			array(
				'default_supports' => array(
					'customCSS' => array(
						'opacity'    => true,
						'overflow'   => true,
						'cursor'     => true,
						'userSelect' => true,
						'clipPath'   => true,
						'custom'     => true,

						// Pro.
						'transition' => true,
					),
				),
			)
		);
	}
}

new GhostKit_Extension_Custom_CSS();
