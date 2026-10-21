<?php
/**
 * Tests for the effects reveal styles printed in wp_head.
 *
 * @package ghostkit
 */

/**
 * Reveal styles tests.
 */
class GhostKitEffectsRevealStylesTest extends WP_UnitTestCase {
	/**
	 * Effects extension instance under test.
	 *
	 * @var GhostKit_Extension_Effects
	 */
	private $effects;

	/**
	 * Set up test case.
	 */
	public function set_up() {
		parent::set_up();

		$reflection    = new ReflectionClass( 'GhostKit_Extension_Effects' );
		$this->effects = $reflection->newInstanceWithoutConstructor();

		wp_dequeue_script( 'ghostkit-extension-effects' );
	}

	/**
	 * Tear down test case.
	 */
	public function tear_down() {
		global $wp_actions;
		unset( $wp_actions['wp_head'] );

		wp_dequeue_script( 'ghostkit-extension-effects' );

		parent::tear_down();
	}

	/**
	 * Render a paragraph with a reveal effect through the effects extension.
	 *
	 * @return string
	 */
	private function render_reveal_paragraph() {
		$block = array(
			'blockName' => 'core/paragraph',
			'attrs'     => array(
				'ghostkit' => array(
					'effects' => array(
						'reveal' => array( 'opacity' => 0 ),
					),
				),
			),
		);

		return $this->effects->render_block(
			'<p>Reveal</p>',
			$block,
			WP_Block_Type_Registry::get_instance()->get_registered( 'core/paragraph' )
		);
	}

	/**
	 * A page without effects gets no reveal styles.
	 */
	public function test_head_has_no_reveal_styles_without_effects() {
		ob_start();
		$this->effects->add_reveal_styles();

		$this->assertSame( '', ob_get_clean() );
	}

	/**
	 * A page whose effects script is enqueued gets the reveal styles once.
	 */
	public function test_head_prints_reveal_styles_when_effects_are_used() {
		wp_register_script( 'ghostkit-extension-effects', 'effects.js', array(), '1', true );
		wp_enqueue_script( 'ghostkit-extension-effects' );

		ob_start();
		$this->effects->add_reveal_styles();
		$this->effects->add_reveal_styles();
		$output = ob_get_clean();

		$this->assertSame( 1, substr_count( $output, '.ghostkit-effects-enabled .ghostkit-effects-reveal' ) );
		$this->assertSame( 1, substr_count( $output, "'ghostkit-effects-enabled'" ) );
	}

	/**
	 * A reveal block rendered after wp_head carries the styles itself, once.
	 */
	public function test_block_rendered_after_head_prints_reveal_styles_once() {
		global $wp_actions;
		unset( $wp_actions['wp_head'] );

		$before_head = $this->render_reveal_paragraph();

		// Mark wp_head as done without printing the whole head.
		$wp_actions['wp_head'] = 1;

		$first  = $this->render_reveal_paragraph();
		$second = $this->render_reveal_paragraph();

		$this->assertStringNotContainsString( '<style', $before_head );
		$this->assertStringStartsWith( '<style type="text/css">', ltrim( $first ) );
		$this->assertStringContainsString( 'class="ghostkit-effects-reveal"', $first );
		$this->assertStringNotContainsString( '<style', $second );
	}
}
