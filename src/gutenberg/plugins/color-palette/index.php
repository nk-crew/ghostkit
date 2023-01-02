<?php
/**
 * Custom color palette plugin
 *
 * @package @@plugin_name
 */

/**
 * GhostKit_Color_Palette_Plugin
 */
class GhostKit_Color_Palette_Plugin {
    /**
     * GhostKit_Color_Palette_Plugin constructor.
     */
    public function __construct() {
        add_action( 'after_setup_theme', array( $this, 'add_palette' ), 9999 );
        add_action( 'enqueue_block_editor_assets', array( $this, 'add_palette_styles' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'add_palette_styles' ) );
    }

    /**
     * Add custom color palette.
     */
    public function add_palette() {
        $colors = get_option( 'ghostkit_color_palette', array() );

        if ( is_array( $colors ) && ! empty( $colors ) ) {
            $custom_palette = array();

            foreach ( $colors as $color ) {
                $custom_palette[] = array(
                    'color' => $color['color'],
                    'name'  => $color['name'],
                    'slug'  => $color['slug'],
                );
            }

            if ( ! empty( $custom_palette ) ) {
                $theme_palette = get_theme_support( 'editor-color-palette' );

                if ( is_array( $theme_palette ) ) {
                    $theme_palette = reset( $theme_palette );
                }

                if ( is_array( $theme_palette ) && ! empty( $theme_palette ) ) {
                    $custom_palette = array_merge( $theme_palette, $custom_palette );
                }

                add_theme_support( 'editor-color-palette', $custom_palette );
            }
        }
    }

    /**
     * Print Gutenberg Palette Styles
     */
    public function add_palette_styles() {
        $colors = get_option( 'ghostkit_color_palette', array() );

        if ( is_array( $colors ) && ! empty( $colors ) ) {
            $custom_css = '';

            foreach ( $colors as $color ) {
                $custom_css .= '.has-' . esc_attr( $color['slug'] ) . '-color { color: ' . esc_attr( $color['color'] ) . '; } .has-' . esc_attr( $color['slug'] ) . '-background-color { background-color: ' . esc_attr( $color['color'] ) . '; } ';
            }

            if ( $custom_css ) {
                wp_register_style( 'ghostkit-color-palette', false, array(), '@@plugin_version' );
                wp_enqueue_style( 'ghostkit-color-palette' );
                wp_add_inline_style( 'ghostkit-color-palette', $custom_css );
            }
        }
    }
}

new GhostKit_Color_Palette_Plugin();
