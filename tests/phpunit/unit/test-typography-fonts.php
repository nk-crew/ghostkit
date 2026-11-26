<?php
/**
 * Tests for Ghost Kit typography font sources.
 *
 * @package ghostkit
 */

/**
 * Typography font source tests.
 */
class GhostKitTypographyFontsTest extends WP_UnitTestCase {

	/**
	 * Saved Google typography still renders when its category is present.
	 */
	public function test_saved_font_category_renders_without_warnings() {
		update_option(
			'ghostkit_typography',
			array( 'ghostkit_typography' => '{"body":{"fontFamily":"Inter","fontFamilyCategory":"google-fonts"}}' )
		);

		$styles = GhostKit_Typography::generate_typography_styles();

		$this->assertStringContainsString( 'font-family: "Inter", sans-serif;', $styles['front'] );
	}

	/**
	 * Valid WordPress presets are offered once the current theme has font families.
	 */
	public function test_native_presets_match_core_css_when_available() {
		$families = array(
			array(
				'slug'       => 'local-cardo',
				'name'       => 'Cardo',
				'fontFamily' => 'Cardo, serif',
			),
			array(
				'slug'       => 'local-inter',
				'name'       => 'Local Inter',
				'fontFamily' => 'Inter, sans-serif',
			),
			array(
				'slug'       => '0',
				'name'       => 'Numeric Fixture',
				'fontFamily' => 'monospace',
			),
			array(
				'slug'       => 'नमस्ते',
				'name'       => 'International Fixture',
				'fontFamily' => 'serif',
			),
			array(
				'slug'       => 'book-📚',
				'name'       => 'Symbol Fixture',
				'fontFamily' => 'system-ui',
			),
		);
		$theme = static function ( $theme_json ) use ( $families ) {
			return $theme_json->update_with(
				array(
					'version'  => 3,
					'settings' => array( 'typography' => array( 'fontFamilies' => $families ) ),
				)
			);
		};
		$previous_theme = get_stylesheet();
		switch_theme( 'empty-theme' );
		set_current_screen( 'dashboard' );

		try {
			$this->assertArrayNotHasKey( 'font-library', apply_filters( 'gkt_fonts_list', array() ) );
			add_filter( 'wp_theme_json_data_theme', $theme );
			wp_clean_theme_json_cache();

			$fonts   = apply_filters( 'gkt_fonts_list', array() );
			$choices = array_column( $fonts['font-library']['fonts'], 'name' );
			$core    = wp_get_global_stylesheet( array( 'variables' ) );

			foreach ( $families as $family ) {
				$slug     = $family['slug'];
				$variable = '--wp--preset--font-family--' . $slug;
				$this->assertContains( $slug, $choices );
				$this->assertStringContainsString( $variable . ':', $core );

				update_option(
					'ghostkit_typography',
					array(
						'ghostkit_typography' => wp_json_encode(
							array(
								'body' => array(
									'fontFamily'         => $slug,
									'fontFamilyCategory' => 'font-library',
								),
							)
						),
					)
				);
				$styles = GhostKit_Typography::generate_typography_styles();
				$this->assertStringContainsString( 'font-family: var(' . $variable . ', sans-serif);', $styles['front'] );
			}
		} finally {
			remove_filter( 'wp_theme_json_data_theme', $theme );
			switch_theme( $previous_theme );
			wp_clean_theme_json_cache();
			set_current_screen( 'front' );
		}
	}
}
