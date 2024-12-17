<?php
/**
 * Breakpoints
 *
 * @package ghostkit
 */

if ( ! class_exists( 'GhostKit_Breakpoints' ) ) {
	/**
	 * GhostKit_Breakpoints class
	 */
    // phpcs:ignore
    class GhostKit_Breakpoints {
		/**
		 * Extra Small Default Breakpoint.
		 *
		 * @var int
		 */
		protected static $default_xs = 576;

		/**
		 * Mobile Default Breakpoint.
		 *
		 * @var int
		 */
		protected static $default_sm = 768;

		/**
		 * Tablet Breakpoint.
		 *
		 * @var int
		 */
		protected static $default_md = 992;

		/**
		 * Desktop Breakpoint.
		 *
		 * @var int
		 */
		protected static $default_lg = 1200;

		/**
		 * Database saved hash option Name.
		 *
		 * @var string
		 */
		protected $database_saved_hash_option_name = 'ghostkit_saved_breakpoints_hash';

		/**
		 * Plugin name.
		 *
		 * @var string
		 */
		protected $plugin_name = 'ghostkit';

		/**
		 * Plugin version.
		 *
		 * @var string
		 */
		protected $plugin_version = GHOSTKIT_VERSION;

		/**
		 * Scss Configurations.
		 *
		 * @var array
		 */
		protected $scss_configs = array(
			'gutenberg/style.scss',
			'gutenberg/editor.scss',
			'gutenberg/blocks/*/styles/style.scss',
		);

		/**
		 * Compile Scss Configurations.
		 *
		 * @var array
		 */
		protected $compile_scss_configs;

		/**
		 * Background breakpoints processing.
		 *
		 * @var object
		 */
		protected $breakpoints_background_process;

		/**
		 * GhostKit_Breakpoints constructor.
		 */
		public function __construct() {
			if ( ! class_exists( 'GhostKit_Breakpoints_Background' ) ) {
				// breakpoints background.
				require_once __DIR__ . '/class-breakpoints-background.php';
			}

			$this->compile_scss_configs           = $this->get_compile_scss_configs();
			$this->breakpoints_background_process = new GhostKit_Breakpoints_Background();

			add_filter( 'style_loader_src', array( $this, 'change_style_src_to_compile' ), 10, 1 );
			add_action( 'gkt_before_assets_register', array( $this, 'maybe_compile_scss_files' ) );
		}

		/**
		 * Get plugin path.
		 *
		 * @return string
		 */
		public function get_plugin_path() {
			return ghostkit()->plugin_path;
		}

		/**
		 * Get plugin url.
		 *
		 * @return string
		 */
		public function get_plugin_url() {
			return ghostkit()->plugin_url;
		}

		/**
		 * Get compile scss configurations.
		 *
		 * @return array
		 */
		protected function get_compile_scss_configs() {
			$plugin_path          = $this->get_plugin_path();
			$upload_dir           = wp_upload_dir();
			$compile_scss_configs = array();
			$scss_paths           = apply_filters( 'gkt_scss_paths', $plugin_path );
			$scss_configs         = apply_filters( 'gkt_scss_configs', $this->scss_configs );

			if ( ! is_array( $scss_paths ) ) {
				$scss_paths = array( $scss_paths );
			}

			foreach ( $scss_configs as $scss_config ) {
				foreach ( $scss_paths as $path ) {
					$compile_scss_configs = $this->get_parsed_scss_files( $compile_scss_configs, $path, $upload_dir, $scss_config );
				}
			}

			return $compile_scss_configs;
		}

		/**
		 * Get parsed array of scss files
		 *
		 * @param array  $compile_scss_configs - Array of config width scss files.
		 * @param string $scss_path - Path to scss files.
		 * @param string $upload_dir - Uploas WP dir.
		 * @param string $scss_config - File search mask.
		 * @return array
		 */
		protected function get_parsed_scss_files( &$compile_scss_configs, $scss_path, $upload_dir, $scss_config ) {
			foreach ( glob( $scss_path . $scss_config ) as $template ) {
				$output_file = str_replace( $scss_path, $upload_dir['basedir'] . '/' . $this->plugin_name . '/', $template );
				$output_file = str_replace( '.scss', '.min.css', $output_file );

				$compile_scss_configs[] = array(
					'input_file'  => $template,
					'output_file' => $output_file,
				);
			}
			return $compile_scss_configs;
		}

		/**
		 * Change style src to compile css files.
		 *
		 * @param string $src - Url to style.
		 * @return string
		 */
		public function change_style_src_to_compile( $src ) {
			$plugin_url               = $this->get_plugin_url();
			$breakpoints              = self::get_breakpoints();
			$breakpoints_hash         = $this->get_breakpoints_hash( $breakpoints );
			$default_breakpoints_hash = $this->get_default_breakpoints_hash();

			if ( $breakpoints_hash !== $default_breakpoints_hash ) {
				$is_plugin_file = strstr( $src, $plugin_url );

				if ( $is_plugin_file ) {
					$configs       = $this->compile_scss_configs;
					$relative_uri  = str_replace( $plugin_url, '', $is_plugin_file );
					$relative_path = explode( '?ver=', $relative_uri )[0];
					$upload_dir    = wp_upload_dir();
					$output_file   = $upload_dir['basedir'] . '/' . $this->plugin_name . '/' . $relative_path;

					foreach ( $configs as $config ) {
						if (
							$config['output_file'] === $output_file &&
							file_exists( $output_file )
						) {
							// add hash to compiled CSS version to prevent problems with cache.
							$uri_with_hash_version = str_replace( '?ver=', '?ver=' . $breakpoints_hash . '.', $relative_uri );

							$src = $upload_dir['baseurl'] . '/' . $this->plugin_name . '/' . $uri_with_hash_version;
						}
					}
				}
			}

			return $src;
		}

		/**
		 * Get Breakpoints.
		 */
		public static function get_breakpoints() {
			$xs = self::get_breakpoint_xs();
			$xs = ( ! empty( $xs ) && $xs ) ? $xs : self::$default_xs;

			$sm = self::get_breakpoint_sm();
			$sm = ( ! empty( $sm ) && $sm ) ? $sm : self::$default_sm;

			$md = self::get_breakpoint_md();
			$md = ( ! empty( $md ) && $md ) ? $md : self::$default_md;

			$lg = self::get_breakpoint_lg();
			$lg = ( ! empty( $lg ) && $lg ) ? $lg : self::$default_lg;

			return array(
				'xs' => $xs,
				'sm' => $sm,
				'md' => $md,
				'lg' => $lg,
			);
		}

		/**
		 * Get default breakpoints.
		 *
		 * @return array
		 */
		public static function get_default_breakpoints() {
			return array(
				'xs' => self::get_default_breakpoint_xs(),
				'sm' => self::get_default_breakpoint_sm(),
				'md' => self::get_default_breakpoint_md(),
				'lg' => self::get_default_breakpoint_lg(),
			);
		}

		/**
		 * Get breakpoints Hash
		 *
		 * @param array $breakpoints - Breakpoints.
		 * @return string
		 */
		protected function get_breakpoints_hash( $breakpoints ) {
			return md5(
				wp_json_encode(
					array_merge(
						$breakpoints,
						array(
							$this->plugin_version,
						)
					)
				)
			);
		}

		/**
		 * Get default breakpoints Hash.
		 *
		 * @return string
		 */
		protected function get_default_breakpoints_hash() {
			return $this->get_breakpoints_hash(
				array(
					'xs' => self::$default_xs,
					'sm' => self::$default_sm,
					'md' => self::$default_md,
					'lg' => self::$default_lg,
				)
			);
		}

		/**
		 * Styles may need to be compiled if breakpoints have been changed.
		 *
		 * @return void
		 */
		public function maybe_compile_scss_files() {
			$breakpoints              = self::get_breakpoints();
			$breakpoints_hash         = $this->get_breakpoints_hash( $breakpoints );
			$default_breakpoints_hash = $this->get_default_breakpoints_hash();
			$saved_breakpoints_hash   = get_option( $this->database_saved_hash_option_name );

			if (
				$breakpoints_hash !== $saved_breakpoints_hash &&
				$breakpoints_hash !== $default_breakpoints_hash
			) {
				$compile_scss_configs = $this->compile_scss_configs;

				// Replace modules in all SCSS files.
				if ( ! empty( $compile_scss_configs ) ) {
					$plugin_path = $this->get_plugin_path();

					$scss_paths = apply_filters( 'gkt_scss_paths', $plugin_path );

					if ( ! is_array( $scss_paths ) ) {
						$scss_paths = array( $scss_paths );
					}

					foreach ( $scss_paths as $path ) {
						new GhostKit_Scss_Replace_Modules( $path );
					}
				}

				$breakpoints = self::get_breakpoints();

				$variables = array(
					'media-xs' => $breakpoints['xs'] . 'px',
					'media-sm' => $breakpoints['sm'] . 'px',
					'media-md' => $breakpoints['md'] . 'px',
					'media-lg' => $breakpoints['lg'] . 'px',
				);

				foreach ( $compile_scss_configs as $compile_scss_config ) {
					$scss_config_arguments = array_merge(
						$compile_scss_config,
						array(
							'variables'   => $variables,
						)
					);

					if ( ! file_exists( $compile_scss_config['output_file'] ) ) {
						new GhostKit_Scss_Compiler( $scss_config_arguments );
					} else {
						$this->breakpoints_background_process->push_to_queue( $scss_config_arguments );
					}
				}

				$this->breakpoints_background_process->save()->dispatch();

				update_option( $this->database_saved_hash_option_name, $breakpoints_hash );
			}
		}

		/**
		 * Get Default Extra Small Breakpoint.
		 *
		 * @return int
		 */
		public static function get_default_breakpoint_xs() {
			return apply_filters( 'gkt_default_breakpoint_xs', self::$default_xs );
		}

		/**
		 * Get Extra Small Breakpoint.
		 *
		 * @return int
		 */
		public static function get_breakpoint_xs() {
			return apply_filters( 'gkt_breakpoint_xs', self::get_default_breakpoint_xs() );
		}

		/**
		 * Get Default Mobile Breakpoint.
		 *
		 * @return int
		 */
		public static function get_default_breakpoint_sm() {
			return apply_filters( 'gkt_default_breakpoint_sm', self::$default_sm );
		}

		/**
		 * Get Mobile Breakpoint.
		 *
		 * @return int
		 */
		public static function get_breakpoint_sm() {
			return apply_filters( 'gkt_breakpoint_sm', self::get_default_breakpoint_sm() );
		}

		/**
		 * Get Default Tablet Breakpoint.
		 *
		 * @return int
		 */
		public static function get_default_breakpoint_md() {
			return apply_filters( 'gkt_default_breakpoint_md', self::$default_md );
		}

		/**
		 * Get Tablet Breakpoint.
		 *
		 * @return int
		 */
		public static function get_breakpoint_md() {
			return apply_filters( 'gkt_breakpoint_md', self::get_default_breakpoint_md() );
		}

		/**
		 * Get Default Desktop Breakpoint.
		 *
		 * @return int
		 */
		public static function get_default_breakpoint_lg() {
			return apply_filters( 'gkt_default_breakpoint_lg', self::$default_lg );
		}

		/**
		 * Get Desktop Breakpoint.
		 *
		 * @return int
		 */
		public static function get_breakpoint_lg() {
			return apply_filters( 'gkt_breakpoint_lg', self::get_default_breakpoint_lg() );
		}
	}
	new GhostKit_Breakpoints();
}
