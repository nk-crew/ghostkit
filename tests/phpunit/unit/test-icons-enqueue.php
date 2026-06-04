<?php
/**
 * Tests for GhostKit_Icons_List enqueue behavior.
 *
 * @package ghostkit
 */

/**
 * Icon enqueue tests.
 */
class IconsEnqueueTest extends WP_UnitTestCase {

	/**
	 * Icon pack hooks should not depend on frontend content detection.
	 */
	public function test_allowed_icon_pack_enqueue_hook_runs_without_content_detection() {
		$called = 0;

		update_option(
			'ghostkit_settings',
			array(
				'icon_pack_ghostkit' => true,
			)
		);

		add_action(
			'gkt_icons_enqueue_assets__ghostkit',
			function () use ( &$called ) {
				$called++;
			}
		);

		$reflection = new ReflectionClass( 'GhostKit_Icons_List' );
		$icons      = $reflection->newInstanceWithoutConstructor();

		$icons->enqueue_all_icons_assets();

		remove_all_actions( 'gkt_icons_enqueue_assets__ghostkit' );

		$this->assertSame( 1, $called );
	}
}
