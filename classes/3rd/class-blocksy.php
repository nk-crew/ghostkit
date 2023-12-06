<?php
/**
 * Blocksy theme.
 *
 * @package ghostkit
 */

/**
 * GhostKit_3rd_Blocksy
 */
class GhostKit_3rd_Blocksy {
	/**
	 * GhostKit_3rd_Blocksy constructor.
	 */
	public function __construct() {
		if ( 'blocksy' !== get_template() ) {
			return;
		}

		add_filter( 'gkt_custom_css_allow_js_fallback', '__return_false' );
		add_filter(
			'gkt_parse_blocks_methods',
			function() {
				return array( 'modern', 'classic' );
			}
		);
	}
}

new GhostKit_3rd_Blocksy();
