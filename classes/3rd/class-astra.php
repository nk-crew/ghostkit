<?php
/**
 * Astra theme.
 *
 * @package ghostkit
 */

/**
 * GhostKit_3rd_Astra
 */
class GhostKit_3rd_Astra {
	/**
	 * GhostKit_3rd_Astra constructor.
	 */
	public function __construct() {
		if ( 'astra' !== get_template() ) {
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

new GhostKit_3rd_Astra();
