<?php
/**
 * Tests for Ghostkit Main Class
 *
 * @package ghostkit
 */

/**
 * Ghostkit test case.
 */
class GhostkitTest extends WP_UnitTestCase {
    /**
     * Set up our mocked WP functions. Rather than setting up a database we can mock the returns of core WordPress functions.
     *
     * @return void
     */
    public function set_up() {
        parent::set_up();
    }

    /**
     * Tear down WP Mock.
     *
     * @return void
     */
    public function tear_down() {
		parent::tear_down();
    }

	/**
	 * Plugin Path test.
	 */
	public function test_plugin_path() {
		$defined_path = '/var/www/html/wp-content/plugins/ghostkit/';
		$plugin_path = ghostkit()->plugin_path;

		$this->assertEquals( $defined_path, $plugin_path );
	}

	/**
	 * Plugin Url test.
	 */
	public function test_plugin_url() {
		$defined_url = 'http://localhost:8889/wp-content/plugins/var/www/html/wp-content/plugins/ghostkit/';
		$plugin_url = ghostkit()->plugin_url;

		$this->assertEquals( $defined_url, $plugin_url );
	}
}
