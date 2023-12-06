<?php
/**
 * Rank Math plugin.
 *
 * @package ghostkit
 */

/**
 * GhostKit_3rd_Rank_Math
 */
class GhostKit_3rd_Rank_Math {
	/**
	 * GhostKit_3rd_Rank_Math constructor.
	 */
	public function __construct() {
		add_filter( 'rank_math/researches/toc_plugins', array( $this, 'toc_plugin' ) );
	}

	/**
	 * Rank Math SEO filter to add our TOC block to the TOC list.
	 *
	 * @param array $plugins TOC plugins.
	 */
	public function toc_plugin( $plugins ) {
		$plugins['ghostkit/class-ghost-kit.php'] = 'Ghost Kit';
		return $plugins;
	}
}

new GhostKit_3rd_Rank_Math();
