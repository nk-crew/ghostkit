<?php
/**
 * Tests for the Table of Contents title.
 *
 * @package ghostkit
 */

/**
 * Table of Contents title test case.
 */
class GhostKitTocTitleTest extends WP_UnitTestCase {
	/**
	 * A block that keeps the default title prints it in the site language.
	 */
	public function test_default_title_is_translated() {
		$translate = static function ( $translation, $text, $domain ) {
			return 'ghostkit' === $domain && 'Table of Contents' === $text ? 'Tabla de contenidos' : $translation;
		};
		add_filter( 'gettext', $translate, 10, 3 );

		$post_id = self::factory()->post->create(
			array(
				'post_content' => '<!-- wp:ghostkit/table-of-contents /-->'
					. '<!-- wp:heading --><h2 class="wp-block-heading" id="intro">Intro</h2><!-- /wp:heading -->',
			)
		);
		$this->go_to( get_permalink( $post_id ) );
		the_post();

		$html = apply_filters( 'the_content', get_the_content() );

		remove_filter( 'gettext', $translate, 10 );

		$this->assertMatchesRegularExpression( '#<h5 class="ghostkit-toc-title">\s*Tabla de contenidos\s*</h5>#', $html );
	}
}
