<?php
/**
 * Get block custom CSS.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Block_Custom_CSS
 */
class GhostKit_Block_Custom_CSS {
    /**
     * Get styles from block attribute.
     *
     * @param array $block_attrs - block attrs.
     *
     * @return string - ready to use styles string.
     */
    public static function get( $block_attrs ) {
        $result_css = '';

        if (
            isset( $block_attrs ) &&
            isset( $block_attrs['ghostkitClassname'] ) &&
            $block_attrs['ghostkitClassname'] &&
            isset( $block_attrs['ghostkitCustomCSS'] ) &&
            $block_attrs['ghostkitCustomCSS']
        ) {
            $result_css .= ' ' . str_replace( 'selector', '.' . $block_attrs['ghostkitClassname'], self::utf8_decode( $block_attrs['ghostkitCustomCSS'] ) );
        }

        return $result_css;
    }

    /**
     * Encode utf8 decode string.
     *
     * @param string $str - Decode string.
     * @return string
     */
    public static function utf8_decode( $str ) {
        $str = preg_replace( '/%u([0-9a-f]{3,4})/i', '&#x\\1;', urldecode( $str ) );
        return html_entity_decode( $str, ENT_COMPAT, 'UTF-8' );
    }
}
