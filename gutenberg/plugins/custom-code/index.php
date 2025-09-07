<?php
/**
 * Custom code plugin.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Custom_Code_Plugin
 */
class GhostKit_Custom_Code_Plugin {
	/**
	 * GhostKit_Custom_Code_Plugin constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_meta' ) );
		add_filter( 'gkt_global_data', array( $this, 'add_custom_js_capability_data' ) );
	}

	/**
	 * Check if current user can edit custom JS.
	 *
	 * WP LIMITATION WORKAROUND:
	 * When saving posts in Gutenberg, WordPress sends ALL meta fields via REST API,
	 * including unchanged ones. The auth_callback is triggered for every meta field,
	 * and if ANY field fails permission check, the ENTIRE post save fails.
	 *
	 * This is a known WordPress core issue (Trac #48426, #57745) where protected
	 * meta fields prevent updates to unrelated meta fields during bulk operations.
	 *
	 * OUR SOLUTION:
	 * We allow the update if:
	 * 1. User has proper capability (unfiltered_html), OR
	 * 2. The meta value is not actually changing (preventing false permission errors)
	 *
	 * This maintains security while preventing post save failures.
	 *
	 * @param bool   $allowed   Whether the user can add the meta field.
	 * @param string $meta_key  The meta key.
	 * @param int    $object_id Object ID.
	 * @param int    $user_id   User ID.
	 * @param string $cap       Capability name.
	 * @param array  $caps      User capabilities.
	 *
	 * @return bool Whether the current user has permission to edit custom JS.
	 */
	public function can_edit_custom_js_permission( $allowed, $meta_key, $object_id, $user_id, $cap, $caps ) {
		// First check: If user has proper capability, always allow.
		if ( $this->can_edit_custom_js_simple() ) {
			return true;
		}

		// Second check: Allow if value is not actually changing
		// This prevents WordPress bulk update failures when JS fields are
		// included in POST data but haven't actually been modified.
		$current_value = get_post_meta( $object_id, $meta_key, true );
		$new_value     = $this->get_meta_value_from_rest_request( $meta_key );

		// If we can't determine the new value, be conservative and check capability.
		if ( null === $new_value ) {
			return false;
		}

		// Allow if values are identical (no real change being made).
		if ( $current_value === $new_value ) {
			return true;
		}

		// Block if user lacks capability and is trying to change the value.
		return false;
	}

	/**
	 * Helper method to extract meta value from current REST API request.
	 *
	 * TECHNICAL NOTE:
	 * WordPress auth_callback doesn't provide the new meta value directly.
	 * We need to access the current REST request to compare old vs new values.
	 * This prevents permission errors when meta fields are included in bulk
	 * updates but haven't actually changed.
	 *
	 * @param string $meta_key The meta key to look for.
	 * @return string|null The new meta value from request, or null if not found.
	 */
	private function get_meta_value_from_rest_request( $meta_key ) {
		// Check if we're in a REST API request context.
		if ( ! defined( 'REST_REQUEST' ) || ! REST_REQUEST ) {
			return null;
		}

		// Try to get the current request.
		global $wp;
		if ( ! isset( $wp->query_vars['rest_route'] ) ) {
			return null;
		}

		// Get request body.
		$request_body = json_decode( file_get_contents( 'php://input' ), true );

		if ( ! $request_body || ! isset( $request_body['meta'][ $meta_key ] ) ) {
			return null;
		}

		return $request_body['meta'][ $meta_key ];
	}

	/**
	 * Simple capability check for custom JS (used for localization).
	 *
	 * This is a wrapper for the auth_callback method that doesn't require parameters.
	 * Used when we need to check capability for UI purposes (localized variables).
	 *
	 * @return bool Whether the current user has permission to edit custom JS.
	 */
	public function can_edit_custom_js_simple() {
		return current_user_can( 'unfiltered_html' );
	}

	/**
	 * Check if current user can edit global custom code (CSS and JS).
	 *
	 * @return bool Whether the current user has permission to edit global custom code.
	 */
	public function can_edit_global_custom_code_permission() {
		return current_user_can( 'edit_theme_options' );
	}

	/**
	 * Register meta.
	 */
	public function register_meta() {
		register_meta(
			'post',
			'ghostkit_custom_css',
			array(
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'string',
			)
		);
		register_meta(
			'post',
			'ghostkit_custom_js_head',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'string',
				'auth_callback' => array( $this, 'can_edit_custom_js_permission' ),
			)
		);
		register_meta(
			'post',
			'ghostkit_custom_js_foot',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'string',
				'auth_callback' => array( $this, 'can_edit_custom_js_permission' ),
			)
		);
	}

	/**
	 * Add custom JS capability data to global variables (admin only).
	 *
	 * @param array $global_data Global data array.
	 * @return array Modified global data array.
	 */
	public function add_custom_js_capability_data( $global_data ) {
		// Only add this data in admin context to prevent exposing it to frontend.
		if ( is_admin() ) {
			$global_data['canEditCustomJS']         = $this->can_edit_custom_js_simple();
			$global_data['canEditGlobalCustomCode'] = $this->can_edit_global_custom_code_permission();
		}

		return $global_data;
	}
}
new GhostKit_Custom_Code_Plugin();
