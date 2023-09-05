<?php
/**
 * Animation Extension.
 *
 * @package @@plugin_name
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class GhostKit_Deprecated_Scroll_Reveal
 */
class GhostKit_Deprecated_Scroll_Reveal {
    /**
     * GhostKit_Deprecated_Scroll_Reveal constructor.
     */
    public function __construct() {
        add_action( 'render_block', array( $this, 'migrate_deprecated_attribute' ), 10, 2 );
    }

    /**
     * Convert old `data-ghostkit-sr` attribute to the new one.
     * Or remove it if no used.
     *
     * @param  string $block_content Rendered block content.
     * @param  array  $block         Block object.
     *
     * @return string                Filtered block content.
     */
    public function migrate_deprecated_attribute( $block_content, $block ) {
        $reveal_data = _wp_array_get( $block['attrs'], array( 'ghostkit', 'animation', 'reveal' ), false );

        // Inject data attribute to block container markup.
        $tag = new WP_HTML_Tag_Processor( $block_content );

        if ( $tag->next_tag() ) {
            if ( $tag->get_attribute( 'data-ghostkit-sr' ) && $reveal_data ) {
                $tag->remove_attribute( 'data-ghostkit-sr' );
            }
        }

        return (string) $tag;
    }
}

new GhostKit_Deprecated_Scroll_Reveal();
