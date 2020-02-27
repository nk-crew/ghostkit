<?php
/**
 * Parse blocks from content and widgets
 *
 * @package @@plugin_name
 */

/**
 * GhostKit_Parse_Blocks
 */
class GhostKit_Parse_Blocks {
    /**
     * Init.
     */
    public static function init() {
        // parse blocks from post content.
        add_filter( 'wp', 'GhostKit_Parse_Blocks::maybe_parse_blocks_from_content' );
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
            if (
                isset( $post->post_content ) &&
                function_exists( 'has_blocks' ) &&
                function_exists( 'parse_blocks' ) &&
                has_blocks( $post )
            ) {
                $blocks = parse_blocks( $post->post_content );
                self::parse_blocks( $blocks, 'content' );
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
                $reusable_block = get_post( $block['attrs']['ref'] );

                if ( has_blocks( $reusable_block ) ) {
                    $post_blocks = parse_blocks( $reusable_block->post_content );
                    self::parse_blocks( $post_blocks, $location, true );
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
