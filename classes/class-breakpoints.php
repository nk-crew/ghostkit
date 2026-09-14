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
		 * Plugin name. Also the directory under uploads that holds the generated CSS.
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
		 * GhostKit_Breakpoints constructor.
		 */
		public function __construct() {
			add_filter( 'style_loader_src', array( $this, 'change_style_src_to_compile' ), 10, 1 );
			add_action( 'gkt_before_assets_register', array( $this, 'maybe_generate_css' ) );
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
		 * Name of the option that holds the hash and the list of generated files.
		 *
		 * @return string
		 */
		protected function get_option_name() {
			return str_replace( '-', '_', $this->plugin_name ) . '_breakpoints_css';
		}

		/**
		 * Directory under uploads that holds the generated CSS.
		 *
		 * @return string
		 */
		protected function get_output_dir() {
			$upload_dir = wp_get_upload_dir();

			return $upload_dir['basedir'] . '/' . $this->plugin_name;
		}

		/**
		 * Stored hash and list of generated files.
		 *
		 * @return array|false
		 */
		protected function get_generated_css() {
			$stored = get_option( $this->get_option_name() );

			if (
				! is_array( $stored ) ||
				! isset( $stored['hash'], $stored['files'] ) ||
				! is_array( $stored['files'] )
			) {
				return false;
			}

			return $stored;
		}

		/**
		 * Regenerate the CSS when the breakpoints or the plugin version changed.
		 *
		 * @return void
		 */
		public function maybe_generate_css() {
			$breakpoints = self::get_breakpoints();
			$hash        = $this->get_breakpoints_hash( $breakpoints );
			$stored      = $this->get_generated_css();

			if ( $hash === $this->get_default_breakpoints_hash() ) {
				if ( $stored ) {
					$this->remove_generated_css();
				}
				return;
			}

			if ( $stored && $stored['hash'] === $hash ) {
				return;
			}

			$this->remove_generated_css();

			update_option(
				$this->get_option_name(),
				array(
					'hash'  => $hash,
					'files' => $this->generate_css( $breakpoints ),
				)
			);
		}

		/**
		 * Write the built CSS files with the breakpoint values replaced into uploads.
		 *
		 * @param array $breakpoints - Breakpoints.
		 * @return array Paths of the written files, relative to the plugin directory.
		 */
		protected function generate_css( $breakpoints ) {
			$plugin_path = wp_normalize_path( $this->get_plugin_path() );
			$build_dir   = $plugin_path . 'build';
			$output_dir  = $this->get_output_dir();
			$files       = array();

			if ( ! is_dir( $build_dir ) ) {
				return $files;
			}

			try {
				$iterator = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $build_dir, FilesystemIterator::SKIP_DOTS ) );

				foreach ( $iterator as $file ) {
					if ( 'css' !== $file->getExtension() ) {
						continue;
					}

					$path = wp_normalize_path( $file->getPathname() );
                    // phpcs:ignore
                    $css  = file_get_contents( $path );

					if ( false === $css ) {
						continue;
					}

					$replaced = self::replace_breakpoints( $css, $breakpoints );

					if ( $replaced === $css ) {
						continue;
					}

					$relative = substr( $path, strlen( $plugin_path ) );
					$target   = $output_dir . '/' . $relative;

					if ( ! wp_mkdir_p( dirname( $target ) ) ) {
						continue;
					}

                    // phpcs:ignore
                    if ( false === file_put_contents( $target, $replaced ) ) {
						continue;
					}

					$files[] = $relative;
				}
			} catch ( UnexpectedValueException $e ) {
				// A directory PHP cannot open ends the walk; the files written so far are still served.
				unset( $e );
			}

			sort( $files );

			return $files;
		}

		/**
		 * Remove the generated CSS and the option that lists it.
		 *
		 * @return void
		 */
		protected function remove_generated_css() {
			self::remove_dir( $this->get_output_dir() . '/build' );
			delete_option( $this->get_option_name() );
		}

		/**
		 * Delete a directory with everything inside it.
		 *
		 * @param string $dir - Absolute path.
		 * @return void
		 */
		public static function remove_dir( $dir ) {
			if ( ! is_dir( $dir ) ) {
				return;
			}

			try {
				$iterator = new RecursiveIteratorIterator(
					new RecursiveDirectoryIterator( $dir, FilesystemIterator::SKIP_DOTS ),
					RecursiveIteratorIterator::CHILD_FIRST
				);

				foreach ( $iterator as $item ) {
					if ( $item->isDir() ) {
                        // phpcs:ignore
                        rmdir( $item->getPathname() );
					} else {
						wp_delete_file( $item->getPathname() );
					}
				}
			} catch ( UnexpectedValueException $e ) {
				// A directory PHP cannot open stays in place, with the directories above it.
				return;
			}

            // phpcs:ignore
            rmdir( $dir );
		}

		/**
		 * Replace the default breakpoint values inside `@media` preludes with the given ones.
		 *
		 * Only `(min-width: Npx)` and `(max-width: Npx)` whose N is a default breakpoint change,
		 * in one pass, so a custom value equal to another default is never replaced twice.
		 *
		 * @param string $css - CSS to process.
		 * @param array  $breakpoints - Breakpoints keyed xs, sm, md, lg.
		 * @return string
		 */
		public static function replace_breakpoints( $css, $breakpoints ) {
			$defaults = array(
				'xs' => self::$default_xs,
				'sm' => self::$default_sm,
				'md' => self::$default_md,
				'lg' => self::$default_lg,
			);
			$map      = array();

			foreach ( $defaults as $name => $default ) {
				if ( isset( $breakpoints[ $name ] ) ) {
					$map[ $default ] = (int) $breakpoints[ $name ];
				}
			}

			return preg_replace_callback(
				'/@media[^{;]*\{/',
				function ( $prelude ) use ( $map ) {
					return preg_replace_callback(
						'/\(\s*(min|max)-width\s*:\s*(\d+)px\s*\)/',
						function ( $query ) use ( $map ) {
							$value = (int) $query[2];

							if ( ! isset( $map[ $value ] ) ) {
								return $query[0];
							}

							return '(' . $query[1] . '-width:' . $map[ $value ] . 'px)';
						},
						$prelude[0]
					);
				},
				$css
			);
		}

		/**
		 * Serve the generated CSS instead of the plugin file when custom breakpoints are set.
		 *
		 * @param string $src - Url to style.
		 * @return string
		 */
		public function change_style_src_to_compile( $src ) {
			$stored = $this->get_generated_css();

			if ( ! $stored || empty( $stored['files'] ) ) {
				return $src;
			}

			$plugin_url = $this->get_plugin_url();

			if ( 0 !== strpos( $src, $plugin_url ) ) {
				return $src;
			}

			$path = strtok( substr( $src, strlen( $plugin_url ) ), '?' );

			if ( ! in_array( $path, $stored['files'], true ) ) {
				return $src;
			}

			if ( ! file_exists( $this->get_output_dir() . '/' . $path ) ) {
				return $src;
			}

			$upload_dir = wp_get_upload_dir();

			return add_query_arg( 'ver', $stored['hash'], $upload_dir['baseurl'] . '/' . $this->plugin_name . '/' . $path );
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
