<?php
/**
 * Custom color palette plugin
 *
 * @package ghostkit
 */

/**
 * GhostKit_Color_Palette_Plugin
 */
class GhostKit_Color_Palette_Plugin {
	/**
	 * GhostKit_Color_Palette_Plugin constructor.
	 */
	public function __construct() {
		add_action(
			'wp_loaded',
			function () {
				$allow_custom_palette = 'false';

				// Don't add custom palette if a block theme is activated.
				if ( function_exists( 'wp_is_block_theme' ) && ! wp_is_block_theme() ) {
					$this->add_palette();

					add_action( 'enqueue_block_assets', array( $this, 'add_editor_palette_styles' ) );
					add_action( 'wp_enqueue_scripts', array( $this, 'add_palette_styles' ) );

					$allow_custom_palette = 'true';
				}

				// Disable color palette settings from GhostKit.
				wp_add_inline_script( 'ghostkit-helper', 'if (ghostkitVariables) { ghostkitVariables.allowPluginColorPalette = ' . $allow_custom_palette . '; }', 'before' );
			},
			9
		);
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
	 * Print Gutenberg Palette Styles in the editor.
	 *
	 * The palette classes are applied to blocks inside the editor canvas, which is always
	 * iframed since WordPress 7.1. Only `enqueue_block_assets` output reaches that iframe;
	 * `enqueue_block_editor_assets` output stays outside it.
	 */
	public function add_editor_palette_styles() {
		// The frontend is already covered by the `wp_enqueue_scripts` hook.
		if ( ! is_admin() ) {
			return;
		}

		$this->add_palette_styles();
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
				wp_register_style( 'ghostkit-color-palette', false, array(), GHOSTKIT_VERSION );
				wp_enqueue_style( 'ghostkit-color-palette' );
				wp_add_inline_style( 'ghostkit-color-palette', $custom_css );
			}
		}
	}
}

new GhostKit_Color_Palette_Plugin();
