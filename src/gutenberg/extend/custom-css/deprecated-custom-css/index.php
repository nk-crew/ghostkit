<?php
/**
 * Custom CSS Extension.
 *
 * @package @@plugin_name
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Deprecated_Extension_Custom_CSS
 */
class GhostKit_Deprecated_Extension_Custom_CSS {
    /**
     * GhostKit_Deprecated_Extension_Custom_CSS constructor.
     */
    public function __construct() {
        add_filter( 'gkt_block_custom_styles', array( $this, 'block_custom_styles' ), 10, 2 );
    }

    /**
     * Get styles from block attribute.
     *
     * @param string $blocks_css - block css.
     * @param array  $block - block data.
     *
     * @return string - ready to use styles string.
     */
    public function block_custom_styles( $blocks_css, $block ) {
        $attributes = $block['attrs'] ?? array();

        if ( ! empty( $attributes['ghostkitClassname'] ) && ! empty( $attributes['ghostkitCustomCSS'] ) ) {
            if ( ! empty( $blocks_css ) ) {
                $blocks_css .= ' ';
            }

            $blocks_css .= str_replace( 'selector', '.' . $attributes['ghostkitClassname'], ghostkit_decode( $attributes['ghostkitCustomCSS'] ) );
        }

        return $blocks_css;
    }
}

new GhostKit_Deprecated_Extension_Custom_CSS();
