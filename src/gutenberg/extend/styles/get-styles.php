<?php
/**
 * Get block custom styles.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Block_Custom_Styles
 */
class GhostKit_Block_Custom_Styles {
    /**
     * Array of CSS properties, that support pixels.
     *
     * @var array
     */
    private static $css_props_with_pixels = array( 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-width', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-radius', 'bottom', 'top', 'left', 'right', 'font-size', 'height', 'width', 'min-height', 'min-width', 'max-height', 'max-width', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom', 'margin', 'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'padding', 'outline-width' );

    /**
     * Check if string end with.
     *
     * @param String $string full string.
     * @param String $test  test string.
     *
     * @return Boolean
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
     * @param String $str string to convert.
     * @return String converted string.
     */
    private static function camel2dash( $str ) {
        return strtolower( preg_replace( '/([a-zA-Z])(?=[A-Z])/', '$1-', $str ) );
    }

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
            isset( $block_attrs['ghostkitStyles'] ) &&
            ! empty( $block_attrs['ghostkitStyles'] )
        ) {
            $result_css .= self::parse( $block_attrs['ghostkitStyles'] );
        }

        return $result_css;
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

                            // inside exported xml file all & symbols converted to \u0026.
                        } elseif ( strpos( $k, 'u0026' ) !== false ) {
                            $nested_selector = str_replace( 'u0026', $nested_selector, $k );
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

                // inside exported xml file all > symbols converted to \u003e
                // inside exported xml file all < symbols converted to \u003c.
                if ( strpos( $selector, 'u0026' ) !== false ) {
                    $selector = str_replace( 'u003e', '&gt;', $selector );
                    $selector = str_replace( 'u003c', '&lt;', $selector );
                }

                if ( ! isset( $result[ $selector ] ) || ! $result[ $selector ] ) {
                    $result[ $selector ] = '';
                }

                $prop_name  = self::camel2dash( $k );
                $prop_value = $val;

                // inside exported xml file all " symbols converted to \u0022.
                if ( is_string( $prop_value ) && strpos( $prop_value, 'u0022' ) !== false ) {
                    $prop_value = str_replace( 'u0022', '"', $prop_value );
                }

                // inside exported xml file all ' symbols converted to \u0027.
                if ( is_string( $prop_value ) && strpos( $prop_value, 'u0027' ) !== false ) {
                    $prop_value = str_replace( 'u0027', '\'', $prop_value );
                }

                $there_id_important = self::endswith( $prop_value, ' !important' );

                if ( $there_id_important ) {
                    $prop_value = str_replace( ' !important', '', $prop_value );
                }

                // add pixels.
                if (
                    (
                        is_numeric( $prop_value ) &&
                        0 !== $prop_value &&
                        in_array( $prop_name, self::$css_props_with_pixels, true )
                    ) ||
                    (
                        is_string( $prop_value ) &&
                        $prop_value &&
                        preg_match( '/^[0-9.\-]*$/', $prop_value )
                    )
                ) {
                    $prop_value .= 'px';
                }

                // add custom css.
                if ( ! empty( $prop_value ) && '' !== $prop_value ) {
                    if ( $there_id_important ) {
                        $prop_value .= ' !important';
                    }

                    $result[ $selector ] .= ' ' . $prop_name . ': ' . $prop_value . ';';
                }
            }
        }

        // add styles to selectors.
        foreach ( $result as $k => $val ) {
            $result_css = $k . ' {' . $val . ' }' . ( $result_css ? " $result_css" : '' );
        }

        return $result_css;
    }
}
