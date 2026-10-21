<?php
/**
 * Tests for icons loaded on demand.
 *
 * @package ghostkit
 */

/**
 * Icons REST route and editor variables tests.
 */
class GhostKitIconsRestTest extends WP_UnitTestCase {
	/**
	 * Add a pack the way Ghost Kit Pro adds its icon packs.
	 *
	 * @param array $icons icons list.
	 *
	 * @return array
	 */
	public function add_test_pack( $icons ) {
		$icons['test-pack'] = array(
			'name'  => 'Test Pack',
			'icons' => array(
				array(
					'keys'     => 'test-icon',
					'svg'      => '<svg class="test-icon"></svg>',
					'fallback' => 'test test-icon',
				),
			),
		);

		return $icons;
	}

	/**
	 * Set up test case.
	 */
	public function set_up() {
		parent::set_up();

		add_filter( 'gkt_icons_list', array( $this, 'add_test_pack' ) );

		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );
	}

	/**
	 * Tear down test case.
	 */
	public function tear_down() {
		remove_filter( 'gkt_icons_list', array( $this, 'add_test_pack' ) );

		global $wp_rest_server;
		$wp_rest_server = null;

		parent::tear_down();
	}

	/**
	 * Users who cannot edit posts get no icons.
	 */
	public function test_get_icons_refuses_subscriber() {
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'subscriber' ) ) );

		$response = rest_do_request( new WP_REST_Request( 'GET', '/ghostkit/v1/get_icons' ) );

		$this->assertSame( 403, $response->get_status() );
		$this->assertArrayNotHasKey( 'response', (array) $response->get_data() );
	}

	/**
	 * Editors get every pack with its SVG icons, including packs added through the filter.
	 */
	public function test_get_icons_returns_packs_with_svg_for_contributor() {
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'contributor' ) ) );

		$response = rest_do_request( new WP_REST_Request( 'GET', '/ghostkit/v1/get_icons' ) );
		$data     = $response->get_data();

		$this->assertSame( 200, $response->get_status() );
		$this->assertTrue( $data['success'] );
		$this->assertSame( '<svg class="test-icon"></svg>', $data['response']['test-pack']['icons'][0]['svg'] );
		$this->assertArrayHasKey( 'font-awesome', $data['response'] );
		$this->assertNotEmpty( $data['response']['font-awesome']['icons'] );
	}

	/**
	 * The editor variables carry pack names only, not the icons.
	 */
	public function test_get_packs_returns_names_without_icons() {
		$packs = GhostKit_Icons_List::get_packs();

		$this->assertSame( array( 'name' => 'Test Pack' ), $packs['test-pack'] );
		$this->assertSame( array( 'name' => 'FontAwesome' ), $packs['font-awesome'] );
	}
}
