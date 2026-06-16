<?php
/**
 * Tests for GhostKit REST meta auth helpers.
 *
 * @package ghostkit
 */

/**
 * REST meta auth test case.
 */
class GhostKitRestMetaAuthTest extends WP_UnitTestCase {
	/**
	 * Set up REST request context for meta auth helpers.
	 *
	 * @param array $meta Meta values keyed by meta key.
	 * @return void
	 */
	private function set_rest_request_meta( $meta ) {
		if ( ! defined( 'REST_REQUEST' ) ) {
			define( 'REST_REQUEST', true );
		}

		global $wp;
		$wp->query_vars['rest_route'] = '/wp/v2/posts/1';

		$request = new WP_REST_Request( 'POST', '/wp/v2/posts/1' );
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
	 * Meta values should be readable from the stored REST request.
	 */
	public function test_get_meta_value_from_rest_request_returns_meta_value() {
		$this->set_rest_request_meta(
			array(
				'ghostkit_typography' => 'typography-value',
			)
		);

		$result = ghostkit_get_meta_value_from_rest_request( 'ghostkit_typography' );

		$this->assertSame( 'typography-value', $result );
	}

	/**
	 * Multiple meta keys should be readable from the same REST request.
	 */
	public function test_get_meta_value_from_rest_request_reads_multiple_keys_from_same_request() {
		$this->set_rest_request_meta(
			array(
				'ghostkit_custom_css' => 'body { color: red; }',
				'ghostkit_typography' => 'typography-value',
			)
		);

		$this->assertSame( 'body { color: red; }', ghostkit_get_meta_value_from_rest_request( 'ghostkit_custom_css' ) );
		$this->assertSame( 'typography-value', ghostkit_get_meta_value_from_rest_request( 'ghostkit_typography' ) );
	}

	/**
	 * Users with the required capability should always be allowed.
	 */
	public function test_rest_meta_auth_allows_user_with_capability() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'administrator' ) );

		wp_set_current_user( $user_id );

		$this->set_rest_request_meta(
			array(
				'ghostkit_typography' => 'changed-value',
			)
		);

		$result = ghostkit_rest_meta_auth_allows_unchanged( 'ghostkit_typography', $post_id, 'edit_theme_options' );

		$this->assertTrue( $result );
	}

	/**
	 * Users without capability should be allowed when meta value is unchanged.
	 */
	public function test_rest_meta_auth_allows_unchanged_value_without_capability() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );
		update_post_meta( $post_id, 'ghostkit_typography', 'same-value' );

		$this->set_rest_request_meta(
			array(
				'ghostkit_typography' => 'same-value',
			)
		);

		$result = ghostkit_rest_meta_auth_allows_unchanged( 'ghostkit_typography', $post_id, 'edit_theme_options' );

		$this->assertTrue( $result );
	}

	/**
	 * Users without capability should be denied when meta value changes.
	 */
	public function test_rest_meta_auth_denies_changed_value_without_capability() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );
		update_post_meta( $post_id, 'ghostkit_typography', 'old-value' );

		$this->set_rest_request_meta(
			array(
				'ghostkit_typography' => 'new-value',
			)
		);

		$result = ghostkit_rest_meta_auth_allows_unchanged( 'ghostkit_typography', $post_id, 'edit_theme_options' );

		$this->assertFalse( $result );
	}

	/**
	 * Users without capability should be denied when new meta value is missing.
	 */
	public function test_rest_meta_auth_denies_when_new_meta_value_is_missing() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );
		update_post_meta( $post_id, 'ghostkit_typography', 'stored-value' );

		$this->set_rest_request_meta( array() );

		$result = ghostkit_rest_meta_auth_allows_unchanged( 'ghostkit_typography', $post_id, 'edit_theme_options' );

		$this->assertFalse( $result );
	}

	/**
	 * Contributor should pass auth for multiple unchanged meta keys in one request.
	 */
	public function test_rest_meta_auth_allows_multiple_unchanged_meta_keys_in_one_request() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );
		update_post_meta( $post_id, 'ghostkit_custom_css', 'body { color: red; }' );
		update_post_meta( $post_id, 'ghostkit_typography', 'typography-value' );

		$this->set_rest_request_meta(
			array(
				'ghostkit_custom_css' => 'body { color: red; }',
				'ghostkit_typography' => 'typography-value',
			)
		);

		$css_allowed        = ghostkit_rest_meta_auth_allows_unchanged( 'ghostkit_custom_css', $post_id, 'unfiltered_html' );
		$typography_allowed = ghostkit_rest_meta_auth_allows_unchanged( 'ghostkit_typography', $post_id, 'edit_theme_options' );

		$this->assertTrue( $css_allowed );
		$this->assertTrue( $typography_allowed );
	}

	/**
	 * Users with edit_post on the object should be allowed to change meta.
	 */
	public function test_rest_meta_auth_allows_edit_post_capability_with_object_id() {
		$user_id = self::factory()->user->create( array( 'role' => 'author' ) );
		$post_id = self::factory()->post->create( array( 'post_author' => $user_id ) );

		wp_set_current_user( $user_id );

		$this->set_rest_request_meta(
			array(
				'ghostkit_custom_css' => 'body { color: red; }',
			)
		);

		$result = ghostkit_rest_meta_auth_allows_unchanged( 'ghostkit_custom_css', $post_id, 'edit_post' );

		$this->assertTrue( $result );
	}

	/**
	 * Users without edit_post on the object should be denied when changing meta.
	 */
	public function test_rest_meta_auth_denies_edit_post_for_other_users_post() {
		$author_id = self::factory()->user->create( array( 'role' => 'author' ) );
		$other_id  = self::factory()->user->create( array( 'role' => 'author' ) );
		$post_id   = self::factory()->post->create( array( 'post_author' => $author_id ) );

		wp_set_current_user( $other_id );

		$this->set_rest_request_meta(
			array(
				'ghostkit_custom_css' => 'body { color: red; }',
			)
		);

		$result = ghostkit_rest_meta_auth_allows_unchanged( 'ghostkit_custom_css', $post_id, 'edit_post' );

		$this->assertFalse( $result );
	}

	/**
	 * Null meta values should be readable when the key is explicitly set.
	 */
	public function test_get_meta_value_from_rest_request_returns_null_when_key_is_null() {
		$this->set_rest_request_meta(
			array(
				'ghostkit_typography' => null,
			)
		);

		$this->assertTrue( ghostkit_rest_meta_key_exists_in_request( 'ghostkit_typography' ) );
		$this->assertNull( ghostkit_get_meta_value_from_rest_request( 'ghostkit_typography' ) );
	}

	/**
	 * Auth should allow null payloads when stored meta is empty.
	 */
	public function test_rest_meta_auth_allows_null_when_stored_empty() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );
		update_post_meta( $post_id, 'ghostkit_typography', '' );

		$this->set_rest_request_meta(
			array(
				'ghostkit_typography' => null,
			)
		);

		$result = ghostkit_rest_meta_auth_allows_unchanged( 'ghostkit_typography', $post_id, 'edit_theme_options' );

		$this->assertTrue( $result );
	}

	/**
	 * Auth should allow semantically equal JSON with different key order.
	 */
	public function test_rest_meta_auth_allows_json_semantically_equal_different_key_order() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );
		update_post_meta( $post_id, 'ghostkit_typography', '{"b":1,"a":2}' );

		$this->set_rest_request_meta(
			array(
				'ghostkit_typography' => '{"a":2,"b":1}',
			)
		);

		$result = ghostkit_rest_meta_auth_allows_unchanged( 'ghostkit_typography', $post_id, 'edit_theme_options' );

		$this->assertTrue( $result );
	}

	/**
	 * Auth should deny semantic JSON changes without capability.
	 */
	public function test_rest_meta_auth_denies_json_semantic_change() {
		$post_id = self::factory()->post->create();
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );

		wp_set_current_user( $user_id );
		update_post_meta( $post_id, 'ghostkit_typography', '{"a":1}' );

		$this->set_rest_request_meta(
			array(
				'ghostkit_typography' => '{"a":2}',
			)
		);

		$result = ghostkit_rest_meta_auth_allows_unchanged( 'ghostkit_typography', $post_id, 'edit_theme_options' );

		$this->assertFalse( $result );
	}
}
