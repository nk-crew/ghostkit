<?php
/**
 * Tests for blocks that opt out of Ghost Kit extensions through `supports.ghostkit`.
 *
 * @package ghostkit
 */

/**
 * Extensions opt-out test case.
 */
class GhostKitExtensionsOptOutTest extends WP_UnitTestCase {
	/**
	 * Block types registered by a test.
	 *
	 * @var array
	 */
	private $registered = array();

	/**
	 * Tear down test case.
	 */
	public function tear_down() {
		foreach ( $this->registered as $name ) {
			unregister_block_type( $name );
		}
		$this->registered = array();

		parent::tear_down();
	}

	/**
	 * Register a block type the way WordPress does on `init`, with Ghost Kit supports applied.
	 *
	 * @param string $name     block name.
	 * @param mixed  $supports `supports.ghostkit` value, or null to leave the key out.
	 *
	 * @return WP_Block_Type
	 */
	private function register_block( $name, $supports ) {
		$args = array(
			'render_callback' => function () {
				return '<div class="opt-out-test">Content</div>';
			},
		);

		if ( null !== $supports ) {
			$args['supports'] = array( 'ghostkit' => $supports );
		}

		$block_type         = register_block_type( $name, $args );
		$this->registered[] = $name;

		GhostKit_Extensions::register_attribute( $block_type );

		return $block_type;
	}

	/**
	 * Rows: block name, `supports.ghostkit`, whether Ghost Kit support is on, whether spacings are on, whether effects are on.
	 *
	 * @return array
	 */
	public function supports_rows() {
		return array(
			'core block without the key gets every extension'   => array( 'core/gk-opt-out-default', null, true, true, true ),
			'Ghost Kit block without the key gets every extension' => array( 'ghostkit/gk-opt-out-default', null, true, true, true ),
			'core block with true gets every extension'          => array( 'core/gk-opt-out-true', true, true, true, true ),
			'core block with false gets none'                    => array( 'core/gk-opt-out-false', false, false, false, false ),
			'Ghost Kit block with false gets none'               => array( 'ghostkit/gk-opt-out-false', false, false, false, false ),
			'one extension turned off keeps the others'          => array( 'core/gk-opt-out-spacings', array( 'spacings' => false ), true, false, true ),
			'third-party block with false gets none'             => array( 'my-plugin/gk-opt-out-false', false, false, false, false ),
		);
	}

	/**
	 * An explicit `false` opts a block out, and the defaults stay for every other block.
	 *
	 * @dataProvider supports_rows
	 *
	 * @param string $name             block name.
	 * @param mixed  $supports         `supports.ghostkit` value.
	 * @param bool   $expect_ghostkit  Ghost Kit support expected.
	 * @param bool   $expect_spacings  Spacings extension expected.
	 * @param bool   $expect_effects   Effects extension expected.
	 */
	public function test_supports( $name, $supports, $expect_ghostkit, $expect_spacings, $expect_effects ) {
		$block_type = $this->register_block( $name, $supports );

		$this->assertSame( $expect_ghostkit, block_has_support( $block_type, array( 'ghostkit' ), false ), 'ghostkit' );
		$this->assertSame( $expect_spacings, block_has_support( $block_type, array( 'ghostkit', 'spacings' ), false ), 'spacings' );
		$this->assertSame( $expect_effects, block_has_support( $block_type, array( 'ghostkit', 'effects' ), false ), 'effects' );
	}

	/**
	 * A core block opted out keeps the `ghostkit` attribute, so content saved earlier still validates.
	 */
	public function test_opted_out_core_block_keeps_attribute() {
		$block_type = $this->register_block( 'core/gk-opt-out-attribute', false );

		$this->assertArrayHasKey( 'ghostkit', $block_type->attributes );
	}

	/**
	 * The `register_block_type_args` route opts a block out, and saved effects no longer render.
	 */
	public function test_filter_opt_out_skips_effects_render() {
		$opt_out = function ( $args, $name ) {
			if ( 'ghostkit/gk-opt-out-filter' === $name ) {
				$args['supports']             = $args['supports'] ?? array();
				$args['supports']['ghostkit'] = false;
			}

			return $args;
		};
		add_filter( 'register_block_type_args', $opt_out, 10, 2 );
		$this->register_block( 'ghostkit/gk-opt-out-filter', null );
		remove_filter( 'register_block_type_args', $opt_out, 10 );

		$html = render_block(
			array(
				'blockName'    => 'ghostkit/gk-opt-out-filter',
				'attrs'        => array(
					'ghostkit' => array(
						'effects' => array(
							'reveal' => array( 'opacity' => 0 ),
						),
					),
				),
				'innerBlocks'  => array(),
				'innerHTML'    => '',
				'innerContent' => array(),
			)
		);

		$this->assertSame( '<div class="opt-out-test">Content</div>', $html );
	}
}
