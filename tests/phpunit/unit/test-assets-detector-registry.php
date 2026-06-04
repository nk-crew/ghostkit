<?php
/**
 * Registry-based detection after WordPress init.
 *
 * @package ghostkit
 */

/**
 * Assets detector registry tests.
 */
class AssetsDetectorRegistryTest extends WP_UnitTestCase {

	/**
	 * Alert block should expose block stylesheet and script handles from registry.
	 */
	public function test_alert_block_registry_handles() {
		if ( ! WP_Block_Type_Registry::get_instance()->is_registered( 'ghostkit/alert' ) ) {
			$this->markTestSkipped( 'ghostkit/alert is not registered.' );
		}

		$assets = GhostKit_Assets_Detector::detect_from_block(
			array(
				'blockName' => 'ghostkit/alert',
			)
		);

		$this->assertContains( 'ghostkit-block-alert', $assets['styles'] );
		$this->assertContains( 'ghostkit-block-alert', $assets['scripts'] );
		$this->assertContains( 'ghostkit', $assets['styles'] );
	}

	/**
	 * detect_from_blocks should merge nested innerBlocks.
	 */
	public function test_detect_from_blocks_includes_inner_blocks() {
		if ( ! WP_Block_Type_Registry::get_instance()->is_registered( 'ghostkit/button' ) ) {
			$this->markTestSkipped( 'ghostkit/button is not registered.' );
		}

		$assets = GhostKit_Assets_Detector::detect_from_blocks(
			array(
				array(
					'blockName'   => 'core/paragraph',
					'attrs'       => array(
						'className' => 'ghostkit-badge',
					),
					'innerBlocks' => array(
						array(
							'blockName' => 'ghostkit/button',
						),
					),
				),
			)
		);

		$this->assertContains( 'ghostkit', $assets['styles'] );
		$this->assertContains( 'ghostkit-block-button', $assets['styles'] );
	}

	/**
	 * Render context should not re-collect block.json handles (parse-time only).
	 */
	public function test_render_context_skips_registry_handles() {
		if ( ! WP_Block_Type_Registry::get_instance()->is_registered( 'ghostkit/alert' ) ) {
			$this->markTestSkipped( 'ghostkit/alert is not registered.' );
		}

		$assets = GhostKit_Assets_Detector::detect_from_block(
			array(
				'blockName' => 'ghostkit/alert',
			),
			'render'
		);

		$this->assertNotContains( 'ghostkit-block-alert', $assets['styles'] );
		$this->assertNotContains( 'ghostkit-block-alert', $assets['scripts'] );
	}

	/**
	 * Render context should still detect extension assets from attrs and HTML.
	 */
	public function test_render_context_detects_style_variant_from_classname() {
		$assets = GhostKit_Assets_Detector::detect_from_block(
			array(
				'blockName' => 'core/list',
				'attrs'     => array(
					'className' => 'is-style-styled',
				),
			),
			'render'
		);

		$this->assertContains( 'ghostkit-style-variant-core-list', $assets['scripts'] );
		$this->assertContains( 'ghostkit', $assets['styles'] );
	}

	/**
	 * gkt_detect_block_assets filter should extend detection.
	 */
	public function test_gkt_detect_block_assets_filter() {
		add_filter(
			'gkt_detect_block_assets',
			function ( $assets ) {
				$assets['styles'][] = 'ghostkit-test-filter-style';
				return $assets;
			}
		);

		$assets = GhostKit_Assets_Detector::detect_from_block(
			array(
				'blockName' => 'core/paragraph',
			)
		);

		remove_all_filters( 'gkt_detect_block_assets' );

		$this->assertContains( 'ghostkit-test-filter-style', $assets['styles'] );
	}

	/**
	 * store_detected_assets should queue registered handles for enqueue.
	 */
	public function test_store_detected_assets_queues_registered_handles() {
		wp_register_style( 'ghostkit-detector-test-style', false );
		wp_register_script( 'ghostkit-detector-test-script', false );

		GhostKit_Assets_Detector::store_detected_assets(
			array(
				'styles'  => array( 'ghostkit-detector-test-style' ),
				'scripts' => array( 'ghostkit-detector-test-script' ),
			)
		);

		$stored = $this->get_stored_assets();

		$this->assertArrayHasKey( 'ghostkit-detector-test-style', $stored['style'] );
		$this->assertArrayHasKey( 'ghostkit-detector-test-script', $stored['script'] );
	}

	/**
	 * Render-time enqueue should work for assets only visible during render.
	 */
	public function test_enqueue_detected_assets_enqueues_registered_handles() {
		wp_register_style( 'ghostkit-detector-render-style', false );
		wp_register_script( 'ghostkit-detector-render-script', false );

		GhostKit_Assets_Detector::enqueue_detected_assets(
			array(
				'styles'  => array( 'ghostkit-detector-render-style' ),
				'scripts' => array( 'ghostkit-detector-render-script' ),
			)
		);

		$this->assertTrue( wp_style_is( 'ghostkit-detector-render-style', 'enqueued' ) );
		$this->assertTrue( wp_script_is( 'ghostkit-detector-render-script', 'enqueued' ) );
	}

	/**
	 * Effects attrs should enqueue at render time even with empty rendered HTML.
	 */
	public function test_render_block_enqueue_assets_uses_attrs_without_rendered_html() {
		wp_register_script( 'ghostkit', false );
		wp_register_script( 'ghostkit-extension-effects', false, array( 'ghostkit' ) );

		$assets = new GhostKit_Assets();
		$assets->render_block_enqueue_assets(
			'',
			array(
				'blockName' => 'core/paragraph',
				'attrs'     => array(
					'ghostkit' => array(
						'effects' => array(
							'opacity' => 1,
						),
					),
				),
			)
		);

		$this->assertTrue( wp_script_is( 'ghostkit-extension-effects', 'enqueued' ) );
	}

	/**
	 * Read stored assets via reflection (private static).
	 *
	 * @return array
	 */
	private function get_stored_assets() {
		$reflection = new ReflectionClass( 'GhostKit_Assets' );
		$property   = $reflection->getProperty( 'stored_assets' );
		$property->setAccessible( true );

		return $property->getValue();
	}
}
