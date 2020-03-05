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
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/checkbox/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/radio/block.php';
require_once ghostkit()->plugin_path . 'gutenberg/blocks/form/fields/hidden/block.php';

require_once ghostkit()->plugin_path . 'gutenberg/plugins/customizer/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/plugins/custom-code/index.php';
require_once ghostkit()->plugin_path . 'gutenberg/plugins/typography/index.php';
