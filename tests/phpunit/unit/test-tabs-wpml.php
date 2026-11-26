<?php
/**
 * Tests for translating Ghost Kit tab labels.
 *
 * @package ghostkit
 */

/**
 * WPML tab translation test case.
 */
class GhostKitTabsWpmlTest extends WP_UnitTestCase {
	/**
	 * The saved markup and serialized attributes keep the same translated title.
	 */
	public function test_translated_tab_titles_match_saved_buttons() {
		$cases = array(
			array( array(), 'tab-1', 'Tab 1', 'Onglet un' ),
			array(
				array( 'tabsData' => array( array( 'slug' => 'delivery', 'title' => 'Livraison rapide' ) ) ),
				'delivery',
				'Fast <strong>delivery</strong>',
				'<strong>Livraison</strong> rapide',
			),
		);

		foreach ( $cases as list( $attrs, $slug, $original, $translation ) ) {
			$opening_html  = '<div><div role="tablist"><button role="tab" data-tab="' . $slug . '">';
			$opening_panel = '</button></div><div class="ghostkit-tabs-content">';
			$closing_html  = '</div></div>';
			$panel         = parse_blocks( '<!-- wp:ghostkit/tabs-tab-v2 {"slug":"' . $slug . '"} /-->' );

			$block = new WP_Block_Parser_Block(
				'ghostkit/tabs-v2',
				$attrs,
				$panel,
				$opening_html . $translation . $opening_panel . $closing_html,
				array( $opening_html . $original . $opening_panel, null, $closing_html )
			);
			$translated = apply_filters( 'wpml_update_strings_in_block', $block, array(), 'fr' );

			$this->assertSame( array( array( 'slug' => $slug, 'title' => $translation ) ), $translated->attrs['tabsData'] ?? null );
			$this->assertStringContainsString( $opening_html . $translation . $opening_panel, serialize_block( (array) $translated ) );
		}
	}
}
