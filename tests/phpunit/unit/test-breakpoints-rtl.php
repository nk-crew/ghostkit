<?php
/**
 * Tests for the RTL stylesheet of the plugin styles.
 *
 * @package ghostkit
 */

/**
 * Breakpoints RTL tests.
 */
class BreakpointsRtlTest extends WP_UnitTestCase {

	/**
	 * With default breakpoints an RTL site gets the `-rtl.css` twin of the plugin file.
	 */
	public function test_rtl_href_uses_rtl_file() {
		$styles = wp_styles();

		$this->assertTrue( wp_style_is( 'ghostkit', 'registered' ) );

		$direction              = $styles->text_direction;
		$styles->text_direction = 'rtl';

		ob_start();
		$styles->do_item( 'ghostkit' );
		$html = ob_get_clean();

		$styles->text_direction = $direction;

		$this->assertStringContainsString( 'build/gutenberg/style-rtl.css', $html );
	}
}
