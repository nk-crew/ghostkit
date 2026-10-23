<?php
/**
 * Tests for icon class names stored by older versions.
 *
 * @package ghostkit
 */

/**
 * Class name fallbacks tests.
 */
class GhostKitIconsFallbacksTest extends WP_UnitTestCase {
	/**
	 * SVG of every icon by its `fallback` class name, as the editor receives it.
	 *
	 * @return array
	 */
	private function get_svg_by_fallback() {
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'editor' ) ) );

		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );

		$response = rest_do_request( new WP_REST_Request( 'GET', '/ghostkit/v1/get_icons' ) );
		$data     = $response->get_data();

		$wp_rest_server = null;

		$this->assertSame( 200, $response->get_status() );

		$result = array();

		foreach ( $data['response'] as $pack ) {
			foreach ( $pack['icons'] as $icon ) {
				if ( isset( $icon['fallback'] ) ) {
					$result[ $icon['fallback'] ] = $icon['svg'];
				}
			}
		}

		return $result;
	}

	/**
	 * Every FontAwesome 6.4.0 class name still resolves to an SVG.
	 */
	public function test_font_awesome_6_class_names_resolve_to_svg() {
		$classes = file( dirname( __DIR__ ) . '/fixtures/font-awesome-6.4.0-classes.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES );
		$svgs    = $this->get_svg_by_fallback();

		$this->assertCount( 2025, $classes );

		$missing = array();

		foreach ( $classes as $class ) {
			if ( ! isset( $svgs[ $class ] ) || 0 !== strpos( $svgs[ $class ], '<svg class="ghostkit-svg-icon ghostkit-svg-icon-fa"' ) ) {
				$missing[] = $class;
			}
		}

		$this->assertSame( array(), $missing );
	}

	/**
	 * Icons FontAwesome 7 renamed or dropped keep their class name.
	 */
	public function test_font_awesome_icons_missing_in_7_keep_their_class_name() {
		$svgs = $this->get_svg_by_fallback();

		// FontAwesome 7 made user-large an alias of user and dropped vector-square from Free.
		$this->assertStringContainsString( 'd="M256 288A144 144 0 1 0 256 0', $svgs['fa-solid fa-user-large'] );
		$this->assertStringContainsString( 'd="M368 80h32v32H368V80z', $svgs['fa-solid fa-vector-square'] );

		// Icons FontAwesome 7 still ships come from FontAwesome 7.
		$this->assertStringContainsString( 'd="M224.3 141a115 115 0 1 0 -.6 230', $svgs['fa-brands fa-instagram'] );
	}
}
