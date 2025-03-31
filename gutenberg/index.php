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
 * Register all blocks.
 */
function ghostkit_register_blocks() {
	// Find all json and php files of blocks.
	$all_block_json = glob( ghostkit()->plugin_path . 'gutenberg/blocks/*/block.json' );
	$all_block_php  = glob( ghostkit()->plugin_path . 'gutenberg/blocks/*/block.php' );

	foreach ( $all_block_json as $path ) {
		$php_file_path = str_replace( '.json', '.php', $path );
		$there_is_php  = in_array( $php_file_path, $all_block_php, true );

		// Don't register block if there is php file,
		// which already should contains the registration code.
		if ( ! $there_is_php ) {
			register_block_type_from_metadata( $path );
		}
	}
}
add_action( 'init', 'ghostkit_register_blocks' );

require_once ghostkit()->plugin_path . 'gutenberg/blocks/icon/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/widgetized-area/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/instagram/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/twitter/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/table-of-contents/block.php';

require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/text/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/email/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/name/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/url/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/phone/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/number/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/date/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/textarea/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/select/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/submit/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/checkbox/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/radio/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/hidden/block.php';

require_once ghostkit()->plugin_path . 'gutenberg/plugins/color-palette/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/plugins/customizer/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/plugins/custom-code/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/plugins/typography/index.php';
