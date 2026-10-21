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
	 * Outbound HTTP requests made during a test.
	 *
	 * @var array
	 */
	private $http_requests = array();

	/**
	 * Set up a fresh REST server and block outbound HTTP.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		// The test case unregisters plugin post types between tests.
		if ( ! post_type_exists( 'ghostkit_template' ) ) {
			GhostKit_Templates::add_custom_post_type();
		}

		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );

		$this->http_requests = array();
		add_filter( 'pre_http_request', array( $this, 'record_http_request' ), 10, 3 );
	}

	/**
	 * Tear down.
	 *
	 * @return void
	 */
	public function tear_down() {
		global $wp_rest_server;
		$wp_rest_server = null;

		remove_filter( 'pre_http_request', array( $this, 'record_http_request' ), 10 );

		parent::tear_down();
	}

	/**
	 * Record outbound request and answer with an empty JSON object.
	 *
	 * @param false|array $pre  short-circuit value.
	 * @param array       $args request args.
	 * @param string      $url  request URL.
	 * @return array
	 */
	public function record_http_request( $pre, $args, $url ) {
		$this->http_requests[] = $url;

		return array(
			'headers'  => array(),
			'body'     => '{"response":[]}',
			'response' => array(
				'code'    => 200,
				'message' => 'OK',
			),
			'cookies'  => array(),
		);
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
	 * Visitors and subscribers cannot list templates, and no library request is made.
	 */
	public function test_templates_list_refused_without_edit_posts() {
		delete_transient( 'ghostkit_remote_templates' );

		wp_set_current_user( 0 );
		$this->assertSame( 401, $this->get( '/ghostkit/v1/get_templates' )->get_status() );

		$this->login_as( 'subscriber' );
		$this->assertSame( 403, $this->get( '/ghostkit/v1/get_templates' )->get_status() );

		$this->assertSame( array(), $this->http_requests );
		$this->assertFalse( get_transient( 'ghostkit_remote_templates' ) );
	}

	/**
	 * Contributors can list templates.
	 */
	public function test_templates_list_allowed_for_contributor() {
		$this->login_as( 'contributor' );

		$response = $this->get( '/ghostkit/v1/get_templates' );

		$this->assertSame( 200, $response->get_status() );
		$this->assertTrue( $response->get_data()['success'] );
	}

	/**
	 * A private template is not returned to a user who cannot read it.
	 */
	public function test_private_local_template_refused_for_contributor() {
		$admin_id    = self::factory()->user->create( array( 'role' => 'administrator' ) );
		$template_id = self::factory()->post->create(
			array(
				'post_type'    => 'ghostkit_template',
				'post_status'  => 'private',
				'post_author'  => $admin_id,
				'post_content' => 'secret template content',
			)
		);

		$this->login_as( 'contributor' );
		$response = $this->get(
			'/ghostkit/v1/get_template_data',
			array(
				'id'   => (string) $template_id,
				'type' => 'local',
			)
		);

		$this->assertSame( 403, $response->get_status() );
		$this->assertStringNotContainsString( 'secret template content', wp_json_encode( $response->get_data() ) );

		wp_set_current_user( 0 );
		$response = $this->get(
			'/ghostkit/v1/get_template_data',
			array(
				'id'   => (string) $template_id,
				'type' => 'local',
			)
		);

		$this->assertSame( 401, $response->get_status() );
		$this->assertStringNotContainsString( 'secret template content', wp_json_encode( $response->get_data() ) );
	}

	/**
	 * Editors can read a private template.
	 */
	public function test_private_local_template_allowed_for_editor() {
		$admin_id    = self::factory()->user->create( array( 'role' => 'administrator' ) );
		$template_id = self::factory()->post->create(
			array(
				'post_type'    => 'ghostkit_template',
				'post_status'  => 'private',
				'post_author'  => $admin_id,
				'post_content' => 'secret template content',
			)
		);

		$this->login_as( 'editor' );
		$response = $this->get(
			'/ghostkit/v1/get_template_data',
			array(
				'id'   => (string) $template_id,
				'type' => 'local',
			)
		);

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( 'secret template content', $response->get_data()['response']['content'] );
	}

	/**
	 * Visitors cannot make the site fetch a remote template.
	 */
	public function test_remote_template_refused_for_visitor() {
		wp_set_current_user( 0 );

		$response = $this->get(
			'/ghostkit/v1/get_template_data',
			array(
				'id'   => 'some-template',
				'type' => 'remote',
			)
		);

		$this->assertSame( 401, $response->get_status() );
		$this->assertSame( array(), $this->http_requests );
		$this->assertFalse( get_transient( 'ghostkit_template_remote_some-template' ) );
	}

	/**
	 * A theme template id with a path is rejected before any file lookup.
	 */
	public function test_theme_template_id_cannot_traverse_directories() {
		$this->login_as( 'editor' );

		$response = $this->get(
			'/ghostkit/v1/get_template_data',
			array(
				'id'   => '../../../../wp-config',
				'type' => 'theme',
			)
		);

		$data = $response->get_data();

		$this->assertFalse( $data['success'] );
		$this->assertSame( 'invalid_id', $data['error_code'] );
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
	}

	/**
	 * Social feed routes over HTTP need edit_posts, so visitors cannot trigger outbound requests.
	 */
	public function test_social_feed_http_request_refused_for_visitor() {
		if ( ! defined( 'REST_REQUEST' ) ) {
			define( 'REST_REQUEST', true );
		}

		wp_set_current_user( 0 );
		$response = $this->get(
			'/ghostkit/v1/get_instagram_feed',
			array( 'access_token' => 'visitor-token' )
		);

		$this->assertSame( 401, $response->get_status() );
		$this->assertSame( array(), $this->http_requests );

		$this->login_as( 'contributor' );
		$response = $this->get(
			'/ghostkit/v1/get_instagram_feed',
			array( 'access_token' => 'editor-token' )
		);

		$this->assertNotContains( $response->get_status(), array( 401, 403 ) );
		$this->assertCount( 1, $this->http_requests );
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
	 * Custom CSS keeps `&` and `>` and cannot close the style tag.
	 */
	public function test_custom_css_sanitizer() {
		$css = GhostKit_Assets::sanitize_custom_css( '.a { & > .b { color: red; } } &gt; .c {} </style><script>alert(1)</script>' );

		$this->assertSame( '.a { & > .b { color: red; } } > .c {}', $css );
		$this->assertSame( '.x {}', GhostKit_Assets::sanitize_custom_css( '.x {}</STYLE' ) );
	}
}
