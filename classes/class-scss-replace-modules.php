<?php
/**
 * Find all SCSS files and remove unsupported math.div module.
 *
 * We have to look at all scss files in our plugin and replace modules syntax,
 * because SCSSPHP does not support it yet.
 *
 * @package ghostkit
 */

/**
 * GhostKit_Scss_Replace_Modules
 */
class GhostKit_Scss_Replace_Modules {
	/**
	 * GhostKit_Scss_Replace_Modules constructor.
	 *
	 * @param string $plugin_path - plugin path.
	 */
	public function __construct( $plugin_path ) {
		// Find all SCSS files and remove unsupported math.div module.
		$scss_files = array();

		$di = new RecursiveDirectoryIterator( trailingslashit( $plugin_path ), RecursiveDirectoryIterator::SKIP_DOTS );
		$it = new RecursiveIteratorIterator( $di );

		foreach ( $it as $file ) {
			if ( pathinfo( $file, PATHINFO_EXTENSION ) === 'scss' ) {
				$scss_files[] = $file->getPathname();
			}
		}

		foreach ( $scss_files as $scss_file_path ) {
            // phpcs:ignore
            $original_contents = file_get_contents( $scss_file_path );
			$file_contents     = $original_contents;

			if ( $file_contents ) {
				// find module include.
				$file_contents = str_replace( '@use "sass:math";', '', $file_contents );
				$file_contents = str_replace( '@use "sass:map";', '', $file_contents );
				$file_contents = str_replace( '@use "sass:list";', '', $file_contents );
				$file_contents = str_replace( '@use "sass:string";', '', $file_contents );

				// find math.div calls.
				preg_match_all( '/math\.div(?=\()(?:(?=.*?\((?!.*?\1)(.*\)(?!.*\2).*))(?=.*?\)(?!.*?\2)(.*)).)+?.*?(?=\1)[^(]*(?=\2$)/ms', $file_contents, $file_contents_calls );
				if ( ! empty( $file_contents_calls[0] ) ) {
					foreach ( $file_contents_calls[0] as $content ) {
						$new_file_contents = $content;
						$new_file_contents = str_replace( 'math.div', '', $new_file_contents );
						$new_file_contents = preg_replace( '/\,/', ' /', $new_file_contents, 1 );

						$file_contents = str_replace( $content, $new_file_contents, $file_contents );
					}
				}

				// find map calls.
				$file_contents = str_replace( 'map.get(', 'map-get(', $file_contents );
				$file_contents = str_replace( 'map.values(', 'map-values(', $file_contents );

				// find list calls.
				$file_contents = str_replace( 'list.index(', 'index(', $file_contents );
				$file_contents = str_replace( 'list.nth(', 'nth(', $file_contents );

				// find string calls.
				$file_contents = str_replace( 'string.index(', 'str-index(', $file_contents );

				// Update file content.
				if ( $original_contents !== $file_contents ) {
                    // phpcs:ignore
                    file_put_contents( $scss_file_path, $file_contents );
				}

				// Freeing memory.
				unset( $scss_file_path );
				unset( $file_contents );
			}
		}
	}
}
