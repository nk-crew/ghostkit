<?php
/**
 * Tests for Ghost Kit REST route permissions.
 *
 * @package ghostkit
 */

/**
 * REST permissions test case.
 */
class GhostKitRestPermissionsTest extends WP_UnitTestCase {
	/**
	 * Set up a fresh REST server.
	 */
	public function set_up() {
		parent::set_up();

		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );
	}

	/**
	 * Tear down.
	 */
	public function tear_down() {
		global $wp_rest_server;
		$wp_rest_server = null;

		parent::tear_down();
	}

	/**
	 * Dispatch a GET request.
	 *
	 * @param string $route  route.
	 * @param array  $params query params.
	 * @return WP_REST_Response
	 */
	private function get( $route, $params = array() ) {
		$request = new WP_REST_Request( 'GET', $route );
		$request->set_query_params( $params );

		return rest_get_server()->dispatch( $request );
	}

	/**
	 * Create a user with a role and log in.
	 *
	 * @param string $role role.
	 * @return int
	 */
	private function login_as( $role ) {
		$user_id = self::factory()->user->create( array( 'role' => $role ) );
		wp_set_current_user( $user_id );

		return $user_id;
	}

	/**
	 * Removed Ghost Kit template endpoints are no longer registered.
	 */
	public function test_template_routes_are_gone() {
		$this->login_as( 'administrator' );
		$this->assertSame( 404, $this->get( '/ghostkit/v1/get_templates' )->get_status() );
		$this->assertSame( 404, $this->get( '/ghostkit/v1/get_template_data' )->get_status() );
	}

	/**
	 * Attachment image tags need edit_posts.
	 */
	public function test_attachment_image_permissions() {
		$attachment_id = self::factory()->attachment->create_upload_object( DIR_TESTDATA . '/images/canola.jpg' );

		wp_set_current_user( 0 );
		$this->assertSame( 401, $this->get( '/ghostkit/v1/get_attachment_image/' . $attachment_id )->get_status() );

		$this->login_as( 'subscriber' );
		$this->assertSame( 403, $this->get( '/ghostkit/v1/get_attachment_image/' . $attachment_id )->get_status() );

		$this->login_as( 'author' );
		$response = $this->get( '/ghostkit/v1/get_attachment_image/' . $attachment_id );

		$this->assertSame( 200, $response->get_status() );
		$this->assertStringContainsString( 'wp-image-' . $attachment_id, $response->get_data()['response'] );
		$this->assertStringContainsString( ' alt=""', $response->get_data()['response'] );

		// The media library shows Authors images attached to other users' drafts, so the route serves them too.
		$admin_id    = self::factory()->user->create( array( 'role' => 'administrator' ) );
		$draft_id    = self::factory()->post->create(
			array(
				'post_status' => 'draft',
				'post_author' => $admin_id,
			)
		);
		$attached_id = self::factory()->attachment->create_upload_object( DIR_TESTDATA . '/images/canola.jpg', $draft_id );
		wp_update_post(
			array(
				'ID'          => $attached_id,
				'post_author' => $admin_id,
			)
		);
		$response = $this->get( '/ghostkit/v1/get_attachment_image/' . $attached_id );

		$this->assertSame( 200, $response->get_status() );
		$this->assertStringContainsString( 'wp-image-' . $attached_id, $response->get_data()['response'] );

		// A contributor cannot browse the media library, so another user's private image stays hidden.
		$private_id = self::factory()->post->create(
			array(
				'post_status' => 'private',
				'post_author' => $admin_id,
			)
		);
		wp_update_post(
			array(
				'ID'          => $attached_id,
				'post_parent' => $private_id,
			)
		);
		$this->login_as( 'contributor' );

		$this->assertSame( 403, $this->get( '/ghostkit/v1/get_attachment_image/' . $attached_id )->get_status() );
	}

	/**
	 * Without unfiltered_html, changing global JS is refused and the option keeps its value.
	 */
	public function test_global_js_change_refused_without_unfiltered_html() {
		$this->login_as( 'administrator' );
		update_option(
			'ghostkit_custom_code',
			array(
				'ghostkit_custom_css'     => 'body{}',
				'ghostkit_custom_js_head' => 'old();',
				'ghostkit_custom_js_foot' => '',
			)
		);

		$deny_unfiltered = static function ( $allcaps ) {
			$allcaps['unfiltered_html'] = false;
			return $allcaps;
		};
		add_filter( 'user_has_cap', $deny_unfiltered );

		$request = new WP_REST_Request( 'POST', '/ghostkit/v1/update_custom_code' );
		$request->set_param(
			'data',
			array(
				'ghostkit_custom_css'     => 'body{}',
				'ghostkit_custom_js_head' => 'evil();',
				'ghostkit_custom_js_foot' => '',
			)
		);
		$response = rest_get_server()->dispatch( $request );

		$this->assertSame( 403, $response->get_status() );
		$this->assertSame( 'old();', get_option( 'ghostkit_custom_code' )['ghostkit_custom_js_head'] );

		// A null value would replace the script through array_merge.
		$request = new WP_REST_Request( 'POST', '/ghostkit/v1/update_custom_code' );
		$request->set_param( 'data', array( 'ghostkit_custom_js_head' => null ) );
		$response = rest_get_server()->dispatch( $request );

		$this->assertSame( 403, $response->get_status() );
		$this->assertSame( 'old();', get_option( 'ghostkit_custom_code' )['ghostkit_custom_js_head'] );

		// CSS can still be saved when JS is sent unchanged.
		$request = new WP_REST_Request( 'POST', '/ghostkit/v1/update_custom_code' );
		$request->set_param(
			'data',
			array(
				'ghostkit_custom_css'     => 'a{}',
				'ghostkit_custom_js_head' => 'old();',
				'ghostkit_custom_js_foot' => '',
			)
		);
		$response = rest_get_server()->dispatch( $request );

		remove_filter( 'user_has_cap', $deny_unfiltered );

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'a{}', get_option( 'ghostkit_custom_code' )['ghostkit_custom_css'] );
	}

	/**
	 * Administrators with unfiltered_html can change global JS.
	 */
	public function test_global_js_change_allowed_with_unfiltered_html() {
		$user_id = $this->login_as( 'administrator' );
		if ( is_multisite() ) {
			grant_super_admin( $user_id );
		}

		$request = new WP_REST_Request( 'POST', '/ghostkit/v1/update_custom_code' );
		$request->set_param( 'data', array( 'ghostkit_custom_js_head' => 'new();' ) );
		$response = rest_get_server()->dispatch( $request );

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'new();', get_option( 'ghostkit_custom_code' )['ghostkit_custom_js_head'] );
	}

	/**
	 * Custom CSS keeps `&`, `>` and `<` and cannot close the style tag.
	 */
	public function test_custom_css_sanitizer() {
		$this->assertSame( '.a { & > .b { color: red; } } > .c {}', GhostKit_Assets::sanitize_custom_css( '.a { & > .b { color: red; } } &gt; .c {}' ) );

		// A <style> wrapper is dropped, its rules stay.
		$this->assertSame( '.a{b:c}', GhostKit_Assets::sanitize_custom_css( '<style>.a{b:c}</style>' ) );
		$this->assertSame( '.a{b:c}', GhostKit_Assets::sanitize_custom_css( '<style media="(width > 600px)">.a{b:c}</style>' ) );

		// A comment wrapper cannot open, its rules stay.
		$this->assertSame( ' .a{b:c}-->', GhostKit_Assets::sanitize_custom_css( '<!--.a{b:c}-->' ) );

		// `<` inside CSS does not cut the rules after it.
		$css = '@media (600px <= width <= 900px) { .a { color: red; } } .b { content: "<"; } .c { color: blue; }';
		$this->assertSame( $css, GhostKit_Assets::sanitize_custom_css( $css ) );

		// Nothing in the output can close the style element or open a comment.
		foreach ( array( '.x {}</st</styleyle>', '.x {}</STYLE >', '.x {}</STYLE', '.x {}<!--', '.x {}</scr</scriptipt>', '.x {}<!<!---->' ) as $input ) {
			$output = GhostKit_Assets::sanitize_custom_css( $input );

			$this->assertDoesNotMatchRegularExpression( '#</style|</script|<!--#i', $output, $input );
		}
	}

	/**
	 * An ISO-2022-JP shift sequence cannot hide `</style` from the sanitizer.
	 */
	public function test_custom_css_sanitizer_drops_esc_bytes() {
		$output = GhostKit_Assets::sanitize_custom_css( "<\x1b(B/style><img src=x onerror=alert(1) a\">" );

		$this->assertStringNotContainsString( '</', $output );
		$this->assertStringNotContainsString( "\x1b", $output );
	}

	/**
	 * No end tag survives, whatever element the CSS is printed in.
	 */
	public function test_custom_css_sanitizer_escapes_any_end_tag() {
		$output = GhostKit_Assets::sanitize_custom_css( "</noscript a'><img src=x onerror=alert(1) b\">" );

		$this->assertStringNotContainsString( '</', $output );
	}

	/**
	 * Deeply nested input is sanitized in one pass.
	 */
	public function test_custom_css_sanitizer_is_linear_on_nested_input() {
		$css = str_repeat( '</', 20000 ) . str_repeat( 'style', 20000 );

		$start  = microtime( true );
		$output = GhostKit_Assets::sanitize_custom_css( $css );

		$this->assertLessThan( 0.1, microtime( true ) - $start );
		$this->assertStringNotContainsString( '</', $output );
	}
}
