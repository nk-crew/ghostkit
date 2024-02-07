<?php
/**
 * Deprecated Custom CSS Extension.
 *
 * @since v3.1.0
 *
 * @package ghostkit
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

		$id = $attributes['ghostkit']['id'] ?? $attributes['ghostkitId'] ?? '';

		if ( $id && ! empty( $attributes['ghostkitCustomCSS'] ) ) {
			if ( ! empty( $blocks_css ) ) {
				$blocks_css .= ' ';
			}

			$blocks_css .= str_replace( 'selector', '.ghostkit-custom-' . $id, ghostkit_decode( $attributes['ghostkitCustomCSS'] ) );
		}

		return $blocks_css;
	}
}

new GhostKit_Deprecated_Extension_Custom_CSS();
