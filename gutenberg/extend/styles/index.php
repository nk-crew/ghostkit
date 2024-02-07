<?php
/**
 * Render block CSS.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Extension_Styles
 */
class GhostKit_Extension_Styles {
	/**
	 * Array of CSS properties, that support pixels.
	 *
	 * @var array
	 */
	private static $css_props_with_pixels = array( 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-width', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-radius', 'bottom', 'top', 'left', 'right', 'font-size', 'height', 'width', 'min-height', 'min-width', 'max-height', 'max-width', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'margin', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'padding', 'outline-width' );

	/**
	 * GhostKit_Extension_Styles constructor.
	 */
	public static function init() {
		GhostKit_Extensions::register(
			'styles',
			array(
				'default_supports' => array(
					'styles' => array(
						'customSelector' => false,
					),
				),
			)
		);

		add_filter( 'gkt_block_custom_styles', 'GhostKit_Extension_Styles::block_custom_styles', 10, 2 );
	}

	/**
	 * Check if string end with.
	 *
	 * @param string $string full string.
	 * @param string $test  test string.
	 *
	 * @return boolean
	 */
	private static function endswith( $string, $test ) {
		$strlen  = strlen( $string );
		$testlen = strlen( $test );

		if ( $testlen > $strlen ) {
			return false;
		}

		return substr_compare( $string, $test, $strlen - $testlen, $testlen ) === 0;
	}

	/**
	 * Convert camel case string to dash case.
	 *
	 * @param string $str string to convert.
	 * @return string converted string.
	 */
	private static function camel2dash( $str ) {
		return strtolower( preg_replace( '/([a-zA-Z])(?=[A-Z])/', '$1-', $str ) );
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

		$id     = $attributes['ghostkit']['id'] ?? '';
		$styles = $attributes['ghostkit']['styles'] ?? '';

		if ( $id && $styles ) {
			$block_type      = WP_Block_Type_Registry::get_instance()->get_registered( $block['blockName'] );
			$custom_selector = isset( $block_type->supports['ghostkit']['styles']['customSelector'] )
			? $block_type->supports['ghostkit']['styles']['customSelector']
			: false;

			$selector = '.ghostkit-custom-' . $id;

			if ( $custom_selector ) {
				$selector = str_replace( '&', $selector, $custom_selector );
			}

			if ( ! empty( $blocks_css ) ) {
				$blocks_css .= ' ';
			}

			$blocks_css .= self::parse(
				ghostkit_decode(
					array(
						$selector => $styles,
					)
				)
			);
		}

		return $blocks_css;
	}

	/**
	 * Parse styles from block attribute.
	 *
	 * @param array   $data - styles data.
	 * @param string  $selector - current styles selector (useful for nested styles).
	 * @param boolean $escape - escape strings to save in database.
	 *
	 * @return string - ready to use styles string.
	 */
	public static function parse( $data = array(), $selector = '', $escape = true ) {
		$result     = array();
		$result_css = '';

		// add styles.
		foreach ( $data as $k => $val ) {
			// array values.
			if ( is_array( $val ) ) {
				// media for different screens.
				if ( strpos( $k, 'media_' ) === 0 ) {
					$result_css .= $result_css ? ' ' : '';
					$result_css .= '@media #{ghostkitvar:' . $k . '} {';
					$result_css .= ' ' . self::parse( $val, $selector, $escape );
					$result_css .= ' }';

					// @supports css.
				} elseif ( strpos( $k, '@supports' ) === 0 ) {
					$result_css .= $result_css ? ' ' : '';
					$result_css .= $k . ' {';
					$result_css .= ' ' . self::parse( $val, $selector, $escape );
					$result_css .= ' }';

					// nested selectors.
				} else {
					$nested_selector = $selector;

					if ( $nested_selector ) {
						if ( strpos( $k, '&' ) !== false ) {
							$nested_selector = str_replace( '&', $nested_selector, $k );
						} else {
							$nested_selector = $nested_selector . ' ' . $k;
						}
					} else {
						$nested_selector = $k;
					}

					$result_css .= ( $result_css ? ' ' : '' ) . self::parse( $val, $nested_selector, $escape );
				}

				// style properties and values.
			} elseif ( isset( $val ) && false !== $val ) {
				// fix selector > and < usage.
				if ( $escape ) {
					$selector = str_replace( '>', '&gt;', $selector );
					$selector = str_replace( '<', '&lt;', $selector );
				}

				if ( ! isset( $result[ $selector ] ) || ! $result[ $selector ] ) {
					$result[ $selector ] = '';
				}

				$is_custom  = 'custom' === $k;
				$prop_name  = self::camel2dash( $k );
				$prop_value = $val;

				// Prepare custom styles as text.
				if ( $is_custom ) {
					if ( ! empty( $prop_value ) && '' !== $prop_value && $selector ) {
						if ( ! isset( $result['custom'] ) ) {
							$result['custom'] = '';
						} else {
							$result['custom'] .= ' ';
						}

						$result['custom'] .= str_replace( 'selector', $selector, ghostkit_decode( $prop_value ) );
					}

					// Prepare styles from props.
				} else {
					$with_important = self::endswith( $prop_value, ' !important' );

					if ( $with_important ) {
						$prop_value = str_replace( ' !important', '', $prop_value );
					}

					// add pixels.
					if (
						// Ensure that value is number, or string, which contains numbers.
						(
							( is_numeric( $prop_value ) && 0 !== $prop_value ) ||
							( is_string( $prop_value ) && $prop_value && preg_match( '/^[0-9.\-]*$/', $prop_value ) )
						) &&
						// Ensure that property support units.
						// For example, we should not add pixes to z-index.
						in_array( $prop_name, self::$css_props_with_pixels, true )
					) {
						$prop_value .= 'px';
					}

					// add custom css.
					if ( ! empty( $prop_value ) && '' !== $prop_value ) {
						if ( $with_important ) {
							$prop_value .= ' !important';
						}

						$result[ $selector ] .= ' ' . $prop_name . ': ' . $prop_value . ';';
					}
				}
			}
		}

		// add styles to selectors.
		foreach ( $result as $k => $val ) {
			if ( 'custom' === $k ) {
				$result_css = $val . ( $result_css ? " $result_css" : '' );
			} else {
				$result_css = $k . ' {' . $val . ' }' . ( $result_css ? " $result_css" : '' );
			}
		}

		return $result_css;
	}
}

GhostKit_Extension_Styles::init();
