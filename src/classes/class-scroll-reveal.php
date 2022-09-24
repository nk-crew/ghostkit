<?php
/**
 * Scroll Reveal extension noscript fix.
 *
 * @package @@plugin_name
 */

/**
 * GhostKit_Scroll_Reveal
 */
class GhostKit_Scroll_Reveal {
    /**
     * GhostKit_Scroll_Reveal constructor.
     */
    public function __construct() {
        add_action( 'wp_head', array( $this, 'add_scroll_reveal_styles' ) );
    }

    /**
     * Add styles using JS for scroll reveal feature.
     * As we need to hide blocks, we should make sure that JS is enabled in the browser.
     */
    public function add_scroll_reveal_styles() {
        ?>
        <style type="text/css">
            .ghostkit-sr-enabled [data-ghostkit-sr] {
                pointer-events: none;
                visibility: hidden;
            }
        </style>
        <script>
            document.documentElement.classList.add(
                'ghostkit-sr-enabled'
            );
        </script>
        <?php
    }
}

new GhostKit_Scroll_Reveal();
