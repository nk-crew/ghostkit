<?php
/**
 * Render deprecated block custom styles.
 *
 * @since v3.1.0
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Deprecated_Extension_Styles
 */
class GhostKit_Deprecated_Extension_Styles {
	/**
	 * GhostKit_Deprecated_Extension_Styles constructor.
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
	public static function block_custom_styles( $blocks_css, $block ) {
		$attributes = $block['attrs'] ?? array();

		$id = $attributes['ghostkit']['id'] ?? $attributes['ghostkitId'] ?? '';

		if ( $id && ! empty( $attributes['ghostkitStyles'] ) ) {
			if ( ! empty( $blocks_css ) ) {
				$blocks_css .= ' ';
			}

			$blocks_css .= GhostKit_Extension_Styles::parse( ghostkit_decode( $attributes['ghostkitStyles'] ) );
		}

		return $blocks_css;
	}
}

new GhostKit_Deprecated_Extension_Styles();
