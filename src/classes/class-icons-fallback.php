<?php
/**
 * Fallback for icons added using classes. Since v2.9.0 we use <svg> icons.
 *
 * @package @@plugin_name
 */

/**
 * GhostKit_Icons_Fallback
 */
class GhostKit_Icons_Fallback {
    /**
     * All icons for fallback.
     *
     * @var array
     */
    private $icons = array();

    /**
     * GhostKit_Icons_Fallback constructor.
     */
    public function __construct() {
        add_filter( 'gkt_icons_list', array( $this, 'update_icons_list_structure' ), 999 );

        add_action( 'ghostkit_parse_blocks', array( $this, 'parse_icons_for_fallback' ) );

        add_action( 'wp_footer', array( $this, 'wp_enqueue_foot_assets' ) );
    }

    /**
     * Convert old icons list structure to the new one.
     *
     * @param array $icons - icons list.
     *
     * @return array
     */
    public function update_icons_list_structure( $icons ) {
        foreach ( $icons as $l => $list ) {
            if ( isset( $list['icons'] ) && ! empty( $list['icons'] ) ) {
                foreach ( $list['icons'] as $i => $icon ) {
                    if ( isset( $icon['class'] ) ) {
                        $icons[ $l ]['icons'][ $i ]['fallback'] = $icon['class'];
                        unset( $icons[ $l ]['icons'][ $i ]['class'] );
                    }
                    if ( isset( $icon['preview'] ) ) {
                        $icons[ $l ]['icons'][ $i ]['svg'] = $icon['preview'];
                        unset( $icons[ $l ]['icons'][ $i ]['preview'] );
                    }
                }
            }
        }

        return $icons;
    }

    /**
     * Parse icons for fallback.
     *
     * @param array $blocks - blocks array.
     */
    public function parse_icons_for_fallback( $blocks ) {
        // Prepare blocks assets.
        foreach ( $blocks as $block ) {
            if ( ! isset( $block['blockName'] ) ) {
                continue;
            }

            // Fallback default icons.
            switch ( $block['blockName'] ) {
                case 'ghostkit/testimonial':
                    if ( ! isset( $block['attrs']['icon'] ) ) {
                        $this->icons[] = 'fas fa-quote-left';
                    }
                    if ( ! isset( $block['attrs']['starsIcon'] ) ) {
                        $this->icons[] = 'fas fa-star';
                    }
                    break;
                case 'ghostkit/alert':
                    if ( ! isset( $block['attrs']['icon'] ) ) {
                        $this->icons[] = 'fas fa-exclamation-circle';
                    }
                    $this->icons[] = 'fas fa-times';
                    break;
                case 'ghostkit/icon-box':
                    if ( ! isset( $block['attrs']['icon'] ) ) {
                        $this->icons[] = 'fab fa-wordpress-simple';
                    }
                    break;
                case 'ghostkit/accordion-item':
                    if ( ! isset( $block['attrs']['collapseIcon'] ) ) {
                        $this->icons[] = 'fas fa-angle-right';
                    }
                    break;
                case 'ghostkit/carousel':
                    if ( ! isset( $block['attrs']['arrowPrevIcon'] ) ) {
                        $this->icons[] = 'fas fa-angle-left';
                    }
                    if ( ! isset( $block['attrs']['arrowNextIcon'] ) ) {
                        $this->icons[] = 'fas fa-angle-right';
                    }
                    break;
                case 'ghostkit/video':
                    if ( ! isset( $block['attrs']['iconPlay'] ) ) {
                        $this->icons[] = 'fas fa-play';
                    }
                    if ( ! isset( $block['attrs']['fullscreenActionCloseIcon'] ) ) {
                        $this->icons[] = 'fas fa-times';
                    }
                    break;
            }

            // Fallback user icons.
            switch ( $block['blockName'] ) {
                case 'ghostkit/alert':
                case 'ghostkit/button-single':
                case 'ghostkit/divider':
                case 'ghostkit/icon-box':
                    if ( isset( $block['attrs']['icon'] ) ) {
                        $this->icons[] = $block['attrs']['icon'];
                    }
                    break;
                case 'ghostkit/testimonial':
                    if ( isset( $block['attrs']['icon'] ) ) {
                        $this->icons[] = $block['attrs']['icon'];
                    }
                    if ( isset( $block['attrs']['starsIcon'] ) ) {
                        $this->icons[] = $block['attrs']['starsIcon'];
                    }
                    break;
                case 'ghostkit/carousel':
                    if ( isset( $block['attrs']['arrowPrevIcon'] ) ) {
                        $this->icons[] = $block['attrs']['arrowPrevIcon'];
                    }
                    if ( isset( $block['attrs']['arrowNextIcon'] ) ) {
                        $this->icons[] = $block['attrs']['arrowNextIcon'];
                    }
                    break;
                case 'ghostkit/video':
                    if ( isset( $block['attrs']['iconPlay'] ) ) {
                        $this->icons[] = $block['attrs']['iconPlay'];
                    }
                    if ( isset( $block['attrs']['iconLoading'] ) ) {
                        $this->icons[] = $block['attrs']['iconLoading'];
                    }
                    if ( isset( $block['attrs']['fullscreenActionCloseIcon'] ) ) {
                        $this->icons[] = $block['attrs']['fullscreenActionCloseIcon'];
                    }
                    break;
            }
        }

        $this->icons = array_unique( $this->icons );
    }

    /**
     * Enqueue fallback script.
     *
     * @return void
     */
    public function wp_enqueue_foot_assets() {
        if ( empty( $this->icons ) ) {
            return;
        }

        $icons_lists = apply_filters( 'gkt_icons_list', array() );

        if ( empty( $icons_lists ) ) {
            return;
        }

        $fallback = array();

        foreach ( $this->icons as $old_icon_classname ) {
            foreach ( $icons_lists as $list ) {
                if ( isset( $list['icons'] ) && ! empty( $list['icons'] ) ) {
                    foreach ( $list['icons'] as $icon ) {
                        if (
                            isset( $icon['fallback'] ) &&
                            isset( $icon['svg'] ) &&
                            $old_icon_classname === $icon['fallback']
                        ) {
                            $fallback[ $icon['fallback'] ] = $icon['svg'];
                        }
                    }
                }
            }
        }

        if ( empty( $fallback ) ) {
            return;
        }

        wp_enqueue_script(
            'ghostkit-icons-fallback',
            ghostkit()->plugin_url . 'assets/js/icons-fallback.min.js',
            array( 'jquery' ),
            '@@plugin_version',
            true
        );
        wp_localize_script( 'ghostkit-icons-fallback', 'ghostkitIconsFallback', $fallback );
    }
}

new GhostKit_Icons_Fallback();
