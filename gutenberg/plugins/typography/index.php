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
		add_filter( 'gkt_global_data', array( $this, 'add_typography_capability_data' ) );
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
		return ghostkit_rest_meta_auth_allows_unchanged( $meta_key, $object_id, 'edit_post' );
	}

	/**
	 * Check if current user can edit global typography.
	 *
	 * @return bool
	 */
	public function can_edit_global_typography_permission() {
		return current_user_can( 'edit_theme_options' );
	}

	/**
	 * Add typography capability data to global variables (admin only).
	 *
	 * @param array $global_data Global data array.
	 * @return array Modified global data array.
	 */
	public function add_typography_capability_data( $global_data ) {
		if ( is_admin() ) {
			$global_data['canEditGlobalTypography'] = $this->can_edit_global_typography_permission();
		}

		return $global_data;
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
