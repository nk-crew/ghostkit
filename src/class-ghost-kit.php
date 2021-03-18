<?php
/**
 * Plugin Name:  Ghost Kit
 * Description:  Blocks collection and extensions for Gutenberg
 * Version:      @@plugin_version
 * Author:       nK
 * Author URI:   https://nkdev.info
 * License:      GPLv2 or later
 * License URI:  https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:  @@text_domain
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

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

        // settings.
        require_once $this->plugin_path . 'settings/index.php';

        // additional blocks php.
        require_once $this->plugin_path . 'gutenberg/index.php';

        // rest.
        require_once $this->plugin_path . 'classes/class-rest.php';

        // parse blocks.
        require_once $this->plugin_path . 'classes/class-parse-blocks.php';

        // assets.
        require_once $this->plugin_path . 'classes/class-assets.php';

        // reusable widget.
        require_once $this->plugin_path . 'classes/class-reusable-widget.php';

        // icons.
        require_once $this->plugin_path . 'classes/class-icons.php';

        // icons fallback.
        require_once $this->plugin_path . 'classes/class-icons-fallback.php';

        // shapes.
        require_once $this->plugin_path . 'classes/class-shapes.php';

        // color palette.
        require_once $this->plugin_path . 'classes/class-color-palette.php';

        // fonts.
        require_once $this->plugin_path . 'classes/class-fonts.php';

        // typography.
        require_once $this->plugin_path . 'classes/class-typography.php';

        // templates.
        require_once $this->plugin_path . 'classes/class-templates.php';

        // scss compiler.
        require_once $this->plugin_path . 'classes/class-scss-compiler.php';

        // breakpoints background.
        require_once $this->plugin_path . 'classes/class-breakpoints-background.php';

        // breakpoints.
        require_once $this->plugin_path . 'classes/class-breakpoints.php';

        // custom block styles class.
        require_once $this->plugin_path . 'gutenberg/extend/styles/get-styles.php';

        // block users custom CSS class.
        require_once $this->plugin_path . 'gutenberg/extend/custom-css/get-custom-css.php';

        // 3rd.
        require_once $this->plugin_path . 'classes/3rd/class-rank-math.php';
    }

    /**
     * Init hooks
     */
    public function init_hooks() {
        add_action( 'admin_init', array( $this, 'admin_init' ) );

        add_action( 'init', array( $this, 'add_custom_fields_support' ), 100 );

        add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), array( $this, 'add_go_pro_link_plugins_page' ) );

        $this->php_translation();
        add_action( 'wp_enqueue_scripts', array( $this, 'js_translation' ), 11 );
        add_action( 'enqueue_block_editor_assets', array( $this, 'js_translation_editor' ) );

        // add Ghost Kit blocks category.
        add_filter( 'block_categories', array( $this, 'block_categories' ), 9 );

        // CSS Vars Polyfill.
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_css_vars_polyfill' ) );
        add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_css_vars_polyfill' ) );

        // we need to enqueue the main script earlier to let 3rd-party plugins add custom styles support.
        add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ), 9 );
    }

    /**
     * PHP translations.
     */
    public function php_translation() {
        load_plugin_textdomain( '@@text_domain', false, plugin_dir_path( __FILE__ ) . '/languages' );
    }

    /**
     * JS translation.
     */
    public function js_translation() {
        if ( ! function_exists( 'wp_set_script_translations' ) ) {
            return;
        }

        wp_set_script_translations( 'ghostkit-block-countdown', '@@text_domain', plugin_dir_path( __FILE__ ) . '/languages' );
    }

    /**
     * JS translation for editor.
     */
    public function js_translation_editor() {
        if ( ! function_exists( 'wp_set_script_translations' ) ) {
            return;
        }

        wp_set_script_translations( 'ghostkit-editor', '@@text_domain', plugin_dir_path( __FILE__ ) . '/languages' );
        wp_set_script_translations( 'ghostkit-settings', '@@text_domain', plugin_dir_path( __FILE__ ) . '/languages' );
    }

    /**
     * Register Ghost Kit blocks category
     *
     * @param array $categories - available categories.
     * @return array
     */
    public function block_categories( $categories ) {
        return array_merge(
            array(
                array(
                    'slug'  => 'ghostkit',
                    'title' => __( 'Ghost Kit', '@@text_domain' ),
                ),
            ),
            $categories
        );
    }

    /**
     * Enqueue CSS Vars polyfill.
     */
    public function enqueue_css_vars_polyfill() {
        $polyfill_name    = 'ie11-custom-properties';
        $polyfill_version = '4.1.0';
        $polyfill_url     = ghostkit()->plugin_url . 'assets/vendor/ie11-custom-properties/ie11CustomProperties.js?ver=' . $polyfill_version;

        // Already added in 3rd-party code.
        if ( wp_script_is( $polyfill_name ) || wp_script_is( $polyfill_name, 'registered' ) ) {
            return;
        }

        wp_register_script( $polyfill_name, '', array(), $polyfill_version, true );
        wp_enqueue_script( $polyfill_name );
        wp_add_inline_script(
            $polyfill_name,
            '!function( d ) {
                // For IE11 only.
                if( window.MSInputMethodContext && document.documentMode ) {
                    var s = d.createElement( \'script\' );
                    s.src = \'' . esc_url( $polyfill_url ) . '\';
                    d.head.appendChild( s );
                }
            }(document)'
        );
    }

    /**
     * Enqueue editor assets
     */
    public function enqueue_block_editor_assets() {
        $css_deps = array();
        $js_deps  = array( 'ghostkit-helper', 'wp-block-editor', 'wp-blocks', 'wp-date', 'wp-i18n', 'wp-element', 'wp-edit-post', 'wp-compose', 'underscore', 'wp-hooks', 'wp-components', 'wp-keycodes', 'moment', 'jquery' );

        // Jarallax.
        if ( apply_filters( 'gkt_enqueue_plugin_jarallax', true ) ) {
            $js_deps[] = 'jarallax';
            $js_deps[] = 'jarallax-video';
        }

        // GistEmbed.
        if ( apply_filters( 'gkt_enqueue_plugin_gist_simple', true ) ) {
            $css_deps[] = 'gist-simple';
            $js_deps[]  = 'gist-simple';
        }

        // Ghost Kit.
        wp_enqueue_style(
            'ghostkit-editor',
            plugins_url( 'gutenberg/editor.min.css', __FILE__ ),
            $css_deps,
            filemtime( plugin_dir_path( __FILE__ ) . 'gutenberg/editor.min.css' )
        );
        wp_style_add_data( 'ghostkit-editor', 'rtl', 'replace' );
        wp_style_add_data( 'ghostkit-editor', 'suffix', '.min' );

        wp_enqueue_script(
            'ghostkit-editor',
            plugins_url( 'gutenberg/index.min.js', __FILE__ ),
            $js_deps,
            filemtime( plugin_dir_path( __FILE__ ) . 'gutenberg/index.min.js' ),
            true
        );
    }

    /**
     * Init variables
     */
    public function admin_init() {
        // get current plugin data.
        $data                        = get_plugin_data( __FILE__ );
        $this->plugin_name           = $data['Name'];
        $this->plugin_version        = $data['Version'];
        $this->plugin_slug           = plugin_basename( __FILE__, '.php' );
        $this->plugin_name_sanitized = basename( __FILE__, '.php' );
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
     * @param String $str styles string.
     * @return String string with replaced vars.
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
     * @param Array $links - available links.
     *
     * @return array
     */
    public function add_go_pro_link_plugins_page( $links ) {
        return array_merge(
            $links,
            array(
                '<a target="_blank" href="admin.php?page=ghostkit_go_pro">' . esc_html__( 'Go Pro', '@@text_domain' ) . '</a>',
            )
        );
    }

    /**
     * Get Go Pro link
     *
     * @return string
     */
    public function go_pro_link() {
        return 'https://ghostkit.io/pricing/';
    }

    /**
     * Fallback function.
     *
     * @param array $blocks Blocks array with attributes.
     * @return string
     */
    public function parse_blocks_css( $blocks ) {
        return GhostKit_Assets::parse_blocks_css( $blocks );
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
