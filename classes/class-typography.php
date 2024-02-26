<?php
/**
 * Typography
 *
 * @package ghostkit
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
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_typography_assets' ), 100 );
	}

	/**
	 * Enqueue Typography assets to editor and front end.
	 */
	public function enqueue_typography_assets() {
		$typography_css = $this->generate_typography_styles();
		$css            = ' ';

		if ( isset( $typography_css ) && ! empty( $typography_css ) && is_array( $typography_css ) ) {
			if ( ! is_admin() && isset( $typography_css['front'] ) && ! empty( $typography_css['front'] ) ) {
				$css = $typography_css['front'];
			}
			if ( is_admin() && isset( $typography_css['editor'] ) && ! empty( $typography_css['editor'] ) ) {
				$css = $typography_css['editor'];
			}
		}
		wp_register_style( 'ghostkit-typography', false, array(), GHOSTKIT_VERSION );
		wp_enqueue_style( 'ghostkit-typography' );
		wp_add_inline_style( 'ghostkit-typography', $css );
	}

	/**
	 * Generate Typography Styles.
	 *
	 * @return array - Typography Css.
	 */
	public static function generate_typography_styles() {
		$typography_prepeare_styles = array();
		$typography_css             = array(
			'editor' => '',
			'front'  => '',
		);
		$default_typography         = apply_filters( 'gkt_custom_typography', array() );
		$screen                     = function_exists( 'get_current_screen' ) ? get_current_screen() : false;
		$global_typography          = get_option( 'ghostkit_typography', array() );
		$is_admin_editor            = is_admin() && $screen && $screen->is_block_editor;

		if ( is_singular() ) {
			$post_id = get_the_ID();
		} elseif ( $is_admin_editor ) {
			global $post;
			$post_id = isset( $post->ID ) ? $post->ID : null;
		}

		$is_single       = is_singular() && $post_id;
		$is_admin_editor = $is_admin_editor && $post_id;

		if ( self::is_exist( $default_typography ) ) {

			foreach ( $default_typography as $key => $typography ) {
				if ( self::is_exist( $typography['output'] ) ) {
					$typography_prepeare_styles[ $key ] = array(
						'style-properties' => $typography['defaults'],
						'output'           => $typography['output'],
					);
				}
			}

			// Global custom Typography.
			if ( self::is_exist( $global_typography ) && self::is_exist( $global_typography['ghostkit_typography'] ) ) {
				$typography_prepeare_styles = self::get_typography_values( $global_typography['ghostkit_typography'], $typography_prepeare_styles );
			}

			// Local custom Typography.
			if ( $is_single || $is_admin_editor ) {
				$meta_typography            = get_post_meta( $post_id, 'ghostkit_typography', true );
				$typography_prepeare_styles = self::get_typography_values( $meta_typography, $typography_prepeare_styles );
			}

			// Collect all the styles for further transfer to the inline file on the edit or front page.
			foreach ( $typography_prepeare_styles as $typography_prepeare_style ) {
				if (
					self::is_exist( $typography_prepeare_style['output'] ) &&
					is_array( $typography_prepeare_style['output'] ) &&
					( self::is_exist( $typography_prepeare_style['style-properties'], 'font-family' ) ||
						self::is_exist( $typography_prepeare_style['style-properties'], 'font-size' ) ||
						self::is_exist( $typography_prepeare_style['style-properties'], 'font-weight' ) ||
						self::is_exist( $typography_prepeare_style['style-properties'], 'line-height' ) ||
						self::is_exist( $typography_prepeare_style['style-properties'], 'letter-spacing' )
					)
				) {
					foreach ( $typography_prepeare_style['output'] as $output ) {
						if ( self::is_exist( $output['selectors'] ) ) {
							$typography_styles  = '';
							$typography_styles .= $output['selectors'] . '{';

							if ( self::is_exist( $typography_prepeare_style['style-properties'], 'font-family' ) ) {
								// Add double quotes to the font name, because some fonts have a space in the name.
								// And if the font name is not in quotes, then the browser will not be able to find it.
								// For example font-family: Source Serif 4; - will not work.
								$typography_styles .= 'font-family: "' . esc_attr( $typography_prepeare_style['style-properties']['font-family'] ) . '", sans-serif;';
							}

							if ( self::is_exist( $typography_prepeare_style['style-properties'], 'font-size' ) ) {
								$typography_styles .= 'font-size: ' . esc_attr( $typography_prepeare_style['style-properties']['font-size'] ) . ';';
							}

							if ( self::is_exist( $typography_prepeare_style['style-properties'], 'font-weight' ) ) {
								$font_weight = $typography_prepeare_style['style-properties']['font-weight'];

								if ( false !== strpos( $font_weight, 'i' ) ) {
									$font_weight        = str_replace( 'i', '', $font_weight );
									$typography_styles .= 'font-style: italic;';
								} else {
									$typography_styles .= 'font-style: normal;';
								}

								$typography_styles .= 'font-weight: ' . esc_attr( $font_weight ) . ';';
							}

							if ( self::is_exist( $typography_prepeare_style['style-properties'], 'line-height' ) ) {
								$typography_styles .= 'line-height: ' . esc_attr( $typography_prepeare_style['style-properties']['line-height'] ) . ';';
							}

							if ( self::is_exist( $typography_prepeare_style['style-properties'], 'letter-spacing' ) ) {
								$typography_styles .= 'letter-spacing: ' . esc_attr( $typography_prepeare_style['style-properties']['letter-spacing'] ) . ';';
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
	 * @param void   $value - Checking value.
	 * @param bool   $attribute - Checking attribute of Array Value.
	 * @param string $mode - Full or isset for partial check.
	 * @return bool  $value - True or false.
	 */
	public static function is_exist( $value, $attribute = false, $mode = 'full' ) {
		$check = false;

		if ( $attribute ) {
			if ( 'full' === $mode && isset( $value[ $attribute ] ) && ! empty( $value[ $attribute ] ) && 'null' !== $value ) {
				$check = true;
			}
			if ( 'isset' === $mode && isset( $value[ $attribute ] ) ) {
				$check = true;
			}
		} else {
			if ( 'full' === $mode ) {
				$check = ( isset( $value ) && ! empty( $value ) && 'null' !== $value ) ? true : false;
			}
			if ( 'isset' === $mode ) {
				$check = ( isset( $value ) ) ? true : false;
			}
		}

		return $check;
	}

	/**
	 * Function for get Typography Values.
	 *
	 * @param object $typography_object - Current typography.
	 * @param array  $typography_prepeare_styles - Previous Array With Current Styles Properties.
	 * @return mixed - Next Array With Current Styles Properties.
	 */
	public static function get_typography_values( $typography_object, $typography_prepeare_styles ) {
		$conformity_attributes = array(
			'fontFamily'         => 'font-family',
			'fontFamilyCategory' => 'font-family-category',
			'fontSize'           => 'font-size',
			'fontWeight'         => 'font-weight',
			'lineHeight'         => 'line-height',
			'letterSpacing'      => 'letter-spacing',
			'label'              => 'label',
			'childOf'            => 'child-of',
		);

		if ( self::is_exist( $typography_object ) ) {
			foreach ( json_decode( $typography_object ) as $meta_typography_key => $meta_typography_value ) {
				if ( array_key_exists( $meta_typography_key, $typography_prepeare_styles ) ) {
					foreach ( $meta_typography_value as $typography_attribute_key => $typography_attribute ) {
						if ( self::is_exist( $conformity_attributes[ $typography_attribute_key ] ) &&
							self::is_exist( $typography_prepeare_styles[ $meta_typography_key ]['style-properties'], $conformity_attributes[ $typography_attribute_key ], 'isset' ) ) {
							if ( '' !== $typography_attribute ) {
								$typography_prepeare_styles[ $meta_typography_key ]['style-properties'][ $conformity_attributes[ $typography_attribute_key ] ] = $typography_attribute;
							}
						}
					}
				}
			}
		}

		return $typography_prepeare_styles;
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
				'label'    => esc_html__( 'Body', 'ghostkit' ),
				'defaults' => array(
					'font-family-category' => 'default',
					'font-family'          => '',
					'font-size'            => '',
					'font-weight'          => '',
					'line-height'          => '',
					'letter-spacing'       => '',
				),
				'output'   => array(
					array(
						'selectors' => 'body',
					),
					array(
						'selectors' => '.editor-styles-wrapper, .editor-styles-wrapper p',
						'editor'    => true,
					),
				),
			),
			'buttons' => array(
				'label'    => esc_html__( 'Buttons', 'ghostkit' ),
				'defaults' => array(
					'font-family-category' => 'default',
					'font-family'          => '',
					'font-size'            => '',
					'font-weight'          => '',
					'line-height'          => '',
					'letter-spacing'       => '',
				),
				'output'   => array(
					array(
						'selectors' => '.wp-block-button, .ghostkit-button, .entry .entry-content .wp-block-button .wp-block-button__link',
					),
					array(
						'selectors' => '.editor-styles-wrapper .wp-block-button .wp-block-button__link, .editor-styles-wrapper .ghostkit-button',
						'editor'    => true,
					),
				),
			),
			'headings' => array(
				'label'    => esc_html__( 'Headings', 'ghostkit' ),
				'defaults' => array(
					'font-family-category' => 'default',
					'font-family'          => '',
					'font-weight'          => '',
					'line-height'          => '',
					'letter-spacing'       => '',
				),
				'output'   => array(
					array(
						'selectors' => 'h1, h1.entry-title, h2, h3, h4, h5, h6, .wp-block-heading, .wp-block-post-title, h2.wp-block-heading, h3.wp-block-heading, h4.wp-block-heading, h5.wp-block-heading, h6.wp-block-heading, .wp-block-heading',
					),
					array(
						'selectors' => '.editor-styles-wrapper h1, .editor-styles-wrapper h2, .editor-styles-wrapper h3, .editor-styles-wrapper h4, .editor-styles-wrapper h5, .editor-styles-wrapper h6, .editor-styles-wrapper .editor-post-title__block .editor-post-title__input',
						'editor'    => true,
					),
				),
			),
			'h1' => array(
				'label'    => esc_html__( 'H1', 'ghostkit' ),
				'defaults' => array(
					'font-size'      => '',
					'line-height'    => '',
					'letter-spacing' => '',
				),
				'child-of' => 'headings',
				'output'   => array(
					array(
						'selectors' => 'h1, h1.entry-title, h1.wp-block-heading, h1.wp-block-post-title',
					),
					array(
						'selectors' => '.editor-styles-wrapper h1, .editor-styles-wrapper .editor-post-title__block .editor-post-title__input',
						'editor'    => true,
					),
				),
			),
			'h2' => array(
				'label'    => esc_html__( 'H2', 'ghostkit' ),
				'defaults' => array(
					'font-size'      => '',
					'line-height'    => '',
					'letter-spacing' => '',
				),
				'child-of' => 'headings',
				'output'   => array(
					array(
						'selectors' => 'h2, h2.wp-block-heading',
					),
					array(
						'selectors' => '.editor-styles-wrapper h2',
						'editor'    => true,
					),
				),
			),
			'h3' => array(
				'label'    => esc_html__( 'H3', 'ghostkit' ),
				'defaults' => array(
					'font-size'      => '',
					'line-height'    => '',
					'letter-spacing' => '',
				),
				'child-of' => 'headings',
				'output'   => array(
					array(
						'selectors' => 'h3, h3.wp-block-heading',
					),
					array(
						'selectors' => '.editor-styles-wrapper h3',
						'editor'    => true,
					),
				),
			),
			'h4' => array(
				'label'    => esc_html__( 'H4', 'ghostkit' ),
				'defaults' => array(
					'font-size'      => '',
					'line-height'    => '',
					'letter-spacing' => '',
				),
				'child-of' => 'headings',
				'output'   => array(
					array(
						'selectors' => 'h4, h4.wp-block-heading',
					),
					array(
						'selectors' => '.editor-styles-wrapper h4',
						'editor'    => true,
					),
				),
			),
			'h5' => array(
				'label'    => esc_html__( 'H5', 'ghostkit' ),
				'defaults' => array(
					'font-size'      => '',
					'line-height'    => '',
					'letter-spacing' => '',
				),
				'child-of' => 'headings',
				'output'   => array(
					array(
						'selectors' => 'h5, h5.wp-block-heading',
					),
					array(
						'selectors' => '.editor-styles-wrapper h5',
						'editor'    => true,
					),
				),
			),
			'h6' => array(
				'label'    => esc_html__( 'H6', 'ghostkit' ),
				'defaults' => array(
					'font-size'      => '',
					'line-height'    => '',
					'letter-spacing' => '',
				),
				'child-of' => 'headings',
				'output'   => array(
					array(
						'selectors' => 'h6, h6.wp-block-heading',
					),
					array(
						'selectors' => '.editor-styles-wrapper h6',
						'editor'    => true,
					),
				),
			),
		);
		return $custom_typography;
	}

	/**
	 * Fallback for removed method, which was used in the Pro version priori to v2.2.0.
	 *
	 * @return bool
	 */
	public static function typography_exist() {
		return false;
	}
}
new GhostKit_Typography();
