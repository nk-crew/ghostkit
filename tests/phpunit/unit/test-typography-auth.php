<?php
/**
 * Tests for GhostKit Typography auth.
 *
 * @package ghostkit
 */

/**
 * Typography auth test case.
 */
class GhostKitTypographyAuthTest extends WP_UnitTestCase {
	/**
	 * Typography plugin instance.
	 *
	 * @var GhostKit_Typography_Plugin
	 */
	private $typography;

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
	 * Set up test case.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$this->typography = new GhostKit_Typography_Plugin();
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
	 * Editors should be allowed to change local typography on their own posts.
	 */
	public function test_editor_can_change_local_typography_on_own_post() {
		$user_id = self::factory()->user->create( array( 'role' => 'editor' ) );
		$post_id = self::factory()->post->create( array( 'post_author' => $user_id ) );

		wp_set_current_user( $user_id );

		$this->set_rest_request_meta(
			array(
				'ghostkit_typography' => '{"body":{"fontFamily":"Arial"}}',
			)
		);

		$result = $this->typography->can_edit_typography_permission(
			false,
			'ghostkit_typography',
			$post_id,
			$user_id,
			'',
			array()
		);

		$this->assertTrue( $result );
	}

	/**
	 * Authors should not be allowed to change typography on another user's post.
	 */
	public function test_author_cannot_change_typography_on_other_users_post() {
		$author_id = self::factory()->user->create( array( 'role' => 'author' ) );
		$other_id  = self::factory()->user->create( array( 'role' => 'author' ) );
		$post_id   = self::factory()->post->create( array( 'post_author' => $author_id ) );

		wp_set_current_user( $other_id );

		$this->set_rest_request_meta(
			array(
				'ghostkit_typography' => '{"body":{"fontFamily":"Arial"}}',
			)
		);

		$result = $this->typography->can_edit_typography_permission(
			false,
			'ghostkit_typography',
			$post_id,
			$other_id,
			'',
			array()
		);

		$this->assertFalse( $result );
	}

	/**
	 * Contributors should be allowed to change local typography on their own drafts.
	 */
	public function test_contributor_can_change_local_typography_on_own_post() {
		$user_id = self::factory()->user->create( array( 'role' => 'contributor' ) );
		$post_id = self::factory()->post->create(
			array(
				'post_author' => $user_id,
				'post_status' => 'draft',
			)
		);

		wp_set_current_user( $user_id );

		$this->set_rest_request_meta(
			array(
				'ghostkit_typography' => '{"body":{"fontFamily":"Georgia"}}',
			)
		);

		$result = $this->typography->can_edit_typography_permission(
			false,
			'ghostkit_typography',
			$post_id,
			$user_id,
			'',
			array()
		);

		$this->assertTrue( $result );
	}

	/**
	 * Editors should pass auth when typography meta is unchanged in bulk save.
	 */
	public function test_editor_allows_unchanged_typography_in_bulk_save() {
		$user_id = self::factory()->user->create( array( 'role' => 'editor' ) );
		$post_id = self::factory()->post->create( array( 'post_author' => $user_id ) );
		$stored  = '{"body":{"fontFamily":"Arial"}}';

		wp_set_current_user( $user_id );
		update_post_meta( $post_id, 'ghostkit_typography', $stored );

		$this->set_rest_request_meta(
			array(
				'ghostkit_typography' => $stored,
			)
		);

		$result = $this->typography->can_edit_typography_permission(
			false,
			'ghostkit_typography',
			$post_id,
			$user_id,
			'',
			array()
		);

		$this->assertTrue( $result );
	}

	/**
	 * Editors should not have global typography permission.
	 */
	public function test_editor_cannot_edit_global_typography() {
		$user_id = self::factory()->user->create( array( 'role' => 'editor' ) );

		wp_set_current_user( $user_id );

		$this->assertFalse( $this->typography->can_edit_global_typography_permission() );
	}

	/**
	 * Administrators should have global typography permission.
	 */
	public function test_admin_can_edit_global_typography() {
		$user_id = self::factory()->user->create( array( 'role' => 'administrator' ) );

		wp_set_current_user( $user_id );

		$this->assertTrue( $this->typography->can_edit_global_typography_permission() );
	}

}
