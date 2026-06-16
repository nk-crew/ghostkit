<?php
/**
 * Typography plugin.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Typography_Plugin
 */
class GhostKit_Typography_Plugin {
	/**
	 * GhostKit_Typography_Plugin constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_meta' ) );
	}

	/**
	 * Check if current user can edit typography meta.
	 *
	 * @param bool   $allowed   Whether the user can add the meta field.
	 * @param string $meta_key  The meta key.
	 * @param int    $object_id Object ID.
	 * @param int    $user_id   User ID.
	 * @param string $cap       Capability name.
	 * @param array  $caps      User capabilities.
	 *
	 * @return bool
	 */
	public function can_edit_typography_permission( $allowed, $meta_key, $object_id, $user_id, $cap, $caps ) {
		if ( $this->can_edit_typography_simple() ) {
			return true;
		}

		$current_value = get_post_meta( $object_id, $meta_key, true );
		$new_value     = $this->get_meta_value_from_rest_request( $meta_key );

		if ( null === $new_value ) {
			return false;
		}

		if ( $current_value === $new_value ) {
			return true;
		}

		return false;
	}

	/**
	 * Simple capability check for typography meta.
	 *
	 * @return bool
	 */
	public function can_edit_typography_simple() {
		return current_user_can( 'edit_theme_options' );
	}

	/**
	 * Helper method to extract meta value from current REST API request.
	 *
	 * @param string $meta_key The meta key to look for.
	 * @return string|null The new meta value from request, or null if not found.
	 */
	private function get_meta_value_from_rest_request( $meta_key ) {
		if ( ! defined( 'REST_REQUEST' ) || ! REST_REQUEST ) {
			return null;
		}

		global $wp;
		if ( ! isset( $wp->query_vars['rest_route'] ) ) {
			return null;
		}

		$request_body = json_decode( file_get_contents( 'php://input' ), true );

		if ( ! $request_body || ! isset( $request_body['meta'][ $meta_key ] ) ) {
			return null;
		}

		return $request_body['meta'][ $meta_key ];
	}

	/**
	 * Register meta.
	 */
	public function register_meta() {
		register_meta(
			'post',
			'ghostkit_typography',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'string',
				'auth_callback' => array( $this, 'can_edit_typography_permission' ),
			)
		);
	}
}
new GhostKit_Typography_Plugin();
