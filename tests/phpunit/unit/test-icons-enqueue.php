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
	/**
	 * Send the native registry only when the editor allows the native Icon block.
	 */
	public function test_native_icon_registry_respects_allowed_block_types() {
		if ( ! WP_Block_Type_Registry::get_instance()->is_registered( 'core/icon' ) ) {
			$this->markTestSkipped( 'WordPress does not register the native Icon block.' );
		}

		$scripts = wp_scripts();
		$before  = $scripts->get_data( 'ghostkit-helper', 'data' );
		$context = new WP_Block_Editor_Context();

		apply_filters( 'block_editor_settings_all', array( 'allowedBlockTypes' => array( 'ghostkit/icon' ) ), $context );
		$restricted = $scripts->get_data( 'ghostkit-helper', 'data' );

		apply_filters( 'block_editor_settings_all', array( 'allowedBlockTypes' => array( 'core/icon' ) ), $context );
		$unrestricted = $scripts->get_data( 'ghostkit-helper', 'data' );
		$scripts->add_data( 'ghostkit-helper', 'data', $before );

		$this->assertSame( $before, $restricted );
		$this->assertSame( 1, preg_match( '/^var ghostkitCoreIcons = (.+);$/m', $unrestricted, $matches ) );
		$icons = json_decode( $matches[1], true );
		$this->assertStringContainsString( '<path', $icons['core/plus'] );
	}

}
