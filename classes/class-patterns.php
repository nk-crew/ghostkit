<?php
/**
 * Patterns from legacy theme templates.
 *
 * @package ghostkit
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers the active theme's legacy templates as block patterns.
 */
class GhostKit_Patterns {
	/**
	 * Register patterns after core and the active theme.
	 */
	public static function register_theme_patterns() {
		foreach ( array_unique( array( get_stylesheet_directory(), get_template_directory() ) ) as $directory ) {
			$root = realpath( $directory );

			$files = glob( $directory . '/ghostkit/templates/*/content.php' );

			foreach ( (array) $files as $file ) {
				$slug = basename( dirname( $file ) );
				$path = realpath( $file );

				if ( ! $root || ! $path || ! str_starts_with( wp_normalize_path( $path ), wp_normalize_path( $root ) . '/ghostkit/templates/' ) || ! is_readable( $path ) || ! preg_match( '/^[a-zA-Z0-9_-]+$/', $slug ) ) {
					continue;
				}

				$name = 'ghostkit/' . $slug;

				if ( WP_Block_Patterns_Registry::get_instance()->is_registered( $name ) ) {
					continue;
				}

				$headers = get_file_data(
					$path,
					array(
						'title'    => 'Name',
						'category' => 'Category',
					)
				);

				$pattern = array(
					'title'    => '' !== $headers['title'] ? $headers['title'] : $slug,
					'filePath' => $path,
					'source'   => 'theme',
				);

				if ( $headers['category'] ) {
					$category = sanitize_title( $headers['category'] );

					if ( $category ) {
						$registry   = WP_Block_Pattern_Categories_Registry::get_instance();
						$registered = $registry->get_registered( $category );

						// WordPress REST remaps these legacy core category slugs.
						if ( in_array( $category, array( 'buttons', 'columns', 'query' ), true ) || ( $registered && $registered['label'] !== $headers['category'] ) ) {
							$category = 'ghostkit-' . $category;
						}

						if ( ! $registry->is_registered( $category ) ) {
							register_block_pattern_category( $category, array( 'label' => $headers['category'] ) );
						}
						$pattern['categories'] = array( $category );
					}
				}

				register_block_pattern( $name, $pattern );
			}
		}
	}

	/**
	 * Supply readable migrated patterns that core's editor query omits.
	 *
	 * @param array $settings Block editor settings.
	 * @return array
	 */
	public static function add_readable_template_patterns( $settings ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return $settings;
		}

		$patterns = get_posts(
			array(
				'post_type'      => 'wp_block',
				'post_status'    => array( 'publish', 'private' ),
				'posts_per_page' => -1,
				'meta_key'       => '_ghostkit_template_id', // phpcs:ignore WordPress.DB.SlowDBQuery
			)
		);

		foreach ( $patterns as $pattern ) {
			if ( ( 'publish' === $pattern->post_status && current_user_can( 'edit_post', $pattern->ID ) ) || ! current_user_can( 'read_post', $pattern->ID ) || 'unsynced' !== get_post_meta( $pattern->ID, 'wp_pattern_sync_status', true ) ) {
				continue;
			}

			$categories = wp_get_object_terms( $pattern->ID, 'wp_pattern_category', array( 'fields' => 'slugs' ) );

			$settings['ghostkitReadablePatterns'][] = array(
				'name'       => 'ghostkit/migrated-template-' . $pattern->ID,
				'id'         => $pattern->ID,
				'type'       => 'user',
				'title'      => $pattern->post_title,
				'categories' => is_wp_error( $categories ) ? array() : $categories,
				'content'    => $pattern->post_content,
				'syncStatus' => 'unsynced',
			);
		}

		return $settings;
	}

	/**
	 * Preserve legacy post capabilities on migrated patterns.
	 *
	 * @param string[] $caps Required primitive capabilities.
	 * @param string   $cap  Requested capability.
	 * @param int      $user User ID.
	 * @param array    $args Capability arguments.
	 * @return string[]
	 */
	public static function map_template_capabilities( $caps, $cap, $user, $args ) {
		if ( ! in_array( $cap, array( 'read_post', 'edit_post', 'delete_post', 'publish_post' ), true ) || empty( $args[0] ) ) {
			return $caps;
		}

		$pattern = get_post( $args[0] );

		if ( ! $pattern || 'wp_block' !== $pattern->post_type || ! get_post_meta( $pattern->ID, '_ghostkit_template_id', true ) ) {
			return $caps;
		}

		$mapping = array(
			'read_private_blocks'   => 'read_private_posts',
			'edit_private_blocks'   => 'edit_private_posts',
			'delete_private_blocks' => 'delete_private_posts',
			'publish_blocks'        => 'publish_posts',
		);

		return array_map(
			static function ( $primitive ) use ( $mapping ) {
				return $mapping[ $primitive ] ?? $primitive;
			},
			$caps
		);
	}
}

add_action( 'init', array( 'GhostKit_Patterns', 'register_theme_patterns' ), 20 );
add_filter( 'block_editor_settings_all', array( 'GhostKit_Patterns', 'add_readable_template_patterns' ) );
add_filter( 'map_meta_cap', array( 'GhostKit_Patterns', 'map_template_capabilities' ), 10, 4 );
