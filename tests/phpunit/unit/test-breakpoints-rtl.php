<?php
/**
 * Tests for the RTL stylesheets of the plugin styles.
 *
 * @package ghostkit
 */

/**
 * Breakpoints RTL tests.
 */
class BreakpointsRtlTest extends WP_UnitTestCase {

	/**
	 * Styles registered by the plugin on `init`, kept intact for the other tests.
	 *
	 * @var WP_Styles
	 */
	private $old_wp_styles;

	/**
	 * Work on a copy of the registered styles.
	 */
	public function set_up() {
		parent::set_up();
		$this->old_wp_styles  = wp_styles();
		$GLOBALS['wp_styles'] = clone $this->old_wp_styles;
	}

	/**
	 * Put the registered styles and the screen back.
	 */
	public function tear_down() {
		$GLOBALS['wp_styles'] = $this->old_wp_styles;
		set_current_screen( 'front' );
		parent::tear_down();
	}

	/**
	 * Every plugin stylesheet with an RTL twin is printed as that twin on an RTL site.
	 */
	public function test_rtl_href_uses_rtl_file() {
		wp_styles()->text_direction = 'rtl';

		// Frontend stylesheet, registered on `init`.
		$this->assertRtlTwin( 'ghostkit', 'build/gutenberg/style-rtl.css' );

		// Editor stylesheet, registered for the block editor in admin.
		set_current_screen( 'post' );
		ghostkit()->enqueue_block_assets();
		$this->assertRtlTwin( 'ghostkit-editor', 'build/gutenberg/editor-rtl.css' );

		// Admin and settings stylesheets, registered on `admin_enqueue_scripts`.
		set_current_screen( 'dashboard' );
		do_action( 'admin_enqueue_scripts', 'index.php' );
		$this->assertRtlTwin( 'ghostkit-admin', 'build/assets/admin/css/admin-rtl.css' );
		$this->assertRtlTwin( 'ghostkit-settings', 'build/settings/style-rtl.css' );
	}

	/**
	 * Print one registered style and expect the RTL twin in its href.
	 *
	 * @param string $handle - Style handle.
	 * @param string $file - Path of the RTL twin inside the plugin.
	 */
	private function assertRtlTwin( $handle, $file ) {
		$this->assertTrue( wp_style_is( $handle, 'registered' ), $handle );

		ob_start();
		wp_styles()->do_item( $handle );
		$html = ob_get_clean();

		$this->assertStringContainsString( $file, $html, $handle );
	}
}
