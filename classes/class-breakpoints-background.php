<?php
/**
 * Breakpoints Background.
 *
 * @package ghostkit
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WP_Background_Process' ) ) {
	require_once ghostkit()->plugin_path . 'composer-libraries/vendor/deliciousbrains/wp-background-processing/wp-background-processing.php';
}

/**
 * GhostKit_Breakpoints_Background class
 */
class GhostKit_Breakpoints_Background extends WP_Background_Process {
	/**
	 * Prefix
	 *
	 * @var string
	 */
	protected $prefix = 'ghostkit';

	/**
	 * Name of Cron Action Task.
	 *
	 * @var string
	 */
	protected $action = 'run_breakpoints_processing';

	/**
	 * Cron Interval.
	 *
	 * @var integer
	 */
	protected $cron_interval = 2;

	/**
	 * Cron Queue Lock Time.
	 *
	 * @var integer
	 */
	protected $queue_lock_time = 25;

	/**
	 * Task
	 *
	 * Override this method to perform any actions required on each
	 * queue item. Return the modified item for further processing
	 * in the next pass through. Or, return false to remove the
	 * item from the queue.
	 *
	 * @param mixed $item Queue item to iterate over.
	 *
	 * @return mixed
	 */
	protected function task( $item ) {
		new GhostKit_Scss_Compiler( $item );
		return false;
	}
}
