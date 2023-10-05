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
        add_filter( 'render_block', array( $this, 'migrate_deprecated_attribute' ), 20, 2 );
    }

    /**
     * Parse sr config string to array. The same function placed in JS file -> parse-sr-config.js
     *
     * @param string $data - attribute data.
     *
     * @return array
     */
    public function parse_sr_config( $data ) {
        $config = array();

        $data = explode( ';', $data );

        $effect   = $data[0];
        $distance = 0;
        $scale    = 1;
        $origin   = explode( '-', $effect );

        if ( count( $origin ) === 2 ) {
            $effect = $origin[0];
            $origin = $origin[1];

            switch ( $origin ) {
                case 'up':
                    $origin = 'bottom';
                    break;
                case 'down':
                    $origin = 'top';
                    break;
                case 'right':
                    $origin = 'right';
                    break;
                case 'left':
                    $origin = 'left';
                    break;
            }
        } else {
            $origin   = 'center';
            $distance = 0;
        }

        if ( 'zoom' === $effect ) {
            $scale = 0.9;
        }

        $config = array(
            'distance' => $distance,
            'x'        => 0,
            'y'        => 0,
            'opacity'  => 0,
            'scale'    => $scale,
            'duration' => 900,
            'delay'    => 0,
        );

        // replace other data config.
        if ( count( $data ) > 1 ) {
            foreach ( $data as $item ) {
                $item_data = explode( ':', $item );

                if ( count( $item_data ) === 2 ) {
                    $config[ $item_data[0] ] = $item_data[1];
                }
            }
        }

        if ( $config['distance'] && $origin ) {
            switch ( $origin ) {
                case 'bottom':
                    $config['y'] = $config['distance'];
                    break;
                case 'top':
                    $config['y'] = -$config['distance'];
                    break;
                case 'right':
                    $config['x'] = $config['distance'];
                    break;
                case 'left':
                    $config['x'] = -$config['distance'];
                    break;
            }
        }

        unset( $config['distance'] );

        $config['scale']    = (float) $config['scale'];
        $config['duration'] = (float) $config['duration'];
        $config['delay']    = (float) $config['delay'];

        return $config;
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
            $old_data = $tag->get_attribute( 'data-ghostkit-sr' );

            if ( $old_data ) {
                // Convert old attribute data to new one.
                if ( ! $reveal_data ) {
                    $new_data = $this->parse_sr_config( $old_data );

                    if ( $new_data ) {
                        $new_data['duration'] /= 1000;
                        $new_data['delay']    /= 1000;

                        $new_data_string = "x:{$new_data['x']};y:{$new_data['y']};opacity:{$new_data['opacity']};scale:{$new_data['scale']};transition-duration:{$new_data['duration']};transition-delay:{$new_data['delay']};transition-type:easing";

                        $tag->set_attribute( 'data-ghostkit-animation-reveal', $new_data_string );
                    }
                }

                // Remove old attribute if new reveal animation is available.
                $tag->remove_attribute( 'data-ghostkit-sr' );
            }
        }

        return (string) $tag;
    }
}

new GhostKit_Deprecated_Scroll_Reveal();
