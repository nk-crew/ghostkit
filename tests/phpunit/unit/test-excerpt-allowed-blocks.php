<?php
/**
 * Tests for the blocks Ghost Kit adds to automatic excerpts.
 *
 * @package ghostkit
 */

/**
 * Excerpt allowed blocks test case.
 */
class GhostkitExcerptAllowedBlocksTest extends WP_UnitTestCase {
	/**
	 * Text inside carousel slides reaches the excerpt when the carousel sits in a core wrapper block.
	 */
	public function test_carousel_slide_text_is_kept_in_excerpt() {
		$content = '<!-- wp:group --><div class="wp-block-group">'
			. '<!-- wp:ghostkit/carousel --><div class="ghostkit-carousel">'
			. '<!-- wp:ghostkit/carousel-slide --><div class="ghostkit-carousel-slide">'
			. '<!-- wp:paragraph --><p>Slide text</p><!-- /wp:paragraph -->'
			. '</div><!-- /wp:ghostkit/carousel-slide -->'
			. '</div><!-- /wp:ghostkit/carousel -->'
			. '</div><!-- /wp:group -->';

		$this->assertStringContainsString( 'Slide text', excerpt_remove_blocks( $content ) );
	}
}
