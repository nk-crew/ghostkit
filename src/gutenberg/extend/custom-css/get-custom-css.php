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
            $result_css .= ' ' . str_replace( 'selector', '.' . $block_attrs['ghostkitClassname'], $block_attrs['ghostkitCustomCSS'] );
        }

        return $result_css;
    }
}
