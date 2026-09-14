<?php
/**
 * Plugin Name: Ghost Kit Test Plugin Custom Breakpoints
 * Description: Sets a custom small breakpoint for the e2e tests, the way Ghost Kit Pro does through the `gkt_breakpoint_*` filters.
 *
 * @package ghostkit
 */

// Priority 100 wins over Ghost Kit Pro, which applies its saved settings at 99.
add_filter(
	'gkt_breakpoint_sm',
	function () {
		return 700;
	},
	100
);
