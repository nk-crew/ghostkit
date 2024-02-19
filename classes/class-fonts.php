<?php
/**
 * Fonts for typography component
 *
 * @package ghostkit
 */

// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

/**
 * GhostKit_Fonts
 */
class GhostKit_Fonts {
	/**
	 * GhostKit_Fonts constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'enqueue_fonts' ), 20 );
		add_filter( 'gkt_fonts_list', array( $this, 'add_default_site_fonts' ), 9 );
		add_filter( 'gkt_fonts_list', array( $this, 'add_google_fonts' ) );
	}

	/**
	 * Enqueue fonts.
	 *
	 * @return void
	 */
	public function enqueue_fonts() {
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_all_fonts_assets' ), 12 );
	}

	/**
	 * Enqueue frontend & editor assets
	 */
	public function enqueue_all_fonts_assets() {
		$fonts = $this->get_font_loader_list();

		if ( ( is_admin() || ! empty( $fonts ) ) && isset( $fonts['google-fonts'] ) && ! empty( $fonts['google-fonts'] ) ) {
			$families = array();

			foreach ( $fonts['google-fonts'] as $font => $font_data ) {
				$family = $font;

				if ( isset( $font_data['widths'] ) && ! empty( $font_data['widths'] ) ) {
					$weights = array();

					foreach ( $font_data['widths'] as $weight ) {
						$weights[] = $weight;
					}

					$family .= ':' . implode( ',', $weights );
				}

				$families[] = $family;
			}

			$query_args = array(
				'family'  => implode( '|', $families ),
				'display' => 'swap',
			);

			wp_enqueue_style( 'ghostkit-fonts-google', add_query_arg( $query_args, 'https://fonts.googleapis.com/css' ), array(), GHOSTKIT_VERSION );
		}
	}

	/**
	 * Create Font Loader List for webfont-loader.
	 *
	 * @return array - Font Loader List.
	 */
	public function get_font_loader_list() {
		$post_id            = null;
		$fonts_list         = apply_filters( 'gkt_fonts_list', array() );
		$default_typography = apply_filters( 'gkt_custom_typography', array() );
		$fonts              = array();
		$unique_fonts       = array();
		$webfont_list       = array();
		$screen             = function_exists( 'get_current_screen' ) ? get_current_screen() : false;
		$is_admin_editor    = is_admin() && $screen && $screen->is_block_editor;

		if ( is_singular() ) {
			$post_id = get_the_ID();
		} elseif ( $is_admin_editor ) {
			global $post;
			$post_id = isset( $post->ID ) ? $post->ID : null;
		}

		$is_single               = is_singular() && $post_id;
		$is_admin_editor         = $is_admin_editor && $post_id;
		$additional_font_weights = array();

		// Default Typography.
		if ( ! empty( $default_typography ) ) {
			// Global Typography.
			$global_typography = get_option( 'ghostkit_typography', array() );
			if ( isset( $global_typography['ghostkit_typography'] ) && $global_typography['ghostkit_typography'] ) {
				$global_typography = json_decode( $global_typography['ghostkit_typography'], true );
			}
			if ( ! is_array( $global_typography ) ) {
				$global_typography = array();
			}

			// Meta post Typography.
			$meta_typography = array();
			if ( $is_single || $is_admin_editor ) {
				$meta_typography = get_post_meta( $post_id, 'ghostkit_typography', true );

				if ( ! empty( $meta_typography ) ) {
					$meta_typography = json_decode( $meta_typography, true );
				}
				if ( ! is_array( $meta_typography ) ) {
					$meta_typography = array();
				}
			}

			// Go through all defaults and prepare full fonts list.
			foreach ( $default_typography as $key => $typography ) {
				$result = array();

				// Default data.
				if (
					isset( $typography['defaults']['font-family'] ) &&
					! empty( $typography['defaults']['font-family'] ) &&
					isset( $typography['defaults']['font-family-category'] ) &&
					! empty( $typography['defaults']['font-family-category'] )
				) {
					$weight = '';
					if ( isset( $typography['defaults']['font-weight'] ) && ! empty( $typography['defaults']['font-weight'] ) ) {
						$weight = $typography['defaults']['font-weight'];
					}

					// TODO: add additional_font_weights option support for typography React component.
					if ( isset( $typography['additional_font_weights'] ) && ! empty( $typography['additional_font_weights'] ) ) {
						$additional_font_weights[ $key ] = $typography['additional_font_weights'];
					}

					$result = array(
						'family'     => $typography['defaults']['font-family-category'],
						'label'      => $typography['defaults']['font-family'],
						'weight'     => $weight,
						'typography' => $key,
					);
				}

				// Global data.
				if (
					isset( $global_typography[ $key ]['fontFamily'] ) &&
					! empty( $global_typography[ $key ]['fontFamily'] ) &&
					isset( $global_typography[ $key ]['fontFamilyCategory'] ) &&
					! empty( $global_typography[ $key ]['fontFamilyCategory'] )
				) {
					$weight = '';
					if ( isset( $global_typography[ $key ]['fontWeight'] ) && ! empty( $global_typography[ $key ]['fontWeight'] ) ) {
						$weight = $global_typography[ $key ]['fontWeight'];
					}

					$result = array(
						'family'     => $global_typography[ $key ]['fontFamilyCategory'],
						'label'      => $global_typography[ $key ]['fontFamily'],
						'weight'     => $weight,
						'typography' => $key,
					);
				}

				// Meta data.
				if (
					isset( $meta_typography[ $key ]['fontFamily'] ) &&
					! empty( $meta_typography[ $key ]['fontFamily'] ) &&
					isset( $meta_typography[ $key ]['fontFamilyCategory'] ) &&
					! empty( $meta_typography[ $key ]['fontFamilyCategory'] )
				) {
					$weight = '';
					if ( isset( $meta_typography[ $key ]['fontWeight'] ) && ! empty( $meta_typography[ $key ]['fontWeight'] ) ) {
						$weight = $meta_typography[ $key ]['fontWeight'];
					}

					$result = array(
						'family'     => $meta_typography[ $key ]['fontFamilyCategory'],
						'label'      => $meta_typography[ $key ]['fontFamily'],
						'weight'     => $weight,
						'typography' => $key,
					);
				}

				// Save result.
				if ( isset( $result['family'] ) && $result['family'] && isset( $result['label'] ) && $result['label'] ) {
					$fonts[ $key ] = $result;
				}
			}
		}

		// clear array to unique.
		$unique_fonts = array_map( 'unserialize', array_unique( array_map( 'serialize', $fonts ) ) );

		foreach ( $unique_fonts as $font ) {
			if ( isset( $font['family'] ) && ! empty( $font['family'] ) && array_key_exists( $font['family'], $fonts_list ) ) {
				foreach ( $fonts_list[ $font['family'] ]['fonts'] as $find_font ) {
					if ( $font['label'] === $find_font['name'] ) {
						$weights  = array();
						$weight   = ( isset( $font['weight'] ) && ! empty( $font['weight'] ) ) ? $font['weight'] : '';
						$widths   = ( isset( $find_font['widths'] ) && ! empty( $find_font['widths'] ) ) ? $find_font['widths'] : array();
						$category = ( isset( $find_font['category'] ) && ! empty( $find_font['category'] ) ) ? $find_font['category'] : '';
						$subsets  = ( isset( $find_font['subsets'] ) && ! empty( $find_font['subsets'] ) ) ? $find_font['subsets'] : '';

						if ( isset( $additional_font_weights ) && ! empty( $additional_font_weights ) ) {
							foreach ( $additional_font_weights as $key => $additional_font_weight ) {
								if ( $key === $font['typography'] ) {
									$font_weights = $additional_font_weight;
								}
							}
						}

						if ( isset( $font_weights ) && ! empty( $font_weights ) && is_array( $font_weights ) ) {
							$insert_weights = array();
							if ( '' !== $weight ) {
								$weight           = str_replace( 'i', '', $weight );
								$insert_weights[] = $weight;
								$insert_weights[] = $weight . 'i';
							}
							$insert_weights = array_merge( $insert_weights, $font_weights );
							foreach ( $insert_weights as $insert_weight ) {
								if ( array_search( $insert_weight, $widths, true ) !== false ) {
									$weights[] = $insert_weight;
								}
							}
						} elseif ( '' !== $weight ) {
							$weight = str_replace( 'i', '', $weight );

							if ( '600' !== $weight &&
								'700' !== $weight &&
								'800' !== $weight &&
								'900' !== $weight ) {

								$insert_weights = array(
									$weight,
									$weight . 'i',
									'700',
									'700i',
								);

								foreach ( $insert_weights as $insert_weight ) {
									if ( array_search( $insert_weight, $widths, true ) !== false ) {
										$weights[] = $insert_weight;
									}
								}
							} else {
								$insert_weights = array(
									$weight,
									$weight . 'i',
								);

								foreach ( $insert_weights as $insert_weight ) {
									if ( array_search( $insert_weight, $widths, true ) !== false ) {
										$weights[] = $insert_weight;
									}
								}
							}
						} else {
							$insert_weights = array(
								'400',
								'400i',
								'700',
								'700i',
							);

							foreach ( $insert_weights as $insert_weight ) {
								if ( array_search( $insert_weight, $widths, true ) !== false ) {
									$weights[] = $insert_weight;
								}
							}
						}

						if (
							isset( $webfont_list[ $font['family'] ][ $font['label'] ]['widths'] ) &&
							! empty( $webfont_list[ $font['family'] ][ $font['label'] ]['widths'] ) &&
							is_array( $webfont_list[ $font['family'] ][ $font['label'] ]['widths'] )
						) {
							$weights = array_values( array_unique( array_merge_recursive( $webfont_list[ $font['family'] ][ $font['label'] ]['widths'], $weights ) ) );
						}

						$webfont_list[ $font['family'] ][ $font['label'] ] = array(
							'widths'   => $weights,
							'category' => $category,
							'subsets'  => $subsets,
						);
					}
				}
			}
		}

		return $webfont_list;
	}

	/**
	 * Get Default Site Font.
	 *
	 * @return array
	 */
	private function get_default_site_font() {
		return array(
			'name'     => 'Default Site Font',
			'widths'   => array(
				'',
				'400',
				'700',
			),
			'category' => 'sans-serif',
		);
	}

	/**
	 * Add Default fonts list.
	 *
	 * @param array $fonts - fonts list.
	 *
	 * @return array
	 */
	public function add_default_site_fonts( $fonts ) {

		$fonts['default'] = array(
			'name'  => __( 'Default Fonts Site', 'ghostkit' ),
			'fonts' => array(
				$this->get_default_site_font(),
			),
		);
		return $fonts;
	}

	/**
	 * Add Google fonts list.
	 *
	 * @link https://developers.google.com/fonts/docs/developer_api?apix_params=%7B%22alt%22%3A%22json%22%2C%22fields%22%3A%22items(family%2Ckind%2Ccategory%2Cvariants%2Csubsets%2Cversion%2ClastModified)%22%2C%22prettyPrint%22%3Afalse%7D - get new fonts.
	 *
	 * @param array $fonts - fonts list.
	 *
	 * @return array
	 */
	public function add_google_fonts( $fonts ) {
		$result = get_transient( 'ghostkit_google_fonts_list' );

		if ( ! $result ) {
			$result       = array();
            $fonts_json   = file_get_contents( ghostkit()->plugin_path . 'classes/google-fonts/webfonts.json' ); // phpcs:ignore
			$fonts_object = json_decode( $fonts_json, true );

			foreach ( $fonts_object['items'] as $font ) {
				$weights = array();
				foreach ( $font['variants'] as $variant ) {
					$variant = str_replace( 'italic', 'i', $variant );

					switch ( $variant ) {
						case 'i':
							$variant = '400i';
							break;
						case 'regular':
							$variant = '400';
							break;
					}

					$weights[] = $variant;
				}
				$result[] = array(
					'name'     => $font['family'],
					'widths'   => $weights,
					'category' => $font['category'],
					'subsets'  => $font['subsets'],
				);
			}

			if ( ! empty( $result ) ) {
				set_transient( 'ghostkit_google_fonts_list', $result, DAY_IN_SECONDS );
			}
		}

		$result[] = $this->get_default_site_font();

		$fonts['google-fonts'] = array(
			'name'  => esc_attr__( 'Google Fonts', 'ghostkit' ),
			'fonts' => $result,
		);

		return $fonts;
	}
}
new GhostKit_Fonts();
