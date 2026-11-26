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
		$this->migrate_templates();

		// Migration code added after `$this->initial_version` plugin version.
		$saved_version   = get_option( 'ghostkit_db_version', $this->initial_version );
		$current_version = $this->version;

		foreach ( $this->get_migrations() as $migration ) {
			if (
				version_compare( $saved_version, $migration['version'], '<' ) &&
				// A migration keyed above the plugin version belongs to a later release and waits for it.
				version_compare( $migration['version'], $current_version, '<=' )
			) {
				call_user_func( $migration['cb'] );
			}
		}

		if ( version_compare( $saved_version, $current_version, '<' ) ) {
			update_option( 'ghostkit_db_version', $current_version );
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
			array(
				'version' => '3.7.2',
				'cb'      => array( $this, 'v_3_7_2' ),
			),
		);
	}

	/**
	 * Copy legacy templates once, retrying incomplete copies on the next request.
	 */
	public function migrate_templates() {
		global $wpdb;

		if ( get_option( 'ghostkit_patterns_migrated' ) ) {
			return;
		}

		$lock = 'ghostkit_patterns_' . md5( DB_NAME . ':' . $wpdb->posts );

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		if ( '1' !== (string) $wpdb->get_var( $wpdb->prepare( 'SELECT GET_LOCK(%s, 0)', $lock ) ) ) {
			return;
		}

		try {
			if ( get_option( 'ghostkit_patterns_migrated' ) ) {
				return;
			}

			register_taxonomy( 'ghostkit_template_category', 'ghostkit_template', array( 'public' => false ) );

			// phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$templates = $wpdb->get_col( $wpdb->prepare( "SELECT ID FROM {$wpdb->posts} WHERE post_type = %s AND post_status <> 'auto-draft' ORDER BY ID", 'ghostkit_template' ) );

			if ( $wpdb->last_error ) {
				return;
			}

			foreach ( $templates as $template_id ) {
				$template = get_post( $template_id );

				if ( $template && ! $this->copy_template( $template ) ) {
					return;
				}
			}

			update_option( 'ghostkit_patterns_migrated', true );
		} finally {
			// phpcs:ignore WordPress.DB.DirectDatabaseQuery
			$wpdb->get_var( $wpdb->prepare( 'SELECT RELEASE_LOCK(%s)', $lock ) );
		}
	}

	/**
	 * Copy one legacy template without overwriting a completed pattern.
	 *
	 * @param WP_Post $template Legacy template.
	 * @return bool
	 */
	private function copy_template( $template ) {
		global $wpdb;

		$marker     = 'ghostkit_template:' . $template->ID;
		$trash_time = 'trash' === $template->post_status ? get_post_meta( $template->ID, '_wp_trash_meta_time', true ) : '';

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery
		$pattern = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT posts.ID, posts.post_content_filtered
				FROM {$wpdb->posts} posts
				LEFT JOIN {$wpdb->postmeta} meta ON posts.ID = meta.post_id AND meta.meta_key = '_ghostkit_template_id'
				WHERE posts.post_type = 'wp_block' AND (meta.meta_value = %d OR posts.post_content_filtered = %s)
				LIMIT 1",
				$template->ID,
				$marker
			)
		);

		if ( $wpdb->last_error ) {
			return false;
		}

		if ( $pattern && $marker !== $pattern->post_content_filtered ) {
			return $this->preserve_template_trash_time( (int) $pattern->ID, $trash_time );
		}

		$pattern_id = $pattern ? (int) $pattern->ID : wp_insert_post(
			array(
				'post_type'             => 'wp_block',
				'post_status'           => 'auto-draft',
				'post_title'            => $marker,
				'post_author'           => $template->post_author,
				'post_content_filtered' => $marker,
			),
			true
		);

		if ( is_wp_error( $pattern_id ) ) {
			return false;
		}

		$terms = wp_get_object_terms( $template->ID, 'ghostkit_template_category' );

		if ( is_wp_error( $terms ) ) {
			return false;
		}

		$categories = array();

		foreach ( $terms as $term ) {
			$category = get_term_by( 'slug', $term->slug, 'wp_pattern_category' );

			if ( $category ) {
				$categories[] = (int) $category->term_id;
				continue;
			}

			$category = wp_insert_term( $term->name, 'wp_pattern_category', array( 'slug' => $term->slug ) );

			if ( is_wp_error( $category ) ) {
				return false;
			}

			$categories[] = (int) $category['term_id'];
		}

		if ( is_wp_error( wp_set_object_terms( $pattern_id, $categories, 'wp_pattern_category' ) ) ) {
			return false;
		}

		$metadata = array(
			'_ghostkit_template_id'  => (string) $template->ID,
			'wp_pattern_sync_status' => 'unsynced',
		);

		if ( 'trash' === $template->post_status && metadata_exists( 'post', $template->ID, '_wp_trash_meta_status' ) ) {
			$metadata['_wp_trash_meta_status'] = get_post_meta( $template->ID, '_wp_trash_meta_status', true );
		}

		foreach ( $metadata as $key => $value ) {
			if ( get_post_meta( $pattern_id, $key, true ) !== $value && ! update_post_meta( $pattern_id, $key, $value ) ) {
				return false;
			}
		}

		$copy_markup = static function ( $data, $postarr ) use ( $pattern_id, $template ) {
			if ( (int) ( $postarr['ID'] ?? 0 ) === $pattern_id ) {
				$data['post_author']  = $template->post_author;
				$data['post_title']   = wp_slash( $template->post_title );
				$data['post_content'] = wp_slash( $template->post_content );
				$data['post_excerpt'] = '';
			}

			return $data;
		};

		add_filter( 'wp_insert_post_data', $copy_markup, 10, 2 );

		try {
			$result = wp_update_post(
				wp_slash(
					array(
						'ID'                    => $pattern_id,
						'post_title'            => $template->post_title,
						'post_content'          => $template->post_content,
						'post_excerpt'          => $marker,
						'post_status'           => $template->post_status,
						'post_date'             => $template->post_date,
						'post_date_gmt'         => $template->post_date_gmt,
						'edit_date'             => true,
						'post_password'         => $template->post_password,
						'post_content_filtered' => '',
					)
				),
				true
			);
		} finally {
			remove_filter( 'wp_insert_post_data', $copy_markup, 10 );
		}

		return ! is_wp_error( $result ) && $this->preserve_template_trash_time( $pattern_id, $trash_time );
	}

	/**
	 * Set the purge timestamp only after WordPress sees the pattern as trashed.
	 *
	 * @param int    $pattern_id The destination pattern.
	 * @param string $trash_time The original purge timestamp.
	 * @return bool
	 */
	private function preserve_template_trash_time( $pattern_id, $trash_time ) {
		if ( '' === $trash_time || 'trash' !== get_post_status( $pattern_id ) || metadata_exists( 'post', $pattern_id, '_wp_trash_meta_time' ) ) {
			return true;
		}

		return (bool) add_post_meta( $pattern_id, '_wp_trash_meta_time', $trash_time, true );
	}

	/**
	 * Remove what the runtime SCSS compiler left behind: compiled CSS in uploads,
	 * the cron event of its queue, and the options of the queue.
	 */
	public function v_3_7_2() {
		global $wpdb;

		$upload_dir = wp_get_upload_dir();

		GhostKit_Breakpoints::remove_dir( $upload_dir['basedir'] . '/ghostkit/gutenberg' );

		wp_clear_scheduled_hook( 'ghostkit_run_breakpoints_processing_cron' );

		delete_option( 'ghostkit_saved_breakpoints_hash' );

		// The queue kept its batches and status as site options: sitemeta on multisite, options otherwise.
		delete_site_option( 'ghostkit_run_breakpoints_processing_status' );

		$batch_like = $wpdb->esc_like( 'ghostkit_run_breakpoints_processing_batch_' ) . '%';

		if ( is_multisite() ) {
			// phpcs:ignore
			$batch_options = $wpdb->get_col(
				$wpdb->prepare(
					"SELECT meta_key FROM {$wpdb->sitemeta} WHERE site_id = %d AND meta_key LIKE %s",
					get_current_network_id(),
					$batch_like
				)
			);
		} else {
			// phpcs:ignore
			$batch_options = $wpdb->get_col(
				$wpdb->prepare(
					"SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE %s",
					$batch_like
				)
			);
		}

		foreach ( $batch_options as $batch_option ) {
			delete_site_option( $batch_option );
		}
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
