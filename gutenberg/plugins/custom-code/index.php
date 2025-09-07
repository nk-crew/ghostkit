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
	 * @return bool Whether the current user has permission to edit custom JS.
	 */
	public function can_edit_custom_js_permission() {
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
			$global_data['canEditCustomJS']         = $this->can_edit_custom_js_permission();
			$global_data['canEditGlobalCustomCode'] = $this->can_edit_global_custom_code_permission();
		}

		return $global_data;
	}
}
new GhostKit_Custom_Code_Plugin();
