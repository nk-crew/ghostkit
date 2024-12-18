<?php
/**
 * Assets static and dynamic.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Assets
 */
class GhostKit_Assets {
	/**
	 * List with stored assets.
	 *
	 * @var array
	 */
	private static $stored_assets = array(
		'script'     => array(),
		'style'      => array(),
		'custom-css' => array(),
	);

	/**
	 * Already added custom assets in head.
	 *
	 * @var boolean
	 */
	private static $already_added_custom_assets = false;

	/**
	 * Already add styles.
	 *
	 * @var array
	 */
	private static $already_added_styles = array();

	/**
	 * List with assets to skip from Autoptimize when CSS generated.
	 *
	 * @var array
	 */
	protected static $skip_from_autoptimize = array(
		'ghostkit-blocks-content-custom-css',
		'ghostkit-blocks-widget-custom-css',
	);

	/**
	 * GhostKit_Assets constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_scripts' ) );
		add_action( 'plugins_loaded', array( $this, 'enqueue_scripts_action' ), 11 );
		add_action( 'ghostkit_parse_blocks', array( $this, 'maybe_enqueue_blocks_assets' ), 11, 2 );
		add_action( 'wp_enqueue_scripts', array( $this, 'add_custom_assets' ), 100 );

		add_action( 'autoptimize_filter_css_exclude', 'GhostKit_Assets::autoptimize_filter_css_exclude' );

		// enqueue runtime.
		add_action( 'enqueue_block_editor_assets', 'GhostKit_Assets::enqueue_runtime', 11 );
		add_action( 'wp_enqueue_scripts', 'GhostKit_Assets::enqueue_runtime', 8 );
	}

	/**
	 * Check if Webpack HMR file available.
	 *
	 * @return boolean
	 */
	public static function is_webpack_hmr_support() {
		return file_exists( ghostkit()->plugin_path . 'build/runtime.js' );
	}

	/**
	 * Enqueue runtime script.
	 */
	public static function enqueue_runtime() {
		// HMR Webpack.
		if ( self::is_webpack_hmr_support() ) {
			self::enqueue_script( 'ghostkit-runtime', 'build/runtime', array(), null, false );
		}
	}

	/**
	 * Get .asset.php file data.
	 *
	 * @param string $filepath asset file path.
	 * @param string $filetype asset file type [style|script].
	 *
	 * @return array
	 */
	public static function get_asset_file( $filepath, $filetype = '' ) {
		$asset_path = ghostkit()->plugin_path . str_replace( '.min', '', $filepath ) . '.asset.php';

		if ( file_exists( $asset_path ) ) {
			// phpcs:ignore WPThemeReview.CoreFunctionality.FileInclude.FileIncludeFound
			return include $asset_path;
		} elseif ( ! empty( $filetype ) ) {
			$file_ext       = 'style' === $filetype ? 'css' : 'js';
			$full_file_path = ghostkit()->plugin_path . $filepath . '.' . $file_ext;
			$file_version   = file_exists( $full_file_path ) ? filemtime( $full_file_path ) : null;
		}

		return array(
			'dependencies' => array(),
			'version'      => $file_version ?? GHOSTKIT_VERSION,
		);
	}

	/**
	 * Register script.
	 *
	 * @param string  $name asset name.
	 * @param string  $path file path.
	 * @param array   $dependencies asset dependencies.
	 * @param string  $version asset version.
	 * @param boolean $in_footer render in footer.
	 */
	public static function register_script( $name, $path, $dependencies = array(), $version = null, $in_footer = true ) {
		global $current_screen;

		$script_data = self::get_asset_file( $path, 'script' );

		if ( ! empty( $dependencies ) ) {
			$script_data['dependencies'] = array_unique(
				array_merge(
					$script_data['dependencies'],
					$dependencies
				)
			);
		}

		// Fix for Widgets screen.
		if ( isset( $current_screen->id ) && 'widgets' === $current_screen->id ) {
			foreach ( array( 'wp-edit-post', 'wp-editor' ) as $skip ) {
				$key = array_search( $skip, $script_data['dependencies'], true );

				if ( false !== $key ) {
					unset( $script_data['dependencies'][ $key ] );
				}
			}
		}

		wp_register_script(
			$name,
			ghostkit()->plugin_url . $path . '.js',
			$script_data['dependencies'],
			$version ?? $script_data['version'],
			$in_footer
		);
	}

	/**
	 * Enqueue script.
	 *
	 * @param string  $name asset name.
	 * @param string  $path file path.
	 * @param array   $dependencies asset dependencies.
	 * @param string  $version asset version.
	 * @param boolean $in_footer render in footer.
	 */
	public static function enqueue_script( $name, $path, $dependencies = array(), $version = null, $in_footer = true ) {
		self::register_script( $name, $path, $dependencies, $version, $in_footer );

		wp_enqueue_script( $name );
	}

	/**
	 * Register style
	 *
	 * @param string $name asset name.
	 * @param string $path file path.
	 * @param array  $dependencies asset dependencies.
	 * @param string $version asset version.
	 */
	public static function register_style( $name, $path, $dependencies = array(), $version = null ) {
		$style_data = self::get_asset_file( $path, 'style' );

		wp_register_style(
			$name,
			ghostkit()->plugin_url . $path . '.css',
			$dependencies,
			$version ?? $style_data['version']
		);
	}

	/**
	 * Enqueue style
	 *
	 * @param string $name asset name.
	 * @param string $path file path.
	 * @param array  $dependencies asset dependencies.
	 * @param string $version asset version.
	 */
	public static function enqueue_style( $name, $path, $dependencies = array(), $version = null ) {
		self::register_style( $name, $path, $dependencies, $version );

		wp_enqueue_style( $name );
	}

	/**
	 * Store used assets, so we can enqueue it later.
	 *
	 * @param string      $name - asset name.
	 * @param bool|string $value - just enqueue flag or url to asset.
	 * @param string      $type - assets type [script|style|custom-css].
	 * @param int         $priority - asset enqueue priority.
	 */
	public static function store_used_assets( $name, $value = true, $type = 'script', $priority = 10 ) {
		if ( ! isset( self::$stored_assets[ $type ] ) ) {
			return;
		}

		// We need to check for duplicate assets, which may be added because of custom locations.
		// Sometimes custom CSS is duplicated in Astra or Blocksy themes.
		if ( 'custom-css' === $type ) {
			if ( in_array( $value, self::$already_added_styles, true ) ) {
				return;
			}
			self::$already_added_styles[] = $value;
		}

		if ( isset( self::$stored_assets[ $type ][ $name ] ) ) {
			if ( 'custom-css' === $type ) {
				if ( ! self::$stored_assets[ $type ][ $name ]['value'] ) {
					self::$stored_assets[ $type ][ $name ]['value'] = '';
				}

				self::$stored_assets[ $type ][ $name ]['value'] .= $value;
			}

			do_action( 'gkt_assets_store', $name, $value, $type, $priority );

			return;
		}

		self::$stored_assets[ $type ][ $name ] = array(
			'value'    => $value,
			'priority' => $priority,
		);

		do_action( 'gkt_assets_store', $name, $value, $type, $priority );
	}

	/**
	 * Enqueue stored assets.
	 *
	 * @param string $type - assets type [script|style|custom-css].
	 */
	public static function enqueue_stored_assets( $type = 'script' ) {
		if ( ! isset( self::$stored_assets[ $type ] ) || empty( self::$stored_assets[ $type ] ) ) {
			return;
		}

		uasort(
			self::$stored_assets[ $type ],
			function ( $a, $b ) {
				if ( $a === $b ) {
					return 0;
				}

				if ( isset( $a['priority'] ) && isset( $b['priority'] ) ) {
					return $a['priority'] < $b['priority'] ? -1 : 1;
				}

				return 0;
			}
		);

		foreach ( self::$stored_assets[ $type ] as $name => $data ) {
			if ( isset( $data['value'] ) && $data['value'] ) {
				if ( 'script' === $type ) {
					wp_enqueue_script( $name );
				} elseif ( 'style' === $type ) {
					wp_enqueue_style( $name );
				} elseif ( 'custom-css' === $type ) {
					self::add_custom_css( $name, $data['value'] );
				}

				self::$stored_assets[ $type ]['value'] = false;
			}
		}
	}

	/**
	 * Enqueue assets for blocks.
	 *
	 * @param array  $blocks - blocks array.
	 * @param string $location - blocks location [content,widget].
	 */
	public static function enqueue( $blocks = array(), $location = 'content' ) {
		self::store_used_assets( 'ghostkit', true, 'style', 9 );
		self::store_used_assets( 'ghostkit', true, 'script', 11 );

		$blocks_css = '';

		// Prepare blocks assets.
		foreach ( $blocks as $block ) {
			// GhostKit blocks.
			if ( isset( $block['blockName'] ) && strpos( $block['blockName'], 'ghostkit/' ) === 0 ) {
				$block_name = preg_replace( '/^ghostkit\//', '', $block['blockName'] );

				self::store_used_assets( 'ghostkit-block-' . $block_name, true, 'style' );
				self::store_used_assets( 'ghostkit-block-' . $block_name, true, 'script' );
			}

			// Filter blocks custom CSS.
			if ( isset( $block['blockName'] ) ) {
				$custom_styles = apply_filters( 'gkt_block_custom_styles', '', $block );

				if ( ! empty( $custom_styles ) ) {
					if ( ! empty( $blocks_css ) ) {
						$blocks_css .= ' ';
					}

					$blocks_css .= $custom_styles;
				}
			}
		}

		// Store custom CSS.
		if ( ! empty( $blocks_css ) && $blocks_css ) {
			self::store_used_assets( 'ghostkit-blocks-' . $location . '-custom-css', ghostkit()->replace_vars( $blocks_css ), 'custom-css' );
		}
	}

	/**
	 * Enqueue scripts and styles actions.
	 * We need this to be used inside 'plugins_loaded' action to prevent conflicts with plugins and themes.
	 *
	 * 1. Enqueue plugins assets
	 * 2. Enqueue Ghost Kit assets
	 * 3. Enqueue theme assets
	 * 4. Enqueue Ghost Kit custom css
	 */
	public function enqueue_scripts_action() {
		add_action( 'wp_enqueue_scripts', array( $this, 'wp_enqueue_head_assets' ) );
		add_action( 'wp_footer', array( $this, 'wp_enqueue_foot_assets' ) );

		// Custom css with higher priority to overwrite theme styles.
		add_action( 'wp_enqueue_scripts', array( $this, 'wp_enqueue_head_custom_assets' ), 11 );
		add_action( 'wp_footer', array( $this, 'wp_enqueue_foot_custom_assets' ), 11 );
	}

	/**
	 * Register scripts that will be used in the future when portfolio will be printed.
	 */
	public function register_scripts() {
		$css_deps = array();
		$js_deps  = array( 'ghostkit-helper', 'ghostkit-event-fallbacks' );

		do_action( 'gkt_before_assets_register' );

		// Motion.
		if ( apply_filters( 'gkt_enqueue_plugin_motion', true ) ) {
			self::register_script( 'motion', 'assets/vendor/motion/dist/motion.min', array(), '11.15.0' );

			$js_deps[] = 'motion';
		}

		// Ivent.
		if ( apply_filters( 'gkt_enqueue_plugin_ivent', true ) ) {
			self::register_script( 'ivent', 'assets/vendor/ivent/dist/ivent.min', array(), '0.2.0' );
		}

		// Jarallax.
		if ( apply_filters( 'gkt_enqueue_plugin_jarallax', true ) ) {
			self::register_script( 'jarallax', 'assets/vendor/jarallax/dist/jarallax.min', array(), '2.0.1' );
			self::register_script( 'jarallax-video', 'assets/vendor/jarallax/dist/jarallax-video.min', array( 'jarallax' ), '2.0.1' );
		}

		// Swiper.
		if ( apply_filters( 'gkt_enqueue_plugin_swiper', true ) ) {
			// Add legacy swiper version in order to support Elementor plugin.
			// https://wordpress.org/support/topic/visual-portfolio-elementor-issue/.
			if ( class_exists( '\Elementor\Plugin' ) ) {
				self::register_style( 'swiper', 'assets/vendor/swiper-5-4-5/swiper.min', array(), '5.4.5' );
				self::register_script( 'swiper', 'assets/vendor/swiper-5-4-5/swiper.min', array(), '5.4.5' );
			} else {
				self::register_style( 'swiper', 'assets/vendor/swiper/swiper-bundle.min', array(), '8.4.6' );
				self::register_script( 'swiper', 'assets/vendor/swiper/swiper-bundle.min', array(), '8.4.6' );
			}
		}

		// Luxon.
		if ( apply_filters( 'gkt_enqueue_plugin_luxon', true ) ) {
			self::register_script( 'luxon', 'assets/vendor/luxon/build/global/luxon.min', array(), '3.3.0' );
		}

		// Lottie Player.
		if ( apply_filters( 'gkt_enqueue_plugin_lottie_player', true ) ) {
			self::register_script( 'lottie-player', 'assets/vendor/lottie-player/dist/lottie-player', array(), '2.0.3' );
			wp_script_add_data( 'lottie-player', 'async', true );
		}

		// GistEmbed.
		if ( apply_filters( 'gkt_enqueue_plugin_gist_simple', true ) ) {
			self::register_style( 'gist-simple', 'assets/vendor/gist-simple/dist/gist-simple', array(), '2.0.0' );
			self::register_script( 'gist-simple', 'assets/vendor/gist-simple/dist/gist-simple.min', array(), '2.0.0' );
		}

		// Google reCaptcha.
		$recaptcha_site_key   = get_option( 'ghostkit_google_recaptcha_api_site_key' );
		$recaptcha_secret_key = get_option( 'ghostkit_google_recaptcha_api_secret_key' );

		if ( apply_filters( 'gkt_enqueue_google_recaptcha', true ) && $recaptcha_site_key && $recaptcha_secret_key ) {
			wp_register_script( 'google-recaptcha', 'https://www.google.com/recaptcha/api.js?render=' . esc_attr( $recaptcha_site_key ), array(), '3.0.0', true );
		}

		// Get all sidebars.
		$sidebars = array();
		if ( ! empty( $GLOBALS['wp_registered_sidebars'] ) ) {
			foreach ( $GLOBALS['wp_registered_sidebars'] as $k => $sidebar ) {
				$sidebars[ $k ] = array(
					'id'   => $sidebar['id'],
					'name' => $sidebar['name'],
				);
			}
		}

		// helper script.
		self::register_script(
			'ghostkit-helper',
			'build/assets/js/helper',
			array( 'ivent' )
		);

		// Google Maps prepare localization as in WordPress settings.
		$gmaps_locale = get_locale();
		$gmaps_suffix = '.com';
		switch ( $gmaps_locale ) {
			case 'he_IL':
				// Hebrew correction.
				$gmaps_locale = 'iw';
				break;
			case 'zh_CN':
				// Chinese integration.
				$gmaps_suffix = '.cn';
				break;
		}
		$gmaps_locale = substr( $gmaps_locale, 0, 2 );

		$theme_data = wp_get_theme( get_template() );

		$breakpoints = GhostKit_Breakpoints::get_breakpoints();

		$timezone = wp_timezone_string();

		if ( substr( $timezone, 0, 1 ) === '+' || substr( $timezone, 0, 1 ) === '-' ) {
			$timezone = 'UTC' . $timezone;
		}

		$global_data = array(
			'version'                     => GHOSTKIT_VERSION,
			'pro'                         => false,

			'themeName'                   => $theme_data->get( 'Name' ),
			'settings'                    => get_option( 'ghostkit_settings', array() ),
			'disabledBlocks'              => get_option( 'ghostkit_disabled_blocks', array() ),

			// TODO: Due to different formats in scss and assets there is an offset.
			'media_sizes'                 => array(
				'sm' => $breakpoints['xs'],
				'md' => $breakpoints['sm'],
				'lg' => $breakpoints['md'],
				'xl' => $breakpoints['lg'],
			),
			'timezone'                    => $timezone,
			'googleMapsAPIKey'            => get_option( 'ghostkit_google_maps_api_key' ),
			'googleMapsAPIUrl'            => 'https://maps.googleapis' . $gmaps_suffix . '/maps/api/js?v=3.exp&language=' . esc_attr( $gmaps_locale ),
			'googleReCaptchaAPISiteKey'   => $recaptcha_site_key,
			'googleReCaptchaAPISecretKey' => is_admin() ? $recaptcha_secret_key : '',
			'sidebars'                    => $sidebars,
			'icons'                       => is_admin() ? apply_filters( 'gkt_icons_list', array() ) : array(),
			'shapes'                      => is_admin() ? apply_filters( 'gkt_shapes_list', array() ) : array(),
			'fonts'                       => is_admin() ? apply_filters( 'gkt_fonts_list', array() ) : array(),
			'customTypographyList'        => is_admin() ? apply_filters( 'gkt_custom_typography', array() ) : array(),
			'admin_url'                   => admin_url(),
			'admin_templates_url'         => admin_url( 'edit.php?post_type=ghostkit_template' ),
		);

		$global_data = apply_filters( 'gkt_global_data', $global_data );

		wp_localize_script(
			'ghostkit-helper',
			'ghostkitVariables',
			$global_data
		);

		// events fallback script.
		self::register_script(
			'ghostkit-event-fallbacks',
			'build/assets/js/event-fallbacks',
			array( 'ghostkit-helper' )
		);

		// Fallback for classic themes.
		if ( ! wp_is_block_theme() ) {
			self::register_style(
				'ghostkit-classic-theme-fallback',
				'assets/css/fallback-classic-theme'
			);
			$css_deps[] = 'ghostkit-classic-theme-fallback';
		}

		// Ghost Kit.
		self::register_style(
			'ghostkit',
			'build/gutenberg/style',
			$css_deps
		);
		wp_style_add_data( 'ghostkit', 'rtl', 'replace' );
		wp_style_add_data( 'ghostkit', 'suffix', '.min' );

		self::register_script(
			'ghostkit',
			'build/assets/js/main',
			$js_deps
		);

		// Extensions.
		foreach ( glob( ghostkit()->plugin_path . 'build/gutenberg/extend/*/frontend.js' ) as $file ) {
			$ext_name       = basename( dirname( $file ) );
			$ext_script_url = 'build/gutenberg/extend/' . $ext_name . '/frontend';
			$ext_js_deps    = array( 'ghostkit' );

			switch ( $ext_name ) {
				case 'effects':
					$ext_js_deps[] = 'motion';
					break;
			}

			self::register_script(
				'ghostkit-extension-' . $ext_name,
				$ext_script_url,
				array_unique( $ext_js_deps )
			);
			self::store_used_assets( 'ghostkit-extension-' . $ext_name, true, 'script' );
		}

		// Style Variants.
		foreach ( glob( ghostkit()->plugin_path . 'build/gutenberg/style-variants/*/frontend.js' ) as $template ) {
			$ext_name       = basename( dirname( $template ) );
			$ext_script_url = 'build/gutenberg/style-variants/' . $ext_name . '/frontend';
			$ext_js_deps    = array( 'ghostkit' );

			self::register_script(
				'ghostkit-style-variant-' . $ext_name,
				$ext_script_url,
				array_unique( $ext_js_deps )
			);
			self::store_used_assets( 'ghostkit-style-variant-' . $ext_name, true, 'script' );
		}

		// Blocks.
		foreach ( glob( ghostkit()->plugin_path . 'build/gutenberg/blocks/*/frontend.js' ) as $file ) {
			$block_name       = basename( dirname( $file ) );
			$block_script_url = 'build/gutenberg/blocks/' . $block_name . '/frontend';
			$block_js_deps    = array( 'ghostkit' );

			switch ( $block_name ) {
				case 'accordion':
				case 'alert':
					$block_js_deps[] = 'motion';
					break;
				case 'grid':
				case 'grid-column':
					if ( wp_script_is( 'jarallax-video' ) || wp_script_is( 'jarallax-video', 'registered' ) ) {
						$block_js_deps[] = 'jarallax-video';
					}
					if ( wp_script_is( 'jarallax' ) || wp_script_is( 'jarallax', 'registered' ) ) {
						$block_js_deps[] = 'jarallax';
					}
					break;
				case 'video':
					if ( wp_script_is( 'jarallax-video' ) || wp_script_is( 'jarallax-video', 'registered' ) ) {
						$block_js_deps[] = 'jarallax-video';
					}
					break;
				case 'gist':
					if ( wp_script_is( 'gist-simple' ) || wp_script_is( 'gist-simple', 'registered' ) ) {
						$block_js_deps[] = 'gist-simple';
					}
					break;
				case 'carousel':
					if ( wp_script_is( 'swiper' ) || wp_script_is( 'swiper', 'registered' ) ) {
						$block_js_deps[] = 'swiper';
					}
					break;
				case 'countdown':
					$block_js_deps[] = 'luxon';
					break;
				case 'form':
					if ( wp_script_is( 'google-recaptcha' ) || wp_script_is( 'google-recaptcha', 'registered' ) ) {
						$block_js_deps[] = 'google-recaptcha';
					}
					$block_js_deps[] = 'wp-i18n';
					break;
				case 'lottie':
					$block_js_deps[] = 'motion';
					$block_js_deps[] = 'lottie-player';
					break;
				case 'tabs':
					$block_name = 'tabs-v2';
					break;
			}

			self::register_script(
				'ghostkit-block-' . $block_name,
				$block_script_url,
				array_unique( $block_js_deps )
			);
		}
		foreach ( glob( ghostkit()->plugin_path . 'build/gutenberg/blocks/*/styles/style.css' ) as $file ) {
			$block_name      = basename( dirname( dirname( $file ) ) );
			$block_style_url = 'build/gutenberg/blocks/' . $block_name . '/styles/style';
			$block_css_deps  = array( 'ghostkit' );

			switch ( $block_name ) {
				case 'gist':
					$block_css_deps[] = 'gist-simple';
					break;
				case 'carousel':
					$block_css_deps[] = 'swiper';
					break;
				case 'tabs':
					$block_name = 'tabs-v2';
					break;
			}

			self::register_style(
				'ghostkit-block-' . $block_name,
				$block_style_url,
				array_unique( $block_css_deps )
			);
			wp_style_add_data( 'ghostkit-block-' . $block_name, 'rtl', 'replace' );
			wp_style_add_data( 'ghostkit-block-' . $block_name, 'suffix', '.min' );
		}

		do_action( 'gkt_after_assets_register' );
	}

	/**
	 * Enqueue styles in head.
	 */
	public function wp_enqueue_head_assets() {
		self::enqueue_stored_assets( 'style' );
		self::enqueue_stored_assets( 'script' );
	}

	/**
	 * Enqueue custom styles in head.
	 */
	public function wp_enqueue_head_custom_assets() {
		self::enqueue_stored_assets( 'custom-css' );
	}

	/**
	 * Enqueue scripts and styles in foot.
	 */
	public function wp_enqueue_foot_assets() {
		self::enqueue_stored_assets( 'style' );
		self::enqueue_stored_assets( 'script' );
	}

	/**
	 * Enqueue custom styles in foot.
	 */
	public function wp_enqueue_foot_custom_assets() {
		self::enqueue_stored_assets( 'custom-css' );
	}

	/**
	 * Enqueue blocks assets.
	 *
	 * @param array $blocks - blocks array.
	 * @param array $location - blocks location [content,widget].
	 */
	public function maybe_enqueue_blocks_assets( $blocks, $location ) {
		if ( self::$already_added_custom_assets ) {
			$location = 'widget';
		}

		self::enqueue( $blocks, $location );
	}

	/**
	 * Add styles from blocks to the head section.
	 *
	 * @param int $post_id - current post id.
	 */
	public function add_custom_assets( $post_id ) {
		$global_code = get_option( 'ghostkit_custom_code', array() );

		if ( is_singular() && ! $post_id ) {
			$post_id = get_the_ID();
		}

		$is_single = is_singular() && $post_id;

		// Global custom CSS.
		if ( $global_code && isset( $global_code['ghostkit_custom_css'] ) && $global_code['ghostkit_custom_css'] ) {
			self::add_custom_css( 'ghostkit-global-custom-css', $global_code['ghostkit_custom_css'] );
		}

		// Local custom CSS.
		if ( $is_single ) {
			$meta_css = get_post_meta( $post_id, 'ghostkit_custom_css', true );

			if ( ! empty( $meta_css ) ) {
				self::add_custom_css( 'ghostkit-custom-css', $meta_css );
			}
		}

		// Global custom JS head.
		if ( $global_code && isset( $global_code['ghostkit_custom_js_head'] ) && $global_code['ghostkit_custom_js_head'] ) {
			self::add_custom_js( 'ghostkit-global-custom-js-head', $global_code['ghostkit_custom_js_head'] );
		}

		// Local custom JS head.
		if ( $is_single ) {
			$meta_js_head = get_post_meta( $post_id, 'ghostkit_custom_js_head', true );

			if ( ! empty( $meta_js_head ) ) {
				self::add_custom_js( 'ghostkit-custom-js-head', $meta_js_head );
			}
		}

		// Global custom JS foot.
		if ( $global_code && isset( $global_code['ghostkit_custom_js_foot'] ) && $global_code['ghostkit_custom_js_foot'] ) {
			self::add_custom_js( 'ghostkit-global-custom-js-foot', $global_code['ghostkit_custom_js_foot'], true );
		}

		// Local custom JS foot.
		if ( $is_single ) {
			$meta_js_foot = get_post_meta( $post_id, 'ghostkit_custom_js_foot', true );

			if ( ! empty( $meta_js_foot ) ) {
				self::add_custom_js( 'ghostkit-custom-js-foot', $meta_js_foot, true );
			}
		}

		self::$already_added_custom_assets = true;
	}

	/**
	 * Skip custom styles from Autoptimize.
	 * We need this since generated CSS with custom breakpoints are excluded
	 * from Autoptimize by default and this cause conflicts.
	 *
	 * @param string $result - allowed list.
	 * @return string
	 */
	public static function autoptimize_filter_css_exclude( $result ) {
		$upload_dir = defined( 'UPLOADS' ) ? UPLOADS : 'wp-content/uploads/';

		// By default in Autoptimize excluded folder `wp-content/uploads/`.
		// We need to check, if this folder is not excluded, then we
		// don't need to use our hack.
		if ( $result && strpos( $result, $upload_dir ) === false ) {
			return $result;
		}

		foreach ( self::$skip_from_autoptimize as $name ) {
			if ( $result ) {
				$result .= ',';
			} else {
				$result = '';
			}

			$result .= $name;
		}

		return $result;
	}

	/**
	 * Add custom CSS.
	 *
	 * @param string $name - handle name.
	 * @param string $css - code.
	 */
	public static function add_custom_css( $name, $css ) {
		if ( ! wp_style_is( $name, 'enqueued' ) ) {
			$css = wp_kses( $css, array( '\'', '\"' ) );
			$css = str_replace( '&gt;', '>', $css );

			$allow_js_fallback = apply_filters( 'gkt_custom_css_allow_js_fallback', self::$already_added_custom_assets, $name, $css );

			// Enqueue custom CSS.
			if ( ! $allow_js_fallback ) {
				wp_register_style( $name, false, array(), GHOSTKIT_VERSION );
				wp_enqueue_style( $name );
				wp_add_inline_style( $name, $css );

				// Enqueue JS instead of CSS when rendering in <body> to prevent W3C errors.
			} elseif ( ! wp_script_is( $name, 'enqueued' ) ) {
				wp_register_script( $name, false, array(), GHOSTKIT_VERSION, true );
				wp_enqueue_script( $name );
				wp_add_inline_script(
					$name,
					'(function(){
                        var styleTag = document.createElement("style");
                        styleTag.id = "' . esc_attr( $name ) . '-inline-css";
                        styleTag.innerHTML = ' . wp_json_encode( $css ) . ';
                        document.body.appendChild(styleTag);
                    }());'
				);
			}
		}

		self::$stored_assets[] = $name;
	}

	/**
	 * Add custom JS.
	 *
	 * @param string  $name - handle name.
	 * @param string  $js - code.
	 * @param boolean $footer - print in footer.
	 */
	public static function add_custom_js( $name, $js, $footer = false ) {
		wp_register_script( $name, '', array(), GHOSTKIT_VERSION, $footer );
		wp_enqueue_script( $name );
		wp_add_inline_script( $name, $js );
	}
}

new GhostKit_Assets();
