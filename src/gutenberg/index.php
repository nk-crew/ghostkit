<?php
/**
 * Additional PHP for blocks.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once ghostkit()->plugin_path . 'gutenberg/blocks/widgetized-area/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/instagram/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/twitter/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/table-of-contents/block.php';

require_once ghostkit()->plugin_path . 'gutenberg/plugins/customizer/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/plugins/custom-code/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/plugins/typography/index.php';
