<?php
/**
 * Typography
 *
 * @package @@plugin_name
 */

/**
 * GhostKit_Typography
 */
class GhostKit_Typography {
    /**
     * GhostKit_Typography constructor.
     */
    public function __construct() {
        add_filter( 'gkt_custom_typography', array( $this, 'add_default_typography' ), 9 );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_typography_assets' ), 25 );
        add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_typography_assets' ), 100 );
    }

    /**
     * Enqueue Typography assets to editor and front end.
     */
    public function enqueue_typography_assets() {
        $typography_css = $this->generate_typography_styles();
        $css = ' ';

        if ( isset( $typography_css ) && ! empty( $typography_css ) && is_array( $typography_css ) ) {
            if ( ! is_admin() && isset( $typography_css['front'] ) && ! empty( $typography_css['front'] ) ) {
                $css = $typography_css['front'];
            }
            if ( function_exists( 'register_block_type' ) && is_admin() && isset( $typography_css['editor'] ) && ! empty( $typography_css['editor'] ) ) {
                $css = $typography_css['editor'];
            }
        }
        wp_register_style( 'ghostkit-typography', false );
        wp_enqueue_style( 'ghostkit-typography' );
        wp_add_inline_style( 'ghostkit-typography', $css );
    }

    /**
     * Generate Typography Styles.
     *
     * @return array - Typography Css.
     */
    public function generate_typography_styles() {
        $typography_prepeare_styles = array();
        $typography_css = array(
            'editor' => '',
            'front' => '',
        );
        $default_typography = apply_filters( 'gkt_custom_typography', array() );

        $screen = function_exists( 'get_current_screen' ) ? get_current_screen() : false;
        $global_typography = get_option( 'ghostkit_typography', array() );
        $is_admin_editor = is_admin() && $screen && $screen->is_block_editor;

        if ( is_singular() ) {
            $post_id = get_the_ID();
        } elseif ( $is_admin_editor ) {
            global $post;
            $post_id = $post->ID;
        }

        $is_single = is_singular() && $post_id;
        $is_admin_editor = $is_admin_editor && $post_id;

        if ( $this->is_exist( $default_typography ) ) {

            foreach ( $default_typography as $key => $typography ) {
                if ( $this->is_exist( $typography['output'] ) ) {
                    $typography_prepeare_styles[ $key ] = array(
                        'style-properties' => $typography['defaults'],
                        'output' => $typography['output'],
                    );
                }
            }

            // Global custom Typography.
            // @codingStandardsIgnoreStart
            if ( $this->is_exist( $global_typography ) && $this->is_exist( $global_typography['ghostkit_typography'] ) ) {
                $object_global_typography = json_decode( $global_typography['ghostkit_typography'] );
                if ( $this->is_exist( $object_global_typography ) ) {
                    foreach ( $object_global_typography as $global_typography_key => $global_typography_value ) {
                        if ( $this->is_exist( $typography_prepeare_styles[ $global_typography_key ] ) ) {
                            if ( $this->is_exist( $global_typography_value->fontFamily ) &&
                                $this->is_exist( $global_typography_value->fontFamilyCategory ) ) {

                                // Checking the default style so as not to display it in styles.
                                $fontFamily = $global_typography_value->fontFamily === 'Default Site Font' ? '' : $global_typography_value->fontFamily;

                                $typography_prepeare_styles[ $global_typography_key ]['style-properties']['font-family'] = $fontFamily;
                                $typography_prepeare_styles[ $global_typography_key ]['style-properties']['font-family-category'] = $global_typography_value->fontFamilyCategory;
                            }
                            if ( $this->is_exist( $global_typography_value->fontSize ) &&
                                isset( $typography_prepeare_styles[ $global_typography_key ]['style-properties']['font-size'] ) ) {
                                $typography_prepeare_styles[ $global_typography_key ]['style-properties']['font-size'] = $global_typography_value->fontSize;
                            }
                            if ( $this->is_exist( $global_typography_value->fontWeight ) &&
                                isset( $typography_prepeare_styles[ $global_typography_key ]['style-properties']['font-weight'] ) ) {
                                $typography_prepeare_styles[ $global_typography_key ]['style-properties']['font-weight'] = $global_typography_value->fontWeight;
                            }

                            // Additional check in order not to display the style if it is not in the filter.
                            if ( $this->is_exist( $global_typography_value->lineHeight ) &&
                                $this->is_exist( $typography_prepeare_styles[ $global_typography_key ]['style-properties']['line-height'] ) ) {
                                $typography_prepeare_styles[ $global_typography_key ]['style-properties']['line-height'] = $global_typography_value->lineHeight;
                            }

                            // Additional check in order not to display the style if it is not in the filter.
                            if ( $this->is_exist( $global_typography_value->letterSpacing ) &&
                                $this->is_exist( $typography_prepeare_styles[ $global_typography_key ]['style-properties']['letter-spacing'] ) ) {
                                $typography_prepeare_styles[ $global_typography_key ]['style-properties']['letter-spacing'] = $global_typography_value->letterSpacing;
                            }
                        }
                    }
                }
            }

            // Local custom Typography.
            if ( $is_single || $is_admin_editor ) {
                $meta_typography = get_post_meta( $post_id, 'ghostkit_typography', true );

                if ( $this->is_exist( $meta_typography ) ) {
                    $object_meta_typography = json_decode( $meta_typography );
                    if ( $this->is_exist( $object_meta_typography ) ) {
                        foreach ( json_decode( $meta_typography ) as $meta_typography_key => $meta_typography_value ) {
                            if ( $this->is_exist( $typography_prepeare_styles[ $meta_typography_key ] ) ) {
                                if ( $this->is_exist( $meta_typography_value->fontFamily ) &&
                                    $this->is_exist( $meta_typography_value->fontFamilyCategory ) ) {
                                    $typography_prepeare_styles[ $meta_typography_key ]['style-properties']['font-family-category'] = $meta_typography_value->fontFamilyCategory;
                                    $typography_prepeare_styles[ $meta_typography_key ]['style-properties']['font-family'] = $meta_typography_value->fontFamily === 'Default Site Font' ? '' : $meta_typography_value->fontFamily;
                                }
                                if ( $this->is_exist( $meta_typography_value->fontSize ) &&
                                    isset( $typography_prepeare_styles[ $meta_typography_key ]['style-properties']['font-size'] ) ) {
                                    $typography_prepeare_styles[ $meta_typography_key ]['style-properties']['font-size'] = $meta_typography_value->fontSize;
                                }
                                if ( $this->is_exist( $meta_typography_value->fontWeight ) &&
                                    isset( $typography_prepeare_styles[ $meta_typography_key ]['style-properties']['font-weight'] ) ) {
                                    $typography_prepeare_styles[ $meta_typography_key ]['style-properties']['font-weight'] = $meta_typography_value->fontWeight;
                                }
                                if ( $this->is_exist( $meta_typography_value->lineHeight ) &&
                                    $this->is_exist( $typography_prepeare_styles[ $meta_typography_key ]['style-properties']['line-height'] ) ) {
                                    $typography_prepeare_styles[ $meta_typography_key ]['style-properties']['line-height'] = $meta_typography_value->lineHeight;
                                }
                                if ( $this->is_exist( $meta_typography_value->letterSpacing ) &&
                                    $this->is_exist( $typography_prepeare_styles[ $meta_typography_key ]['style-properties']['letter-spacing'] ) ) {
                                    $typography_prepeare_styles[ $meta_typography_key ]['style-properties']['letter-spacing'] = $meta_typography_value->letterSpacing;
                                }
                            }
                        }
                    }
                }
            }
            // @codingStandardsIgnoreEnd

            // Collect all the styles for further transfer to the inline file on the edit or front page.
            foreach ( $typography_prepeare_styles as $typography_prepeare_style ) {
                if ( ( $this->is_exist( $typography_prepeare_style['output'] ) && is_array( $typography_prepeare_style['output'] ) ) &&
                     ( $this->is_exist( $typography_prepeare_style['style-properties']['font-family'] ) ||
                         $this->is_exist( $typography_prepeare_style['style-properties']['font-size'] ) ||
                         $this->is_exist( $typography_prepeare_style['style-properties']['font-weight'] ) ||
                         $this->is_exist( $typography_prepeare_style['style-properties']['line-height'] ) ||
                         $this->is_exist( $typography_prepeare_style['style-properties']['letter-spacing'] )
                     ) ) {
                    foreach ( $typography_prepeare_style['output'] as $output ) {
                        if ( $this->is_exist( $output['selectors'] ) ) {
                            $typography_styles = '';
                            $typography_styles .= $output['selectors'] . '{';

                            if ( $this->is_exist( $typography_prepeare_style['style-properties']['font-family'] ) ) {
                                $typography_styles .= 'font-family: ' . $typography_prepeare_style['style-properties']['font-family'] . ';';
                            }
                            if ( $this->is_exist( $typography_prepeare_style['style-properties']['font-size'] ) ) {
                                $typography_styles .= 'font-size: ' . $typography_prepeare_style['style-properties']['font-size'] . ';';
                            }
                            if ( $this->is_exist( $typography_prepeare_style['style-properties']['font-weight'] ) ) {
                                $font_weight = $typography_prepeare_style['style-properties']['font-weight'];
                                if ( false !== strpos( $font_weight, 'i' ) ) {
                                    $font_weight = str_replace( 'i', '', $font_weight );
                                    $typography_styles .= 'font-style: italic;';
                                }
                                $typography_styles .= 'font-weight: ' . $font_weight . ';';
                            }
                            if ( $this->is_exist( $typography_prepeare_style['style-properties']['line-height'] ) ) {
                                $typography_styles .= 'line-height: ' . $typography_prepeare_style['style-properties']['line-height'] . ';';
                            }
                            if ( $this->is_exist( $typography_prepeare_style['style-properties']['letter-spacing'] ) ) {
                                $typography_styles .= 'letter-spacing: ' . $typography_prepeare_style['style-properties']['letter-spacing'] . ';';
                            }
                            $typography_styles .= '}';

                            if ( isset( $output['editor'] ) && true === $output['editor'] ) {
                                $typography_css['editor'] .= $typography_styles;
                            } else {
                                $typography_css['front'] .= $typography_styles;
                            }
                        }
                    }
                }
            }
        }

        return $typography_css;
    }

    /**
     * Check value on the existence and emptiness.
     *
     * @param void $value - Checking value.
     * @return bool $value - True or false.
     */
    public function is_exist( $value ) {
        return ( isset( $value ) && ! empty( $value ) ) ? true : false;
    }
    /**
     * Add Default Typography.
     *
     * @param array $custom_typography - Current typography.
     * @return array - New Typography.
     */
    public function add_default_typography( $custom_typography ) {
        $custom_typography = array(
            'body' => array(
                'label' => esc_html__( 'Body', '@@text_domain' ),
                'defaults' => array(
                    'font-family-category' => 'google-fonts',
                    'font-family' => '',
                    'font-size' => '',
                    'font-weight' => '',
                    'line-height' => '',
                    'letter-spacing' => '',
                ),
                'output' => array(
                    array(
                        'selectors' => 'body',
                    ),
                    array(
                        'selectors' => '#editor .editor-styles-wrapper, .editor-styles-wrapper p',
                        'editor' => true,
                    ),
                ),
            ),
            'headings' => array(
                'label' => esc_html__( 'Headings', '@@text_domain' ),
                'defaults' => array(
                    'font-family-category' => 'google-fonts',
                    'font-family' => '',
                    'font-size' => '',
                    'font-weight' => '',
                    'line-height' => '',
                    'letter-spacing' => '',
                ),
                'output' => array(
                    array(
                        'selectors' => 'h1, h2, h3, h4, h5, h6',
                    ),
                    array(
                        'selectors' => '#editor .editor-styles-wrapper h1, #editor .editor-styles-wrapper h2, #editor .editor-styles-wrapper h3, #editor .editor-styles-wrapper h4, #editor .editor-styles-wrapper h5, #editor .editor-styles-wrapper h6, #editor .editor-styles-wrapper .editor-post-title__block .editor-post-title__input',
                        'editor' => true,
                    ),
                ),
            ),
            'buttons' => array(
                'label' => esc_html__( 'Buttons', '@@text_domain' ),
                'defaults' => array(
                    'font-family-category' => 'google-fonts',
                    'font-family' => '',
                    'font-size' => '',
                    'font-weight' => '',
                    'line-height' => '',
                    'letter-spacing' => '',
                ),
                'output' => array(
                    array(
                        'selectors' => '.wp-block-button, .ghostkit-button',
                    ),
                    array(
                        'selectors' => '#editor .editor-styles-wrapper .wp-block-button, #editor .editor-styles-wrapper .ghostkit-button',
                        'editor' => true,
                    ),
                ),
            ),
        );
        return $custom_typography;
    }
}
new GhostKit_Typography();
