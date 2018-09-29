<?php
/**
 * Additional PHP for blocks.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once( ghostkit()->plugin_path . 'blocks/widgetized-area/block.php' );
require_once( ghostkit()->plugin_path . 'blocks/instagram/block.php' );
require_once( ghostkit()->plugin_path . 'blocks/twitter/block.php' );
require_once( ghostkit()->plugin_path . 'blocks/customizer/block.php' );
require_once( ghostkit()->plugin_path . 'blocks/custom-css/block.php' );
