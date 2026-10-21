<?php
/**
 * Effects Extension.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Extension_Effects
 */
class GhostKit_Extension_Effects {
	/**
	 * GhostKit_Extension_Effects constructor.
	 */
	public function __construct() {
		GhostKit_Extensions::register(
			'effects',
			array(
				'default_supports' => array(
					'effects' => array(
						'reveal'     => true,
						'mouseHover' => true,
						'mousePress' => true,
						'mouseMove'  => true,
						'scroll'     => true,
						'loop'       => true,
					),
				),
				'render_block'     => array( $this, 'render_block' ),
			)
		);

		add_action( 'wp_head', array( $this, 'add_reveal_styles' ) );
	}

	/**
	 * Renders attributes to the block wrapper.
	 *
	 * @param  string        $block_content Rendered block content.
	 * @param  array         $block         Block object.
	 * @param  WP_Block_Type $block_type    Block type.
	 *
	 * @return string                Filtered block content.
	 */
	public function render_block( $block_content, $block, $block_type ) {
		global $wp_version;
		$has_effects_support = block_has_support( $block_type, array( 'ghostkit', 'effects' ), null );

		if ( ! $has_effects_support ) {
			return $block_content;
		}

		$effects_data = array();

		$has_reveal_support = block_has_support( $block_type, array( 'ghostkit', 'effects', 'reveal' ), null );
		$reveal_data        = _wp_array_get( $block['attrs'], array( 'ghostkit', 'effects', 'reveal' ), false );

		if ( $has_reveal_support && $reveal_data && is_array( $reveal_data ) ) {
			$effects_data['reveal'] = $reveal_data;
		}

		$effects_data = apply_filters( 'gkt_extension_effects_data', $effects_data, $block_content, $block, $block_type );

		if ( empty( $effects_data ) ) {
			return $block_content;
		}

		// Inject data attribute to block container markup.
		$processor = new WP_HTML_Tag_Processor( $block_content );

		if ( $processor->next_tag() ) {
			$effects_data_string = wp_json_encode( $effects_data );

			// WP 6.9+ automatically escapes attributes in WP_HTML_Tag_Processor.
			// For older versions, we need to manually escape to prevent XSS.
			//
			// Possible related issues:
			// - https://github.com/WordPress/wordpress-develop/pull/10591
			// - https://core.trac.wordpress.org/ticket/64340 .
			if ( version_compare( $wp_version, '6.9', '<' ) ) {
				$effects_data_string = esc_attr( $effects_data_string );
			}

			$processor->set_attribute( 'data-gkt-effects', $effects_data_string );

			if ( ! empty( $effects_data['reveal'] ) ) {
				$processor->add_class( 'ghostkit-effects-reveal' );
			}

			$processor = apply_filters( 'gkt_extension_effects_tag_processor', $processor, $effects_data, $block_content, $block, $block_type );
		}

		return $processor->get_updated_html();
	}

	/**
	 * Add styles using JS for effects reveal feature.
	 * As we need to hide blocks, we should make sure that
	 *  1. JS is enabled in the browser.
	 *  2. User has not set reduced motion in the OS settings.
	 */
	public function add_reveal_styles() {
		?>
		<style type="text/css">
			.ghostkit-effects-enabled .ghostkit-effects-reveal {
				pointer-events: none;
				visibility: hidden;
			}
		</style>
		<script>
			if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				document.documentElement.classList.add(
					'ghostkit-effects-enabled'
				);
			}
		</script>
		<?php
	}
}

new GhostKit_Extension_Effects();
