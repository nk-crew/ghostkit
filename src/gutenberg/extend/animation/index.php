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
                        'hover'  => true,
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
        $has_animation_support = block_has_support( $block_type, array( 'ghostkit', 'animation' ), null );

        if ( ! $has_animation_support ) {
            return $block_content;
        }

        $animation_data = array();

        $has_reveal_support = block_has_support( $block_type, array( 'ghostkit', 'animation', 'reveal' ), null );
        $reveal_data        = _wp_array_get( $block['attrs'], array( 'ghostkit', 'animation', 'reveal' ), false );

        if ( $has_reveal_support && $reveal_data && is_array( $reveal_data ) ) {
            $animation_data['reveal'] = $reveal_data;
        }

        $animation_data = apply_filters( 'gkt_extension_animation_data', $animation_data, $block_content, $block, $block_type );

        if ( empty( $animation_data ) ) {
            return $block_content;
        }

        // Inject data attribute to block container markup.
        $processor = new WP_HTML_Tag_Processor( $block_content );

        if ( $processor->next_tag() ) {
            $animation_data_string = wp_json_encode( $animation_data );

            $processor->set_attribute( 'data-gkt-animation', esc_attr( $animation_data_string ) );
        }

        return $processor->get_updated_html();
    }

    /**
     * Add styles using JS for animation reveal feature.
     * As we need to hide blocks, we should make sure that JS is enabled in the browser.
     */
    public function add_reveal_styles() {
        ?>
        <style type="text/css">
            .ghostkit-animations-enabled [data-gkt-animation*="reveal"] {
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
