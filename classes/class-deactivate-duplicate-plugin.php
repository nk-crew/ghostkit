<?php
/**
 * Checks if another version of Ghost Kit/Ghost Kit Pro is active and deactivates it.
 *
 * @package ghostkit/deactivate-duplicate-plugin
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Deactivate_Duplicate_Plugin
 */
class GhostKit_Deactivate_Duplicate_Plugin {
	/**
	 * GhostKit_Deactivate_Duplicate_Plugin constructor.
	 */
	public function __construct() {
		add_action( 'activated_plugin', array( $this, 'deactivate_other_instances' ) );
		add_action( 'pre_current_active_plugins', array( $this, 'plugin_deactivated_notice' ) );
	}

	/**
	 * Checks if another version of Ghost Kit/Ghost Kit Pro is active and deactivates it.
	 * Hooked on `activated_plugin` so other plugin is deactivated when current plugin is activated.
	 *
	 * @param string $plugin The plugin being activated.
	 */
	public function deactivate_other_instances( $plugin ) {
		if ( ! in_array( $plugin, array( 'ghostkit/class-ghost-kit.php', 'ghostkit-pro/class-ghost-kit-pro.php' ), true ) ) {
			return;
		}

		$plugin_to_deactivate  = 'ghostkit/class-ghost-kit.php';
		$deactivated_notice_id = 1;

		// If we just activated the free version, deactivate the Pro version.
		if ( $plugin === $plugin_to_deactivate ) {
			$plugin_to_deactivate  = 'ghostkit-pro/class-ghost-kit-pro.php';
			$deactivated_notice_id = 2;
		}

		if ( is_multisite() && is_network_admin() ) {
			$active_plugins = (array) get_site_option( 'active_sitewide_plugins', array() );
			$active_plugins = array_keys( $active_plugins );
		} else {
			$active_plugins = (array) get_option( 'active_plugins', array() );
		}

		foreach ( $active_plugins as $plugin_basename ) {
			if ( $plugin_to_deactivate === $plugin_basename ) {
				set_transient( 'gkt_deactivated_notice_id', $deactivated_notice_id, 1 * HOUR_IN_SECONDS );
				deactivate_plugins( $plugin_basename );
				return;
			}
		}
	}

	/**
	 * Displays a notice when either Ghost Kit or Ghost Kit Pro is automatically deactivated.
	 */
	public function plugin_deactivated_notice() {
		$deactivated_notice_id = (int) get_transient( 'gkt_deactivated_notice_id' );
		if ( ! in_array( $deactivated_notice_id, array( 1, 2 ), true ) ) {
			return;
		}

		$message = __( "Ghost Kit and Ghost Kit Pro should not be active at the same time. We've automatically deactivated Ghost Kit.", 'ghostkit' );
		if ( 2 === $deactivated_notice_id ) {
			$message = __( "Ghost Kit and Ghost Kit Pro should not be active at the same time. We've automatically deactivated Ghost Kit Pro.", 'ghostkit' );
		}

		?>
		<div class="notice notice-warning">
			<p><?php echo esc_html( $message ); ?></p>
		</div>
		<?php

		delete_transient( 'gkt_deactivated_notice_id' );
	}
}

new GhostKit_Deactivate_Duplicate_Plugin();
