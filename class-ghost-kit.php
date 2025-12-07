<?php
/**
 * Plugin Name:  Ghost Kit
 * Description:  Page Builder Blocks and Extensions for Gutenberg
 * Version:      3.4.6
 * Plugin URI:   https://www.ghostkit.io/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=byline
 * Author:       Ghost Kit Team
 * Author URI:   https://www.ghostkit.io/?utm_source=wordpress.org&utm_medium=readme&utm_campaign=byline
 * License:      GPLv2 or later
 * License URI:  https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:  ghostkit
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'GHOSTKIT_VERSION' ) ) {
	define( 'GHOSTKIT_VERSION', '3.4.6' );
}

if ( ! class_exists( 'GhostKit' ) ) :
	/**
	 * GhostKit Class
	 */
	class GhostKit {

		/**
		 * The single class instance.
		 *
		 * @var $instance
		 */
		private static $instance = null;

		/**
		 * Path to the plugin directory
		 *
		 * @var $plugin_path
		 */
		public $plugin_path;

		/**
		 * URL to the plugin directory
		 *
		 * @var $plugin_url
		 */
		public $plugin_url;

		/**
		 * Plugin name
		 *
		 * @var $plugin_name
		 */
		public $plugin_name;

		/**
		 * Plugin version
		 *
		 * @var $plugin_version
		 */
		public $plugin_version;

		/**
		 * Plugin slug
		 *
		 * @var $plugin_slug
		 */
		public $plugin_slug;

		/**
		 * Plugin name sanitized
		 *
		 * @var $plugin_name_sanitized
		 */
		public $plugin_name_sanitized;

		/**
		 * GhostKit constructor.
		 */
		public function __construct() {
			/* We do nothing here! */
		}

		/**
		 * Main Instance
		 * Ensures only one instance of this class exists in memory at any one time.
		 */
		public static function instance() {
			if ( is_null( self::$instance ) ) {
				self::$instance = new self();
				self::$instance->init_options();
				self::$instance->init_hooks();
			}
			return self::$instance;
		}

		/**
		 * Init options
		 */
		public function init_options() {
			$this->plugin_path = plugin_dir_path( __FILE__ );
			$this->plugin_url  = plugin_dir_url( __FILE__ );

			require_once $this->plugin_path . 'settings/index.php';
			require_once $this->plugin_path . 'gutenberg/index.php';

			require_once $this->plugin_path . 'classes/class-rest.php';
			require_once $this->plugin_path . 'classes/class-parse-blocks.php';
			require_once $this->plugin_path . 'classes/class-assets.php';
			require_once $this->plugin_path . 'classes/class-reusable-widget.php';
			require_once $this->plugin_path . 'classes/class-icons.php';
			require_once $this->plugin_path . 'classes/class-shapes.php';
			require_once $this->plugin_path . 'classes/class-typography.php';
			require_once $this->plugin_path . 'classes/class-fonts.php';
			require_once $this->plugin_path . 'classes/class-templates.php';
			require_once $this->plugin_path . 'classes/class-scss-replace-modules.php';
			require_once $this->plugin_path . 'classes/class-scss-compiler.php';
			require_once $this->plugin_path . 'classes/class-breakpoints-background.php';
			require_once $this->plugin_path . 'classes/class-breakpoints.php';
			require_once $this->plugin_path . 'classes/class-ask-review.php';
			require_once $this->plugin_path . 'classes/class-deactivate-duplicate-plugin.php';

			require_once $this->plugin_path . 'gutenberg/utils/encode-decode/index.php';
			require_once $this->plugin_path . 'gutenberg/extend/index.php';

			// 3rd.
			require_once $this->plugin_path . 'classes/3rd/class-astra.php';
			require_once $this->plugin_path . 'classes/3rd/class-page-builder-framework.php';
			require_once $this->plugin_path . 'classes/3rd/class-blocksy.php';
			require_once $this->plugin_path . 'classes/3rd/class-rank-math.php';

			// Migration.
			require_once $this->plugin_path . 'classes/class-migration.php';
		}

		/**
		 * Init hooks
		 */
		public function init_hooks() {
			add_action( 'admin_init', array( $this, 'admin_init' ) );

			add_action( 'init', array( $this, 'init_hook' ) );

			add_action( 'init', array( $this, 'add_custom_fields_support' ), 100 );

			add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), array( $this, 'add_go_pro_link_plugins_page' ) );

			add_action( 'wp_enqueue_scripts', array( $this, 'js_translation' ), 11 );
			add_action( 'enqueue_block_editor_assets', array( $this, 'js_translation_editor' ) );

			// add Ghost Kit blocks category.
			add_filter( 'block_categories_all', array( $this, 'block_categories_all' ), 9999 );

			// we need to enqueue the main script earlier to let 3rd-party plugins add custom styles support.
			add_action( 'enqueue_block_assets', array( $this, 'enqueue_block_assets' ), 9 );

			// add support for excerpts to some blocks.
			add_filter( 'excerpt_allowed_blocks', array( $this, 'excerpt_allowed_blocks' ) );

			// add support for additional mimes.
			add_filter( 'upload_mimes', array( $this, 'upload_mimes' ), 100 );
			add_filter( 'wp_check_filetype_and_ext', array( $this, 'wp_check_filetype_and_ext' ), 100, 3 );
		}

		/**
		 * JS translation.
		 */
		public function js_translation() {
			if ( ! function_exists( 'wp_set_script_translations' ) ) {
				return;
			}

			wp_set_script_translations( 'ghostkit-block-countdown', 'ghostkit', plugin_dir_path( __FILE__ ) . '/languages' );
		}

		/**
		 * JS translation for editor.
		 */
		public function js_translation_editor() {
			if ( ! function_exists( 'wp_set_script_translations' ) ) {
				return;
			}

			wp_set_script_translations( 'ghostkit-editor', 'ghostkit', plugin_dir_path( __FILE__ ) . '/languages' );
			wp_set_script_translations( 'ghostkit-settings', 'ghostkit', plugin_dir_path( __FILE__ ) . '/languages' );
		}

		/**
		 * Register Ghost Kit blocks category
		 *
		 * @param array $categories - available categories.
		 * @return array
		 */
		public function block_categories_all( $categories ) {
			return array_merge(
				array(
					array(
						'slug'  => 'ghostkit',
						'title' => __( 'Ghost Kit', 'ghostkit' ),
					),
				),
				$categories
			);
		}

		/**
		 * Enqueue editor assets
		 */
		public function enqueue_block_assets() {
			if ( ! is_admin() ) {
				return;
			}

			global $current_screen;

			$css_deps = array();
			$js_deps  = array( 'ghostkit-helper' );

			// Ivent.
			if ( apply_filters( 'gkt_enqueue_plugin_ivent', true ) ) {
				$js_deps[] = 'ivent';
			}

			// Motion.
			if ( apply_filters( 'gkt_enqueue_plugin_motion', true ) ) {
				$js_deps[] = 'motion';
			}

			// Jarallax.
			if ( apply_filters( 'gkt_enqueue_plugin_jarallax', true ) ) {
				$js_deps[] = 'jarallax';
				$js_deps[] = 'jarallax-video';
			}

			// Luxon.
			if ( apply_filters( 'gkt_enqueue_plugin_luxon', true ) ) {
				$js_deps[] = 'luxon';
			}

			// Lottie Player.
			if ( apply_filters( 'gkt_enqueue_plugin_lottie_player', true ) ) {
				$js_deps[] = 'lottie-player';
			}

			// GistEmbed.
			if ( apply_filters( 'gkt_enqueue_plugin_gist_simple', true ) ) {
				$css_deps[] = 'gist-simple';
				$js_deps[]  = 'gist-simple';
			}

			// Ghost Kit.
			GhostKit_Assets::enqueue_style(
				'ghostkit-editor',
				'build/gutenberg/editor',
				$css_deps,
				filemtime( plugin_dir_path( __FILE__ ) . 'build/gutenberg/editor.css' )
			);
			wp_style_add_data( 'ghostkit-editor', 'rtl', 'replace' );
			wp_style_add_data( 'ghostkit-editor', 'suffix', '.min' );

			GhostKit_Assets::enqueue_script(
				'ghostkit-editor',
				'build/gutenberg/index',
				$js_deps
			);

			// Load plugins in editor only (skip legacy Widgets screen).
			if ( ! isset( $current_screen->id ) || 'widgets' !== $current_screen->id ) {
				GhostKit_Assets::enqueue_script(
					'ghostkit-editor-plugins',
					'build/gutenberg/plugins',
					array( 'ghostkit-editor' )
				);
			}
		}

		/**
		 * Excerpt allowed wrapper blocks.
		 *
		 * @param array $blocks - allowed blocks.
		 * @return array
		 */
		public function excerpt_allowed_blocks( $blocks ) {
			return array_merge(
				$blocks,
				array(
					'ghostkit/accordion',
					'ghostkit/accordion-item',
					'ghostkit/alert',
					'ghostkit/button',
					'ghostkit/carousel',
					'ghostkit/carousel-single',
					'ghostkit/changelog',
					'ghostkit/counter-box',
					'ghostkit/grid',
					'ghostkit/grid-column',
					'ghostkit/icon-box',
					'ghostkit/pricing-table',
					'ghostkit/pricing-table-item',
					'ghostkit/tabs-v2',
					'ghostkit/tabs-tab-v2',
					'ghostkit/testimonial',
				)
			);
		}

		/**
		 * Allow JSON uploads
		 *
		 * @param array $mimes supported mimes.
		 *
		 * @return array
		 */
		public function upload_mimes( $mimes ) {
			if ( ! isset( $mimes['json'] ) ) {
				$mimes['json'] = 'application/json';
			}

			return $mimes;
		}

		/**
		 * Allow JSON file uploads
		 *
		 * @param array  $data File data.
		 * @param array  $file File object.
		 * @param string $filename File name.
		 *
		 * @return array
		 */
		public function wp_check_filetype_and_ext( $data, $file, $filename ) {
			$ext = isset( $data['ext'] ) ? $data['ext'] : '';

			if ( ! $ext ) {
				$exploded = explode( '.', $filename );
				$ext      = strtolower( end( $exploded ) );
			}

			if ( 'json' === $ext ) {
				$data['type'] = 'application/json';
				$data['ext']  = 'json';
			}

			return $data;
		}

		/**
		 * Init variables
		 */
		public function admin_init() {
			// get current plugin data.
			$data                        = get_plugin_data( __FILE__ );
			$this->plugin_name           = $data['Name'];
			$this->plugin_version        = $data['Version'];
			$this->plugin_slug           = plugin_basename( __FILE__ );
			$this->plugin_name_sanitized = basename( __FILE__, '.php' );
		}

		/**
		 * Init hook
		 */
		public function init_hook() {
			load_plugin_textdomain( 'ghostkit', false, plugin_dir_path( __FILE__ ) . '/languages' );
		}

		/**
		 * Add support for 'custom-fields' for all post types.
		 * Required by Customizer and Custom CSS blocks.
		 */
		public function add_custom_fields_support() {
			$available_post_types = get_post_types(
				array(
					'show_ui' => true,
				),
				'object'
			);

			foreach ( $available_post_types as $post_type ) {
				if ( 'attachment' !== $post_type->name ) {
					add_post_type_support( $post_type->name, 'custom-fields' );
				}
			}
		}

		/**
		 * Equivalent of GHOSTKIT.replaceVars method.
		 *
		 * @param string $str styles string.
		 * @return string string with replaced vars.
		 */
		public function replace_vars( $str ) {
			$breakpoints = GhostKit_Breakpoints::get_breakpoints();
			// TODO: Due to different formats in scss and assets there is an offset.
			$vars = array(
				'media_sm' => '(max-width: ' . $breakpoints['xs'] . 'px)',
				'media_md' => '(max-width: ' . $breakpoints['sm'] . 'px)',
				'media_lg' => '(max-width: ' . $breakpoints['md'] . 'px)',
				'media_xl' => '(max-width: ' . $breakpoints['lg'] . 'px)',
			);

			foreach ( $vars as $k => $var ) {
				$str = preg_replace( "/#{ghostkitvar:$k}/", $var, $str );
			}

			return $str;
		}

		/**
		 * Add Go Pro link to plugins page.
		 *
		 * @param array $links - available links.
		 *
		 * @return array
		 */
		public function add_go_pro_link_plugins_page( $links ) {
			return array_merge(
				$links,
				array(
					'<a target="_blank" href="admin.php?page=ghostkit_go_pro&utm_medium=plugins_list">' . esc_html__( 'Go Pro', 'ghostkit' ) . '</a>',
				)
			);
		}

		/**
		 * Get Go Pro link
		 *
		 * @return string
		 */
		public function go_pro_link() {
			return 'https://www.ghostkit.io/pricing/';
		}
	}

	/**
	 * Function works with the GhostKit class instance
	 *
	 * @return object GhostKit
	 */
	function ghostkit() {
		return GhostKit::instance();
	}
	add_action( 'plugins_loaded', 'ghostkit' );
endif;
