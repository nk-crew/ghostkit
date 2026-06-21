<?php
/**
 * Tests for GhostKit Customizer security.
 *
 * @package ghostkit
 */

/**
 * Customizer security test case.
 */
class GhostKitCustomizerSecurityTest extends WP_UnitTestCase {
	/**
	 * Customizer plugin instance.
	 *
	 * @var GhostKit_Customizer_Plugin
	 */
	private $customizer;

	/**
	 * Set up test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->customizer = new GhostKit_Customizer_Plugin();

		update_option(
			'ghostkit_customizer_fields',
			array(
				array(
					'id'   => 'blogname',
					'type' => 'option',
				),
				array(
					'id'   => 'header_textcolor',
					'type' => 'theme_mod',
				),
			)
		);
	}

	/**
	 * Malicious customizer payloads should be stripped.
	 */
	public function test_filter_valid_custom_options_blocks_malicious_payload() {
		$malicious = array(
			array(
				'type'  => 'option',
				'id'    => 'ghostkit_custom_code',
				'value' => array(
					'ghostkit_custom_js_head' => "alert('xss')",
				),
			),
		);

		$result = $this->customizer->filter_valid_custom_options( $malicious );

		$this->assertSame( array(), $result );
	}

	/**
	 * Only allowlisted customizer fields should be accepted.
	 */
	public function test_filter_valid_custom_options_allows_allowlisted_field() {
		$valid = array(
			array(
				'type'  => 'option',
				'id'    => 'blogname',
				'value' => 'My Site',
			),
		);

		$result = $this->customizer->filter_valid_custom_options( $valid );

		$this->assertCount( 1, $result );
		$this->assertSame( 'blogname', $result[0]['id'] );
		$this->assertSame( 'My Site', $result[0]['value'] );
	}

	/**
	 * Non-scalar values should be rejected.
	 */
	public function test_filter_valid_custom_options_rejects_non_scalar_values() {
		$invalid = array(
			array(
				'type'  => 'option',
				'id'    => 'blogname',
				'value' => array( 'nested' => 'value' ),
			),
		);

		$result = $this->customizer->filter_valid_custom_options( $invalid );

		$this->assertSame( array(), $result );
	}

	/**
	 * Sanitize callback should remove blocked options from stored meta.
	 */
	public function test_sanitize_customizer_options_strips_malicious_payload() {
		$payload = rawurlencode(
			wp_json_encode(
				array(
					array(
						'type'  => 'option',
						'id'    => 'ghostkit_custom_code',
						'value' => array(
							'ghostkit_custom_js_head' => "alert('xss')",
						),
					),
				)
			)
		);

		$result = $this->customizer->sanitize_customizer_options( $payload );

		$this->assertSame( '', $result );
	}

	/**
	 * Sanitize callback should keep valid allowlisted options.
	 */
	public function test_sanitize_customizer_options_keeps_valid_payload() {
		$payload = rawurlencode(
			wp_json_encode(
				array(
					array(
						'type'  => 'theme_mod',
						'id'    => 'header_textcolor',
						'value' => '#ffffff',
					),
				)
			)
		);

		$result = $this->customizer->sanitize_customizer_options( $payload );

		$this->assertNotSame( '', $result );

		$decoded = json_decode( rawurldecode( $result ), true );

		$this->assertCount( 1, $decoded );
		$this->assertSame( 'header_textcolor', $decoded[0]['id'] );
		$this->assertSame( '#ffffff', $decoded[0]['value'] );
	}

	/**
	 * Sanitize callback should preserve valid data when allowlist is empty.
	 */
	public function test_sanitize_preserves_valid_data_when_allowlist_empty() {
		update_option( 'ghostkit_customizer_fields', array() );

		$payload = rawurlencode(
			wp_json_encode(
				array(
					array(
						'type'  => 'theme_mod',
						'id'    => 'header_textcolor',
						'value' => '#ffffff',
					),
				)
			)
		);

		$result = $this->customizer->sanitize_customizer_options( $payload );

		$this->assertNotSame( '', $result );

		$decoded = json_decode( rawurldecode( $result ), true );

		$this->assertCount( 1, $decoded );
		$this->assertSame( 'header_textcolor', $decoded[0]['id'] );
		$this->assertSame( '#ffffff', $decoded[0]['value'] );
	}

	/**
	 * Sanitize callback should still block malicious payloads when allowlist is empty.
	 */
	public function test_sanitize_blocks_malicious_payload_when_allowlist_empty() {
		update_option( 'ghostkit_customizer_fields', array() );

		$payload = rawurlencode(
			wp_json_encode(
				array(
					array(
						'type'  => 'option',
						'id'    => 'ghostkit_custom_code',
						'value' => array(
							'ghostkit_custom_js_head' => "alert('xss')",
						),
					),
				)
			)
		);

		$result = $this->customizer->sanitize_customizer_options( $payload );

		$this->assertSame( '', $result );
	}

	/**
	 * Security filter should allow scalar entries without allowlist.
	 */
	public function test_filter_security_custom_options_allows_scalar_entry() {
		$valid = array(
			array(
				'type'  => 'option',
				'id'    => 'blogname',
				'value' => 'My Site',
			),
		);

		$result = $this->customizer->filter_security_custom_options( $valid );

		$this->assertCount( 1, $result );
		$this->assertSame( 'blogname', $result[0]['id'] );
		$this->assertSame( 'My Site', $result[0]['value'] );
	}

	/**
	 * Sanitize callback should preserve plus signs in values.
	 */
	public function test_sanitize_preserves_plus_sign_in_values() {
		$payload = wp_json_encode(
			array(
				array(
					'type'  => 'option',
					'id'    => 'blogname',
					'value' => 'My+Site',
				),
			)
		);

		$result = $this->customizer->sanitize_customizer_options( $payload );

		$this->assertNotSame( '', $result );

		$decoded = json_decode( rawurldecode( $result ), true );

		$this->assertCount( 1, $decoded );
		$this->assertSame( 'blogname', $decoded[0]['id'] );
		$this->assertSame( 'My+Site', $decoded[0]['value'] );
	}

	/**
	 * Set up REST request context for customizer auth tests.
	 *
	 * @param int    $post_id Post ID.
	 * @param array  $meta    Meta values keyed by meta key.
	 * @return void
	 */
	private function set_rest_request_meta( $post_id, $meta ) {
		if ( ! defined( 'REST_REQUEST' ) ) {
			define( 'REST_REQUEST', true );
		}

		global $wp;
		$wp->query_vars['rest_route'] = '/wp/v2/posts/' . $post_id;

		$request = new WP_REST_Request( 'POST', '/wp/v2/posts/' . $post_id );
		$request->set_param( 'meta', $meta );

		$GLOBALS['ghostkit_current_rest_request'] = $request;
	}

	/**
	 * Tear down test case.
	 *
	 * @return void
	 */
	public function tear_down() {
		unset( $GLOBALS['ghostkit_current_rest_request'] );

		parent::tear_down();
	}

	/**
	 * Auth should allow semantically unchanged meta despite encoding mismatch.
	 */
	public function test_customizer_auth_allows_semantically_unchanged_despite_encoding_mismatch() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );

		$stored = rawurlencode(
			wp_json_encode(
				array(
					array(
						'type'  => 'option',
						'id'    => 'blogname',
						'value' => 'My Site',
					),
				)
			)
		);

		update_post_meta( $post_id, 'ghostkit_customizer_options', $stored );

		$rest_payload = wp_json_encode(
			array(
				array(
					'type'         => 'option',
					'id'           => 'blogname',
					'value'        => 'My Site',
					'label'        => 'Site Title',
					'choices'      => array(),
					'control_type' => 'text',
				),
			)
		);

		$this->set_rest_request_meta(
			$post_id,
			array(
				'ghostkit_customizer_options' => $rest_payload,
			)
		);

		$result = $this->customizer->can_edit_customizer_options_permission(
			false,
			'ghostkit_customizer_options',
			$post_id,
			$user_id,
			'edit_theme_options',
			array()
		);

		$this->assertTrue( $result );
	}

	/**
	 * Auth should deny semantic changes without required capability.
	 */
	public function test_customizer_auth_denies_semantic_change_without_capability() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );

		$stored = rawurlencode(
			wp_json_encode(
				array(
					array(
						'type'  => 'option',
						'id'    => 'blogname',
						'value' => 'My Site',
					),
				)
			)
		);

		update_post_meta( $post_id, 'ghostkit_customizer_options', $stored );

		$rest_payload = wp_json_encode(
			array(
				array(
					'type'  => 'option',
					'id'    => 'blogname',
					'value' => 'Hacked',
				),
			)
		);

		$this->set_rest_request_meta(
			$post_id,
			array(
				'ghostkit_customizer_options' => $rest_payload,
			)
		);

		$result = $this->customizer->can_edit_customizer_options_permission(
			false,
			'ghostkit_customizer_options',
			$post_id,
			$user_id,
			'edit_theme_options',
			array()
		);

		$this->assertFalse( $result );
	}

	/**
	 * Auth should treat empty stored meta and empty array payload as unchanged.
	 */
	public function test_customizer_auth_treats_empty_meta_as_empty_array() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );

		update_post_meta( $post_id, 'ghostkit_customizer_options', '' );

		$this->set_rest_request_meta(
			$post_id,
			array(
				'ghostkit_customizer_options' => '[]',
			)
		);

		$result = $this->customizer->can_edit_customizer_options_permission(
			false,
			'ghostkit_customizer_options',
			$post_id,
			$user_id,
			'edit_theme_options',
			array()
		);

		$this->assertTrue( $result );
	}

	/**
	 * Sanitize output canonical form should match auth canonical comparison.
	 */
	public function test_canonical_matches_sanitize_output() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );

		$stored = rawurlencode(
			wp_json_encode(
				array(
					array(
						'type'  => 'option',
						'id'    => 'blogname',
						'value' => 'My Site',
					),
				)
			)
		);

		update_post_meta( $post_id, 'ghostkit_customizer_options', $stored );

		$rest_payload = wp_json_encode(
			array(
				array(
					'type'         => 'option',
					'id'           => 'blogname',
					'value'        => 'My Site',
					'label'        => 'Site Title',
					'choices'      => array(),
					'control_type' => 'text',
				),
			)
		);

		$this->set_rest_request_meta(
			$post_id,
			array(
				'ghostkit_customizer_options' => $rest_payload,
			)
		);

		$this->assertTrue(
			$this->customizer->can_edit_customizer_options_permission(
				false,
				'ghostkit_customizer_options',
				$post_id,
				$user_id,
				'edit_theme_options',
				array()
			)
		);

		$sanitized = $this->customizer->sanitize_customizer_options( $rest_payload );

		$this->assertSame(
			$this->customizer->get_canonical_customizer_options_from_meta( $stored ),
			$this->customizer->get_canonical_customizer_options_from_meta( $sanitized )
		);
	}

	/**
	 * Auth should allow explicit null payloads when stored meta is empty.
	 */
	public function test_customizer_auth_allows_null_when_stored_empty() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );
		update_post_meta( $post_id, 'ghostkit_customizer_options', '' );

		$this->set_rest_request_meta(
			$post_id,
			array(
				'ghostkit_customizer_options' => null,
			)
		);

		$result = $this->customizer->can_edit_customizer_options_permission(
			false,
			'ghostkit_customizer_options',
			$post_id,
			$user_id,
			'edit_theme_options',
			array()
		);

		$this->assertTrue( $result );
	}

	/**
	 * Auth should allow the same options when list order differs.
	 */
	public function test_customizer_auth_allows_same_options_different_order() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );

		$stored = rawurlencode(
			wp_json_encode(
				array(
					array(
						'type'  => 'option',
						'id'    => 'blogname',
						'value' => 'My Site',
					),
					array(
						'type'  => 'theme_mod',
						'id'    => 'header_textcolor',
						'value' => '#ffffff',
					),
				)
			)
		);

		update_post_meta( $post_id, 'ghostkit_customizer_options', $stored );

		$rest_payload = wp_json_encode(
			array(
				array(
					'type'  => 'theme_mod',
					'id'    => 'header_textcolor',
					'value' => '#ffffff',
				),
				array(
					'type'  => 'option',
					'id'    => 'blogname',
					'value' => 'My Site',
				),
			)
		);

		$this->set_rest_request_meta(
			$post_id,
			array(
				'ghostkit_customizer_options' => $rest_payload,
			)
		);

		$result = $this->customizer->can_edit_customizer_options_permission(
			false,
			'ghostkit_customizer_options',
			$post_id,
			$user_id,
			'edit_theme_options',
			array()
		);

		$this->assertTrue( $result );
	}

	/**
	 * Auth should deny when the meta key is missing from the REST request.
	 */
	public function test_customizer_auth_denies_when_meta_key_missing() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );
		update_post_meta( $post_id, 'ghostkit_customizer_options', 'stored-value' );

		$this->set_rest_request_meta( $post_id, array() );

		$result = $this->customizer->can_edit_customizer_options_permission(
			false,
			'ghostkit_customizer_options',
			$post_id,
			$user_id,
			'edit_theme_options',
			array()
		);

		$this->assertFalse( $result );
	}
}
