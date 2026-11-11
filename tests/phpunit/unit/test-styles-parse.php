<?php
/**
 * Tests for the CSS that the Styles extension prints from block styles.
 *
 * @package ghostkit
 */

/**
 * Styles parse tests.
 */
class StylesParseTest extends WP_UnitTestCase {

	/**
	 * A zero value reaches the page, as it does in the editor.
	 */
	public function test_zero_values_are_kept() {
		$css = GhostKit_Extension_Styles::parse(
			array(
				'.ghostkit-custom-a' => array(
					'marginTop'   => 0,
					'paddingTop'  => '0',
					'opacity'     => '0 !important',
					'--gkt-gap'   => '0',
					'marginLeft'  => '',
				),
			)
		);

		$this->assertSame(
			'.ghostkit-custom-a { margin-top: 0; padding-top: 0px; opacity: 0 !important; --gkt-gap: 0; }',
			$css
		);
	}
}
