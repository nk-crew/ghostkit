<?php
/**
 * Tests for the CSS generated for custom breakpoints.
 *
 * @package ghostkit
 */

/**
 * Breakpoints CSS tests.
 */
class BreakpointsCssTest extends WP_UnitTestCase {

	/**
	 * Custom small breakpoint the generation tests use.
	 *
	 * @var int
	 */
	private $custom_sm = 700;

	/**
	 * Start from default breakpoints and nothing generated.
	 */
	public function set_up() {
		parent::set_up();
		$this->reset_generated_css();
	}

	/**
	 * Leave no generated files or options behind.
	 */
	public function tear_down() {
		$this->reset_generated_css();
		parent::tear_down();
	}

	/**
	 * Remove the custom breakpoint filter, the option and the generated directory.
	 */
	private function reset_generated_css() {
		remove_filter( 'gkt_breakpoint_sm', array( $this, 'filter_sm' ) );
		delete_option( 'ghostkit_breakpoints_css' );
		GhostKit_Breakpoints::remove_dir( $this->output_dir() . '/build' );
	}

	/**
	 * Directory under uploads that holds the generated CSS.
	 *
	 * @return string
	 */
	private function output_dir() {
		$upload_dir = wp_get_upload_dir();

		return $upload_dir['basedir'] . '/ghostkit';
	}

	/**
	 * Custom small breakpoint.
	 *
	 * @return int
	 */
	public function filter_sm() {
		return $this->custom_sm;
	}

	/**
	 * Set the custom breakpoint and run the generation the way `init` does.
	 */
	private function generate_with_custom_sm() {
		add_filter( 'gkt_breakpoint_sm', array( $this, 'filter_sm' ) );
		do_action( 'gkt_before_assets_register' );
	}

	/**
	 * Only media queries with a default breakpoint value change.
	 */
	public function test_replace_changes_only_breakpoint_media_queries() {
		$css = '@media (max-width:768px){.a{max-width:768px}}@media (max-width:600px){.b{c:d}}';

		$this->assertSame(
			'@media (max-width:800px){.a{max-width:768px}}@media (max-width:600px){.b{c:d}}',
			GhostKit_Breakpoints::replace_breakpoints( $css, array( 'sm' => 800 ) )
		);
	}

	/**
	 * A custom value equal to another default is not replaced twice.
	 */
	public function test_replace_runs_in_one_pass() {
		$this->assertSame(
			'@media (max-width:992px){}@media (max-width:1100px){}',
			GhostKit_Breakpoints::replace_breakpoints(
				'@media (max-width:768px){}@media (max-width:992px){}',
				array(
					'sm' => 992,
					'md' => 1100,
				)
			)
		);
	}

	/**
	 * A fractional value from a theme keeps its fraction; an integer given as a string stays an integer.
	 */
	public function test_replace_keeps_fractional_values() {
		$this->assertSame(
			'@media (max-width:777.98px){}@media (min-width:777.98px){}@media (max-width:1077px){}',
			GhostKit_Breakpoints::replace_breakpoints(
				'@media (max-width:768px){}@media (min-width:768px){}@media (max-width:992px){}',
				array(
					'sm' => 770 + 8 - 0.02,
					'md' => '1077',
				)
			)
		);
	}

	/**
	 * Generation writes the LTR and RTL files that carry breakpoints and records them.
	 */
	public function test_generation_writes_ltr_and_rtl_twins() {
		$this->generate_with_custom_sm();

		$stored = get_option( 'ghostkit_breakpoints_css' );

		$this->assertIsArray( $stored );
		$this->assertContains( 'build/gutenberg/style.css', $stored['files'] );
		$this->assertContains( 'build/gutenberg/style-rtl.css', $stored['files'] );
		$this->assertNotContains( 'build/gutenberg/blocks/video/styles/style.css', $stored['files'] );

		// phpcs:ignore
		$css = file_get_contents( $this->output_dir() . '/build/gutenberg/style.css' );

		$this->assertStringContainsString( '(max-width:700px)', $css );
		$this->assertStringNotContainsString( '(max-width:768px)', $css );
	}

	/**
	 * The src filter swaps recorded files only, with the hash as version.
	 */
	public function test_style_src_swapped_for_generated_file_only() {
		$this->generate_with_custom_sm();

		$stored     = get_option( 'ghostkit_breakpoints_css' );
		$plugin_url = ghostkit()->plugin_url;
		$upload_dir = wp_get_upload_dir();

		$this->assertSame(
			$upload_dir['baseurl'] . '/ghostkit/build/gutenberg/style.css?ver=' . $stored['hash'],
			apply_filters( 'style_loader_src', $plugin_url . 'build/gutenberg/style.css?ver=1', 'ghostkit' )
		);

		$video_src = $plugin_url . 'build/gutenberg/blocks/video/styles/style.css?ver=1';

		$this->assertSame( $video_src, apply_filters( 'style_loader_src', $video_src, 'ghostkit-block-video' ) );
	}

	/**
	 * Going back to the defaults removes the option and the generated directory.
	 */
	public function test_default_breakpoints_remove_generated_css() {
		$this->generate_with_custom_sm();

		$this->assertFileExists( $this->output_dir() . '/build/gutenberg/style.css' );

		remove_filter( 'gkt_breakpoint_sm', array( $this, 'filter_sm' ) );
		do_action( 'gkt_before_assets_register' );

		$src = ghostkit()->plugin_url . 'build/gutenberg/style.css?ver=1';

		$this->assertFalse( get_option( 'ghostkit_breakpoints_css' ) );
		$this->assertDirectoryDoesNotExist( $this->output_dir() . '/build' );
		$this->assertSame( $src, apply_filters( 'style_loader_src', $src, 'ghostkit' ) );
	}

	/**
	 * Every width in a built media query is a default breakpoint or an allowed constant.
	 *
	 * The replacement only knows the four default values, so a derived value
	 * such as `767.98px` would ship unreplaced. This keeps the build free of them.
	 */
	public function test_build_media_queries_use_known_widths() {
		$known = array( '576px', '768px', '992px', '1200px', '450px', '600px', '840px' );
		$found = array();

		$iterator = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator( ghostkit()->plugin_path . 'build', FilesystemIterator::SKIP_DOTS )
		);

		foreach ( $iterator as $file ) {
			if ( 'css' !== $file->getExtension() ) {
				continue;
			}

			// phpcs:ignore
			preg_match_all( '/@media[^{;]*\{/', file_get_contents( $file->getPathname() ), $preludes );

			foreach ( $preludes[0] as $prelude ) {
				preg_match_all( '/\(\s*(?:min|max)-width\s*:\s*([^)]+?)\s*\)/', $prelude, $widths );

				$found = array_merge( $found, $widths[1] );
			}
		}

		$found = array_values( array_unique( $found ) );

		$this->assertContains( '768px', $found );
		$this->assertSame( array(), array_values( array_diff( $found, $known ) ) );
	}
}
