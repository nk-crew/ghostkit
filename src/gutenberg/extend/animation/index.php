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
 * Class GhostKit_Extension_Animation
 */
class GhostKit_Extension_Animation {
    /**
     * GhostKit_Extension_Animation constructor.
     */
    public function __construct() {
        GhostKit_Extensions::register(
            'animation',
            array(
                'default_supports' => array(
                    'animation' => array(
                        'reveal' => true,
                        'scroll' => true,
                        'loop'   => true,
                        'mouse'  => true,
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
        $has_reveal_support = block_has_support( $block_type, array( 'ghostkit', 'animation', 'reveal' ), null );

        if ( ! $has_reveal_support ) {
            return $block_content;
        }

        $reveal_data = _wp_array_get( $block['attrs'], array( 'ghostkit', 'animation', 'reveal' ), false );

        if ( ! $reveal_data || ! is_array( $reveal_data ) ) {
            return $block_content;
        }

        // Inject data attribute to block container markup.
        $tag = new WP_HTML_Tag_Processor( $block_content );

        if ( $tag->next_tag() ) {
            $reveal_string_data = '';

            foreach ( $reveal_data as $name => $val ) {
                if ( $reveal_string_data ) {
                    $reveal_string_data .= ';';
                }

                $reveal_string_data .= $name . ':' . $val;
            }

            $tag->set_attribute( 'data-ghostkit-animation-reveal', esc_attr( $reveal_string_data ) );
        }

        return (string) $tag;
    }

    /**
     * Add styles using JS for animation reveal feature.
     * As we need to hide blocks, we should make sure that JS is enabled in the browser.
     */
    public function add_reveal_styles() {
        ?>
        <style type="text/css">
            .ghostkit-animations-enabled [data-ghostkit-animation-reveal] {
                pointer-events: none;
                visibility: hidden;
            }
        </style>
        <script>
            document.documentElement.classList.add(
                'ghostkit-animations-enabled'
            );
        </script>
        <?php
    }
}

new GhostKit_Extension_Animation();
