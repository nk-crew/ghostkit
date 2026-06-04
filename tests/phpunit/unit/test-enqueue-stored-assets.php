<?php
/**
 * Tests for GhostKit_Assets::enqueue_stored_assets().
 *
 * @package ghostkit
 */

/**
 * Enqueue stored assets tests.
 */
class EnqueueStoredAssetsTest extends WP_UnitTestCase {

	/**
	 * Reset stored assets between tests.
	 */
	public function tear_down() {
		$this->reset_stored_assets();
		parent::tear_down();
	}

	/**
	 * Stored styles should enqueue in priority order and clear the store flag.
	 */
	public function test_enqueue_stored_styles_respects_priority() {
		wp_register_style( 'ghostkit-enqueue-test-a', false );
		wp_register_style( 'ghostkit-enqueue-test-b', false );

		GhostKit_Assets::store_used_assets( 'ghostkit-enqueue-test-b', true, 'style', 20 );
		GhostKit_Assets::store_used_assets( 'ghostkit-enqueue-test-a', true, 'style', 5 );

		GhostKit_Assets::enqueue_stored_assets( 'style' );

		$this->assertTrue( wp_style_is( 'ghostkit-enqueue-test-a', 'enqueued' ) );
		$this->assertTrue( wp_style_is( 'ghostkit-enqueue-test-b', 'enqueued' ) );

		$stored = $this->get_stored_assets();
		$this->assertFalse( $stored['style']['ghostkit-enqueue-test-a']['value'] );
		$this->assertFalse( $stored['style']['ghostkit-enqueue-test-b']['value'] );
	}

	/**
	 * Custom CSS entries should print via add_custom_css.
	 */
	public function test_enqueue_stored_custom_css() {
		GhostKit_Assets::store_used_assets(
			'ghostkit-enqueue-test-custom-css',
			'.ghostkit-test { color: red; }',
			'custom-css'
		);

		GhostKit_Assets::enqueue_stored_assets( 'custom-css' );

		$this->assertTrue( wp_style_is( 'ghostkit-enqueue-test-custom-css', 'enqueued' ) );
	}

	/**
	 * @return array
	 */
	private function get_stored_assets() {
		$reflection = new ReflectionClass( 'GhostKit_Assets' );
		$property   = $reflection->getProperty( 'stored_assets' );
		$property->setAccessible( true );

		return $property->getValue();
	}

	/**
	 * Clear stored assets static state.
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
