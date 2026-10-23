<?php
/**
 * Tests for content saved with the removed Instagram and Twitter blocks.
 *
 * @package ghostkit
 */

/**
 * Removed social blocks tests.
 */
class GhostKitRemovedSocialBlocksTest extends WP_UnitTestCase {
	/**
	 * Outbound HTTP requests made during a test.
	 *
	 * @var array
	 */
	private $http_requests = array();

	/**
	 * Record and block outbound HTTP requests.
	 *
	 * @param false|array $preempt response.
	 * @param array       $args    request args.
	 * @param string      $url     request url.
	 *
	 * @return WP_Error
	 */
	public function record_http_request( $preempt, $args, $url ) {
		$this->http_requests[] = $url;

		return new WP_Error( 'blocked', 'Blocked in tests.' );
	}

	/**
	 * Set up test case.
	 */
	public function set_up() {
		parent::set_up();

		$this->http_requests = array();
		add_filter( 'pre_http_request', array( $this, 'record_http_request' ), 10, 3 );

		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );
	}

	/**
	 * Tear down test case.
	 */
	public function tear_down() {
		remove_filter( 'pre_http_request', array( $this, 'record_http_request' ), 10 );

		global $wp_rest_server;
		$wp_rest_server = null;

		parent::tear_down();
	}

	/**
	 * Saved blocks are no longer registered, render nothing and send no request.
	 */
	public function test_saved_blocks_render_empty_without_http_requests() {
		$content = '<!-- wp:ghostkit/instagram {"accessToken":"token","count":4} /-->'
			. '<!-- wp:ghostkit/twitter {"consumerKey":"a","consumerSecret":"b","accessToken":"c","accessTokenSecret":"d","userName":"nkdevv"} /-->';

		$this->assertFalse( WP_Block_Type_Registry::get_instance()->is_registered( 'ghostkit/instagram' ) );
		$this->assertFalse( WP_Block_Type_Registry::get_instance()->is_registered( 'ghostkit/twitter' ) );
		$this->assertSame( '', trim( do_blocks( $content ) ) );
		$this->assertSame( array(), $this->http_requests );
	}

	/**
	 * No social routes are registered.
	 */
	public function test_social_routes_are_not_registered() {
		$routes = rest_get_server()->get_routes( 'ghostkit/v1' );

		foreach ( array( 'get_instagram_profile', 'get_instagram_feed', 'get_twitter_profile', 'get_twitter_feed' ) as $route ) {
			$this->assertArrayNotHasKey( '/ghostkit/v1/' . $route, $routes );
		}

		$this->assertArrayHasKey( '/ghostkit/v1/get_icons', $routes );
	}
}
