<?php
/**
 * Tests for gkt_parse_blocks_content_sources filter.
 *
 * @package ghostkit
 */

/**
 * Parse blocks content sources tests.
 */
class ParseBlocksContentSourcesTest extends WP_UnitTestCase {

	/**
	 * Additional content sources should trigger parse and asset detection.
	 */
	public function test_content_sources_filter_triggers_parse() {
		$this->reset_stored_assets();

		$content = '<!-- wp:paragraph {"className":"ghostkit-badge"} -->
<p class="ghostkit-badge">Extra</p>
<!-- /wp:paragraph -->';

		add_filter(
			'gkt_parse_blocks_content_sources',
			function () use ( $content ) {
				return array(
					array(
						'content'  => $content,
						'location' => 'content',
					),
				);
			}
		);

		GhostKit_Parse_Blocks::maybe_parse_blocks_from_content_sources();

		remove_all_filters( 'gkt_parse_blocks_content_sources' );

		$stored = $this->read_stored_assets();

		$this->assertArrayHasKey( 'ghostkit', $stored['style'] );
	}

	/**
	 * @return array
	 */
	private function read_stored_assets() {
		$reflection = new ReflectionClass( 'GhostKit_Assets' );
		$property   = $reflection->getProperty( 'stored_assets' );
		$property->setAccessible( true );

		return $property->getValue();
	}

	/**
	 * Clear stored assets.
	 */
	private function reset_stored_assets() {
		$reflection = new ReflectionClass( 'GhostKit_Assets' );
		$property   = $reflection->getProperty( 'stored_assets' );
		$property->setAccessible( true );
		$property->setValue(
			null,
			array(
				'script'     => array(),
				'style'      => array(),
				'custom-css' => array(),
			)
		);
	}
}
