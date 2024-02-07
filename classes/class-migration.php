<?php
/**
 * Migrations
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class GhostKit_Migrations
 */
class GhostKit_Migrations {
	/**
	 * The version.
	 *
	 * @var string
	 */
	protected $version = GHOSTKIT_VERSION;

	/**
	 * Initial version.
	 *
	 * @var string
	 */
	protected $initial_version = '2.25.0';

	/**
	 * GhostKit_Migrations constructor.
	 */
	public function __construct() {
		if ( is_admin() ) {
			add_action( 'admin_init', array( $this, 'init' ), 3 );
		} else {
			add_action( 'wp', array( $this, 'init' ), 3 );
		}
	}

	/**
	 * Init.
	 */
	public function init() {
		// Migration code added after `$this->initial_version` plugin version.
		$saved_version   = get_option( 'vpf_db_version', $this->initial_version );
		$current_version = $this->version;

		foreach ( $this->get_migrations() as $migration ) {
			if ( version_compare( $saved_version, $migration['version'], '<' ) ) {
				call_user_func( $migration['cb'] );
			}
		}

		if ( version_compare( $saved_version, $current_version, '<' ) ) {
			update_option( 'vpf_db_version', $current_version );
		}
	}

	/**
	 * Get all available migrations.
	 *
	 * @return array
	 */
	public function get_migrations() {
		return array(
			array(
				'version' => '2.25.1',
				'cb'      => array( $this, 'v_2_25_1' ),
			),
		);
	}

	/**
	 * Fix typography with google-fonts category.
	 */
	public function v_2_25_1() {
		$current_typography_encode = get_option( 'ghostkit_typography', array() );
		$typography_migrated       = false;
		if ( ! empty( $current_typography_encode ) ) {
			$current_typography_decode = json_decode( $current_typography_encode['ghostkit_typography'], true );
			$fonts_list                = apply_filters( 'gkt_fonts_list', array() );
			if ( ! empty( $current_typography_decode ) && ! empty( $fonts_list ) ) {
				foreach ( $current_typography_decode as &$typography ) {
					if (
						isset( $typography['fontFamilyCategory'] ) &&
						'default' === $typography['fontFamilyCategory'] &&
						isset( $typography['fontFamily'] )
					) {
						// Find typography font from fonts list default category.
						$found_default_font = null !== $fonts_list['default']['fonts'] ? array_search( $typography['fontFamily'], array_column( $fonts_list['default']['fonts'], 'name' ), true ) : false;
						// If not find, search font from google fonts category.
						if ( false === $found_default_font ) {
							$found_google_font = array_search( $typography['fontFamily'], array_column( $fonts_list['google-fonts']['fonts'], 'name' ), true );
							if ( false !== $found_google_font ) {
								$typography['fontFamilyCategory'] = 'google-fonts';
								$typography_migrated              = true;
							}
						}
					}
				}
				if ( $typography_migrated ) {
					$current_typography_encode['ghostkit_typography'] = wp_json_encode( $current_typography_decode );
					update_option( 'ghostkit_typography', $current_typography_encode );
				}
			}
		}
	}
}

new GhostKit_Migrations();
