<?php
/**
 * Additional PHP for blocks.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * GhostKit_Settings
 */
class GhostKit_Settings {
	/**
	 * GhostKit_Settings constructor.
	 */
	public function __construct() {
		// Load admin style sheet and JavaScript.
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );

		// Sometimes redirect is not working on page opens. Admin Init is a solution.
		add_action( 'admin_init', array( $this, 'go_pro_redirect' ) );

		// Add the options page and menu item.
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
	}

	/**
	 * Register and enqueue admin-specific style sheet.
	 */
	public function admin_enqueue_scripts() {
		$screen = get_current_screen();

		GhostKit_Assets::enqueue_style(
			'ghostkit-admin',
			'build/assets/admin/css/admin',
			array(),
			filemtime( ghostkit()->plugin_path . 'build/assets/admin/css/admin.css' )
		);
		wp_style_add_data( 'ghostkit-admin', 'rtl', 'replace' );
		wp_style_add_data( 'ghostkit-admin', 'suffix', '.min' );

		GhostKit_Assets::enqueue_style(
			'ghostkit-settings',
			'build/settings/style',
			array(),
			filemtime( ghostkit()->plugin_path . 'build/settings/style.css' )
		);
		wp_style_add_data( 'ghostkit-settings', 'rtl', 'replace' );
		wp_style_add_data( 'ghostkit-settings', 'suffix', '.min' );

		if ( 'toplevel_page_ghostkit' !== $screen->id ) {
			return;
		}

		$block_editor_context = new WP_Block_Editor_Context();

		// Preload server-registered block schemas.
		wp_add_inline_script(
			'wp-blocks',
			'wp.blocks.unstable__bootstrapServerSideBlockDefinitions(' . wp_json_encode( get_block_editor_server_block_settings() ) . ');'
		);

		wp_add_inline_script(
			'wp-blocks',
			sprintf( 'wp.blocks.setCategories( %s );', wp_json_encode( get_block_categories( $block_editor_context ) ) ),
			'after'
		);

        // phpcs:ignore
        do_action( 'enqueue_block_editor_assets' );

        // phpcs:ignore
        do_action( 'enqueue_block_assets' );

		// Ghost Kit Settings.
		GhostKit_Assets::enqueue_script(
			'ghostkit-settings',
			'build/settings/index',
			array( 'ghostkit-helper' )
		);

		wp_localize_script(
			'ghostkit-settings',
			'ghostkitSettingsData',
			array(
				'api_nonce' => wp_create_nonce( 'wp_rest' ),
				'api_url'   => rest_url( 'ghostkit/v1/' ),
			)
		);

		wp_enqueue_style( 'wp-components' );

		if ( function_exists( 'wp_enqueue_media' ) ) {
			wp_enqueue_media();
		}
	}

	/**
	 * Go Pro.
	 * Redirect to the Pro purchase page.
	 */
	public function go_pro_redirect() {
        // phpcs:ignore
        if ( ! isset( $_GET['page'] ) || empty( $_GET['page'] ) ) {
			return;
		}

        // phpcs:ignore
        if ( 'ghostkit_go_pro' === $_GET['page'] ) {
			$medium = 'admin_menu';

            // phpcs:ignore
            if ( isset( $_GET['utm_medium'] ) ) {
                // phpcs:ignore
                $medium = $_GET['utm_medium'];
			}

            // phpcs:ignore
            wp_redirect( ghostkit()->go_pro_link() . '?utm_source=plugin&utm_medium=' . esc_attr( $medium ) . '&utm_campaign=go_pro&utm_content=' . GHOSTKIT_VERSION );
			exit();
		}
	}

	/**
	 * Add admin menu.
	 */
	public function admin_menu() {
		add_menu_page(
			esc_html__( 'Ghost Kit', 'ghostkit' ),
			esc_html__( 'Ghost Kit', 'ghostkit' ),
			'manage_options',
			'ghostkit',
			array( $this, 'display_admin_page' ),
            // phpcs:ignore
            'data:image/svg+xml;base64,' . base64_encode( file_get_contents( ghostkit()->plugin_path . 'assets/images/admin-icon.svg' ) ),
			56.9
		);

		add_submenu_page(
			'ghostkit',
			'',
			esc_html__( 'Blocks', 'ghostkit' ),
			'manage_options',
			'ghostkit'
		);
		add_submenu_page(
			'ghostkit',
			'',
			esc_html__( 'Icons', 'ghostkit' ),
			'manage_options',
			'admin.php?page=ghostkit&sub_page=icons'
		);
		add_submenu_page(
			'ghostkit',
			'',
			esc_html__( 'Typography', 'ghostkit' ),
			'manage_options',
			'admin.php?page=ghostkit&sub_page=typography'
		);
		add_submenu_page(
			'ghostkit',
			'',
			esc_html__( 'Fonts', 'ghostkit' ),
			'manage_options',
			'admin.php?page=ghostkit&sub_page=fonts'
		);
		add_submenu_page(
			'ghostkit',
			'',
			esc_html__( 'Breakpoints', 'ghostkit' ),
			'manage_options',
			'admin.php?page=ghostkit&sub_page=breakpoints'
		);
		add_submenu_page(
			'ghostkit',
			'',
			esc_html__( 'CSS & JavaScript', 'ghostkit' ),
			'manage_options',
			'admin.php?page=ghostkit&sub_page=css_js'
		);

		if ( GhostKit_Templates::is_allowed() ) {
			add_submenu_page(
				'ghostkit',
				'',
				esc_html__( 'Templates', 'ghostkit' ),
				'manage_options',
				'edit.php?post_type=ghostkit_template'
			);
		}

		add_submenu_page(
			'ghostkit',
			'',
			'<span class="dashicons dashicons-star-filled" style="font-size: 17px"></span> ' . esc_html__( 'Go Pro', 'ghostkit' ),
			'manage_options',
			'ghostkit_go_pro',
			array( $this, 'go_pro_redirect' )
		);

		global $wp_version;

		// Since WP 6.3 user have an ability to open the reusable blocks page
		// From the Appearance -> Editor -> Patterns.
		if ( ! version_compare( $wp_version, '6.3', '>=' ) ) {
			add_menu_page(
				esc_html__( 'Reusable Blocks', 'ghostkit' ),
				esc_html__( 'Reusable Blocks', 'ghostkit' ),
				'read',
				'edit.php?post_type=wp_block',
				'',
				'dashicons-editor-table',
				57
			);
		}
	}

	/**
	 * Render the admin page.
	 */
	public function display_admin_page() {
		?>
		<div class="ghostkit-admin-page"></div>
		<?php
	}
}

new GhostKit_Settings();
