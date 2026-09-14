<?php
/**
 * Tests for the migration that removes the runtime SCSS compiler leftovers.
 *
 * @package ghostkit
 */

/**
 * Breakpoints migration tests.
 */
class BreakpointsMigrationTest extends WP_UnitTestCase {

	/**
	 * Compiled files, the queue cron event and the queue options are removed.
	 */
	public function test_migration_removes_compiler_leftovers() {
		$upload_dir = wp_get_upload_dir();
		$old_dir    = $upload_dir['basedir'] . '/ghostkit/gutenberg';

		wp_mkdir_p( $old_dir );
		// phpcs:ignore
		file_put_contents( $old_dir . '/style.min.css', 'a{}' );
		update_option( 'ghostkit_saved_breakpoints_hash', 'abc' );
		update_site_option( 'ghostkit_run_breakpoints_processing_batch_x', array( 'item' ) );
		update_site_option( 'ghostkit_run_breakpoints_processing_status', 1 );

		// The queue scheduled its event on an interval that no longer exists,
		// so it is written the way it sits in the `cron` option of an old site.
		$cron = _get_cron_array();
		$cron = is_array( $cron ) ? $cron : array();
		$cron[ time() + MINUTE_IN_SECONDS ]['ghostkit_run_breakpoints_processing_cron'][ md5( serialize( array() ) ) ] = array(
			'schedule' => 'ghostkit_run_breakpoints_processing_cron_interval',
			'args'     => array(),
			'interval' => 120,
		);
		_set_cron_array( $cron );

		$this->assertFileExists( $old_dir . '/style.min.css' );
		$this->assertNotFalse( wp_next_scheduled( 'ghostkit_run_breakpoints_processing_cron' ) );

		$migrations = new GhostKit_Migrations();
		$migrations->v_3_7_2();

		$this->assertDirectoryDoesNotExist( $old_dir );
		$this->assertFalse( get_option( 'ghostkit_saved_breakpoints_hash' ) );
		$this->assertFalse( get_site_option( 'ghostkit_run_breakpoints_processing_batch_x' ) );
		$this->assertFalse( get_site_option( 'ghostkit_run_breakpoints_processing_status' ) );
		$this->assertFalse( wp_next_scheduled( 'ghostkit_run_breakpoints_processing_cron' ) );
	}
}
