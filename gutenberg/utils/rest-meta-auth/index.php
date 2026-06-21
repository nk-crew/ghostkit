<?php
/**
 * REST meta auth helper functions.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Store the current REST request for meta auth callbacks.
 *
 * WordPress auth_callback does not receive the new meta value. Gutenberg sends
 * all meta keys on post save, so multiple callbacks must read from the same
 * parsed request instead of php://input (which can only be read once).
 *
 * @param mixed           $response Response to replace.
 * @param array           $handler  Route handler.
 * @param WP_REST_Request $request  Request object.
 * @return mixed
 */
function ghostkit_store_current_rest_request( $response, $handler, $request ) {
	$GLOBALS['ghostkit_current_rest_request'] = $request;

	return $response;
}
add_filter( 'rest_request_before_callbacks', 'ghostkit_store_current_rest_request', 10, 3 );

/**
 * Get the current REST request meta params.
 *
 * @return array|null
 */
function ghostkit_get_rest_request_meta_params() {
	if ( ! defined( 'REST_REQUEST' ) || ! REST_REQUEST ) {
		return null;
	}

	global $wp;
	if ( ! isset( $wp->query_vars['rest_route'] ) ) {
		return null;
	}

	$request = isset( $GLOBALS['ghostkit_current_rest_request'] ) ? $GLOBALS['ghostkit_current_rest_request'] : null;

	if ( ! $request instanceof WP_REST_Request ) {
		return null;
	}

	$meta = $request->get_param( 'meta' );

	if ( ! is_array( $meta ) ) {
		return null;
	}

	return $meta;
}

/**
 * Check whether a meta key exists in the current REST request.
 *
 * @param string $meta_key The meta key to look for.
 * @return bool
 */
function ghostkit_rest_meta_key_exists_in_request( $meta_key ) {
	$meta = ghostkit_get_rest_request_meta_params();

	return is_array( $meta ) && array_key_exists( $meta_key, $meta );
}

/**
 * Extract a meta value from the current REST API request.
 *
 * @param string $meta_key The meta key to look for.
 * @return string|null The new meta value from request, or null if not found.
 */
function ghostkit_get_meta_value_from_rest_request( $meta_key ) {
	$meta = ghostkit_get_rest_request_meta_params();

	if ( ! is_array( $meta ) || ! array_key_exists( $meta_key, $meta ) ) {
		return null;
	}

	return $meta[ $meta_key ];
}

/**
 * Check whether a meta value should be treated as empty.
 *
 * @param mixed $value Meta value.
 * @return bool
 */
function ghostkit_is_empty_meta_value( $value ) {
	return '' === $value || null === $value || false === $value;
}

/**
 * Sort array values recursively for stable JSON comparison.
 *
 * @param mixed $value Value to normalize.
 * @return mixed
 */
function ghostkit_sort_array_deep_for_meta_compare( $value ) {
	if ( ! is_array( $value ) ) {
		return $value;
	}

	if ( function_exists( 'wp_is_numeric_array' ) && wp_is_numeric_array( $value ) ) {
		$sorted = array();

		foreach ( $value as $item ) {
			$sorted[] = ghostkit_sort_array_deep_for_meta_compare( $item );
		}

		return $sorted;
	}

	ksort( $value );

	foreach ( $value as $key => $item ) {
		$value[ $key ] = ghostkit_sort_array_deep_for_meta_compare( $item );
	}

	return $value;
}

/**
 * Normalize JSON meta strings for semantic comparison.
 *
 * @param mixed $value Meta value.
 * @return array|null
 */
function ghostkit_normalize_json_meta_for_compare( $value ) {
	if ( ! is_string( $value ) ) {
		return null;
	}

	if ( '' === $value ) {
		return array();
	}

	$decoded = json_decode( $value, true );

	if ( JSON_ERROR_NONE !== json_last_error() || ! is_array( $decoded ) ) {
		return null;
	}

	return ghostkit_sort_array_deep_for_meta_compare( $decoded );
}

/**
 * Check whether REST meta values are semantically unchanged.
 *
 * @param mixed $current_value Stored meta value.
 * @param mixed $new_value     Incoming REST meta value.
 * @return bool
 */
function ghostkit_rest_meta_values_are_unchanged( $current_value, $new_value ) {
	if ( $current_value === $new_value ) {
		return true;
	}

	if ( ghostkit_is_empty_meta_value( $current_value ) && ghostkit_is_empty_meta_value( $new_value ) ) {
		return true;
	}

	$current_json = ghostkit_normalize_json_meta_for_compare( $current_value );
	$new_json     = ghostkit_normalize_json_meta_for_compare( $new_value );

	if ( null !== $current_json && null !== $new_json ) {
		return wp_json_encode( $current_json ) === wp_json_encode( $new_json );
	}

	return false;
}

/**
 * Check whether the current user has a capability for meta auth.
 *
 * @param string $capability Capability name.
 * @param int    $object_id  Post ID for meta capabilities.
 * @return bool
 */
function ghostkit_current_user_can_for_meta_auth( $capability, $object_id ) {
	$meta_capabilities = array(
		'edit_post',
		'edit_page',
		'delete_post',
		'delete_page',
		'read_post',
		'read_page',
	);

	if ( in_array( $capability, $meta_capabilities, true ) ) {
		return current_user_can( $capability, $object_id );
	}

	return current_user_can( $capability );
}

/**
 * Check whether a REST meta update should be allowed.
 *
 * WP LIMITATION WORKAROUND:
 * When saving posts in Gutenberg, WordPress sends ALL meta fields via REST API,
 * including unchanged ones. The auth_callback is triggered for every meta field,
 * and if ANY field fails permission check, the ENTIRE post save fails.
 *
 * This is a known WordPress core issue (Trac #48426, #57745).
 *
 * We allow the update if:
 * 1. User has the required capability, OR
 * 2. The meta value is not actually changing.
 *
 * @param string $meta_key   Meta key.
 * @param int    $object_id  Post ID.
 * @param string $capability Required capability to change the value.
 * @return bool
 */
function ghostkit_rest_meta_auth_allows_unchanged( $meta_key, $object_id, $capability ) {
	$allowed = false;

	if ( ghostkit_current_user_can_for_meta_auth( $capability, $object_id ) ) {
		$allowed = true;
	} elseif ( ghostkit_rest_meta_key_exists_in_request( $meta_key ) ) {
		$current_value = get_post_meta( $object_id, $meta_key, true );
		$new_value     = ghostkit_get_meta_value_from_rest_request( $meta_key );

		if ( ghostkit_rest_meta_values_are_unchanged( $current_value, $new_value ) ) {
			$allowed = true;
		}
	}

	return $allowed;
}
