<?php
/**
 * Page Builder Framework theme.
 *
 * @package ghostkit
 */

/**
 * GhostKit_3rd_Page_Builder_Framework
 */
class GhostKit_3rd_Page_Builder_Framework {
	/**
	 * GhostKit_3rd_Page_Builder_Framework constructor.
	 */
	public function __construct() {
		if ( 'page-builder-framework' !== get_template() ) {
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

new GhostKit_3rd_Page_Builder_Framework();
