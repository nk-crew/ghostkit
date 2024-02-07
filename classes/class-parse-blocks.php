<?php
/**
 * Parse blocks from content and widgets
 *
 * @package ghostkit
 */

/**
 * GhostKit_Parse_Blocks
 */
class GhostKit_Parse_Blocks {
	/**
	 * Array of content, that already parsed.
	 *
	 * @var array
	 */
	public static $parsed_content = array();

	/**
	 * Array of reusable block IDs, that already parsed.
	 *
	 * @var array
	 */
	public static $parsed_reusable_blocks = array();

	/**
	 * Init.
	 */
	public static function init() {
		add_action(
			'wp',
			function() {
				// Parse methods [classic,modern].
				$parse_methods = apply_filters( 'gkt_parse_blocks_methods', current_theme_supports( 'block-templates' ) ? array( 'modern' ) : array( 'classic' ) );

				// Simple use `render_block` in FSE themes to enqueue assets.
				if ( in_array( 'modern', $parse_methods, true ) ) {
					// Parse all blocks.
					add_action( 'render_block', 'GhostKit_Parse_Blocks::render_block', 11, 2 );
				}

				// Parse blocks manually from content and custom locations in Classic themes.
				if ( in_array( 'classic', $parse_methods, true ) ) {
					// parse blocks from post content.
					GhostKit_Parse_Blocks::maybe_parse_blocks_from_content();

					// parse blocks from custom locations, that uses 'the_content' filter.
					add_filter( 'the_content', 'GhostKit_Parse_Blocks::maybe_parse_blocks_from_custom_location', 8 );
					add_filter( 'widget_block_content', 'GhostKit_Parse_Blocks::maybe_parse_blocks_from_custom_location', 8 );
				}
			}
		);
	}

	/**
	 * Standard callback to parse blocks (mostly solves problem with FSE themes and blocks inside templates).
	 *
	 * @param string $block_content - block content.
	 * @param array  $block - block data.
	 *
	 * @return string
	 */
	public static function render_block( $block_content, $block ) {
		// We don't need to parse inner blocks manually, because `render_block` filter will make it for us.
		$block['innerBlocks'] = false;

		self::parse_blocks( array( $block ), 'general' );

		return $block_content;
	}

	/**
	 * Parse blocks from content.
	 */
	public static function maybe_parse_blocks_from_content() {
		global $wp_query;

		if ( is_admin() || ! isset( $wp_query->posts ) ) {
			return;
		}

		// parse all posts content.
		foreach ( $wp_query->posts as $post ) {
			if ( isset( $post->post_content ) ) {
				self::maybe_parse_blocks( $post->post_content, 'content' );
			}
		}
	}

	/**
	 * Parse blocks from custom locations.
	 *
	 * @param string $content - custom content.
	 */
	public static function maybe_parse_blocks_from_custom_location( $content ) {
		if ( is_admin() ) {
			return $content;
		}

		if ( isset( $content ) ) {
			self::maybe_parse_blocks( $content, 'content' );
		}

		return $content;
	}

	/**
	 * Maybe parse blocks.
	 *
	 * @param string $content - content.
	 * @param string $location - blocks location [content,widget].
	 */
	public static function maybe_parse_blocks( $content, $location = 'content' ) {
		if (
			isset( $content ) &&
			function_exists( 'has_blocks' ) &&
			function_exists( 'parse_blocks' ) &&
			$content &&
			has_blocks( $content )
		) {
			$is_parsed = false;

			// check if this content is already parsed.
			foreach ( self::$parsed_content as $parsed ) {
				$is_parsed = $is_parsed || $parsed === $content;
			}

			if ( ! $is_parsed ) {
				$blocks = parse_blocks( $content );
				self::parse_blocks( $blocks, $location );

				self::$parsed_content[] = $content;
			}
		}
	}

	/**
	 * Parse blocks including reusable and InnerBlocks and call action `ghostkit_parse_blocks`.
	 *
	 * @param array   $blocks - blocks array.
	 * @param string  $location - blocks location [content,widget].
	 * @param boolean $is_reusable - is from reusable block.
	 * @param boolean $is_inner_blocks - is from inner blocks.
	 */
	public static function parse_blocks( $blocks, $location = 'content', $is_reusable = false, $is_inner_blocks = false ) {
		if ( ! is_array( $blocks ) || empty( $blocks ) ) {
			return;
		}

		do_action( 'ghostkit_parse_blocks', $blocks, $location, $is_reusable, $is_inner_blocks );

		foreach ( $blocks as $block ) {
			// Reusable Blocks.
			if ( isset( $block['blockName'] ) && 'core/block' === $block['blockName'] && isset( $block['attrs']['ref'] ) ) {
				// Check if this reusable block already parsed.
				// Fixes possible error with nested reusable blocks.
				if ( ! in_array( $block['attrs']['ref'], self::$parsed_reusable_blocks, true ) ) {
					self::$parsed_reusable_blocks[] = $block['attrs']['ref'];

					$reusable_block = get_post( $block['attrs']['ref'] );

					if ( has_blocks( $reusable_block ) && isset( $reusable_block->post_content ) ) {
						$post_blocks = parse_blocks( $reusable_block->post_content );
						self::parse_blocks( $post_blocks, $location, true );
					}
				}
			}

			// Inner blocks.
			if ( isset( $block['innerBlocks'] ) ) {
				self::parse_blocks( $block['innerBlocks'], $location, $is_reusable, true );
			}
		}
	}
}

GhostKit_Parse_Blocks::init();
