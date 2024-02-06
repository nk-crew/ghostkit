<?php
/**
 * Encode/Decode helper functions.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Encode string.
 *
 * @param string|array $str - string to encode.
 *
 * @return string|array
 */
function ghostkit_encode( $str ) {
	// Array.
	if ( is_array( $str ) ) {
		$result = array();

		foreach ( $str as $k => $val ) {
			$result[ ghostkit_encode( $k ) ] = ghostkit_encode( $val );
		}

		return $result;
	}

	// String.
	if ( is_string( $str ) ) {
		// Because of these replacements, some attributes can't be exported to XML without being broken. So, we need to replace it manually with something safe.
		// https://github.com/WordPress/gutenberg/blob/88645e4b268acf5746e914159e3ce790dcb1665a/packages/blocks/src/api/serializer.js#L246-L271 .
		$str = str_replace( '--', '_u002d__u002d_', $str );

        // phpcs:ignore
        $str = rawurlencode( $str );
	}

	return $str;
}

/**
 * Decode string.
 *
 * @param string|array $str - string to decode.
 *
 * @return string|array
 */
function ghostkit_decode( $str ) {
	// Array.
	if ( is_array( $str ) ) {
		$result = array();

		foreach ( $str as $k => $val ) {
			$result[ ghostkit_decode( $k ) ] = ghostkit_decode( $val );
		}

		return $result;
	}

	// String.
	if ( is_string( $str ) ) {
		// Previously we used urldecode() function, but it doesn't work properly with `+` character.
		// For example, there styles will be broken: width: calc( 100% + 20px );.
		$str = rawurldecode( $str );

		// Because of these replacements, some attributes can't be exported to XML without being broken. So, we need to replace it manually with something safe.
		// https://github.com/WordPress/gutenberg/blob/88645e4b268acf5746e914159e3ce790dcb1665a/packages/blocks/src/api/serializer.js#L246-L271 .
		$str = str_replace( '_u002d__u002d_', '--', $str );
	}

	return $str;
}
