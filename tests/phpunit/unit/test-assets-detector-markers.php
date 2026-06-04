<?php
/**
 * Pure detection tests for GhostKit_Assets_Detector markers.
 *
 * @package ghostkit
 */

/**
 * Assets detector marker tests.
 */
class AssetsDetectorMarkersTest extends WP_UnitTestCase {

	/**
	 * @param array  $block   Block array.
	 * @param string $context parse|render.
	 * @param string $content Rendered content for render context.
	 * @return array{styles: string[], scripts: string[]}
	 */
	private function detect( array $block, $context = 'parse', $content = '' ) {
		return GhostKit_Assets_Detector::detect_from_block( $block, $context, $content );
	}

	/**
	 * Badge class in className should require ghostkit CSS only.
	 */
	public function test_badge_classname_adds_ghostkit_style_only() {
		$assets = $this->detect(
			array(
				'blockName' => 'core/paragraph',
				'attrs'     => array(
					'className' => 'ghostkit-badge',
				),
			)
		);

		$this->assertContains( 'ghostkit', $assets['styles'] );
		$this->assertNotContains( 'ghostkit', $assets['scripts'] );
	}

	/**
	 * Display utility class should require ghostkit CSS.
	 */
	public function test_display_class_adds_ghostkit_style() {
		$assets = $this->detect(
			array(
				'blockName' => 'core/paragraph',
				'attrs'     => array(
					'className' => 'ghostkit-d-md-none',
				),
			)
		);

		$this->assertContains( 'ghostkit', $assets['styles'] );
	}

	/**
	 * Paragraph columns prefix in HTML should require ghostkit CSS.
	 */
	public function test_paragraph_columns_marker_in_content() {
		$assets = $this->detect(
			array(
				'blockName' => 'core/paragraph',
				'innerHTML' => '<p class="ghostkit-paragraph-columns-2">Columns</p>',
			)
		);

		$this->assertContains( 'ghostkit', $assets['styles'] );
	}

	/**
	 * Prefix markers should match a class token in a longer className list.
	 */
	public function test_paragraph_columns_prefix_in_classname_list() {
		$assets = $this->detect(
			array(
				'blockName' => 'core/paragraph',
				'attrs'     => array(
					'className' => 'lala test ghostkit-paragraph-columns-2 wow',
				),
			)
		);

		$this->assertContains( 'ghostkit', $assets['styles'] );
	}

	/**
	 * Prefix markers should not match when the prefix appears only inside another token.
	 */
	public function test_paragraph_columns_prefix_not_inside_unrelated_token() {
		$assets = $this->detect(
			array(
				'blockName' => 'core/paragraph',
				'attrs'     => array(
					'className' => 'foo-not-ghostkit-paragraph-columns-2',
				),
			)
		);

		$this->assertNotContains( 'ghostkit', $assets['styles'] );
	}

	/**
	 * ghostkit.styles attr should require ghostkit CSS without main JS.
	 */
	public function test_ghostkit_styles_attr_without_scripts() {
		$assets = $this->detect(
			array(
				'blockName' => 'core/paragraph',
				'attrs'     => array(
					'ghostkit' => array(
						'styles' => array(
							'margin-top' => '10px',
						),
					),
				),
			)
		);

		$this->assertContains( 'ghostkit', $assets['styles'] );
		$this->assertNotContains( 'ghostkit', $assets['scripts'] );
	}

	/**
	 * Effects in attrs should require effects script (ghostkit is a script dependency).
	 */
	public function test_effects_attrs_without_rendered_html() {
		$assets = $this->detect(
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

		$this->assertContains( 'ghostkit-extension-effects', $assets['scripts'] );
		$this->assertNotContains( 'ghostkit', $assets['scripts'] );
	}

	/**
	 * Styled list variant should add list variant script.
	 */
	public function test_styled_list_variant_script() {
		$assets = $this->detect(
			array(
				'blockName' => 'core/list',
				'attrs'     => array(
					'className' => 'is-style-styled',
				),
			)
		);

		$this->assertContains( 'ghostkit-style-variant-core-list', $assets['scripts'] );
		$this->assertContains( 'ghostkit', $assets['styles'] );
	}

	/**
	 * get_block_content_string should merge innerHTML, innerContent, and rendered HTML.
	 */
	public function test_get_block_content_string_merges_sources() {
		$string = GhostKit_Assets_Detector::get_block_content_string(
			array(
				'innerHTML'    => '<span class="inner-a">',
				'innerContent' => array( '<span class="inner-b">', null, '</span>' ),
			),
			'<span class="rendered">'
		);

		$this->assertStringContainsString( 'inner-a', $string );
		$this->assertStringContainsString( 'inner-b', $string );
		$this->assertStringContainsString( 'rendered', $string );
	}
}
