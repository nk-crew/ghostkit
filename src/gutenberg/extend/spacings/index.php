<?php
/**
 * Spacings Extension.
 *
 * @package @@plugin_name
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Extension_Spacings
 */
class GhostKit_Extension_Spacings {
    /**
     * GhostKit_Extension_Spacings constructor.
     */
    public function __construct() {
        GhostKit_Extensions::register(
            'spacings',
            array(
                'default_supports' => array(
                    'spacings' => array(
                        'padding' => true,
                        'margin'  => true,
                    ),
                ),
            )
        );
    }
}

new GhostKit_Extension_Spacings();
