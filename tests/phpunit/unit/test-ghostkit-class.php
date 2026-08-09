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
	 * The plugin directory, derived from this file's own location.
	 *
	 * The plugin root cannot be hardcoded. Ghost Kit Pro vendors this plugin as
	 * `core-plugin/` inside its own directory, so the absolute path differs
	 * depending on which checkout is running the suite.
	 *
	 * @return string Absolute path, with a trailing slash.
	 */
	private function get_plugin_dir() {
		return dirname( __DIR__, 3 ) . '/';
	}

	/**
	 * Plugin Path test.
	 */
	public function test_plugin_path() {
		$defined_path = $this->get_plugin_dir();
		$plugin_path = ghostkit()->plugin_path;

		$this->assertEquals( $defined_path, $plugin_path );
	}

	/**
	 * Plugin Url test.
	 */
	public function test_plugin_url() {
		// The plugin is mounted at an absolute path that `plugin_basename()` cannot
		// shorten to a slug in the test environment, so WordPress appends the whole
		// path to the plugins URL. Build the expectation with `plugins_url()` rather
		// than hardcoding a host: the port is derived per checkout and is not always
		// the default one.
		$defined_url = plugins_url( $this->get_plugin_dir() );
		$plugin_url = ghostkit()->plugin_url;

		$this->assertEquals( $defined_url, $plugin_url );
	}
}
