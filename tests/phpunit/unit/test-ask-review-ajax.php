<?php
/**
 * Tests for the ask-review notice AJAX handler.
 *
 * @package ghostkit
 */

/**
 * Ask-review AJAX test case.
 *
 * @group ajax
 */
class GhostKitAskReviewAjaxTest extends WP_Ajax_UnitTestCase {
	/**
	 * Send the dismiss request as the current user.
	 *
	 * @return void
	 */
	private function dismiss() {
		$_POST['nonce'] = wp_create_nonce( 'gkt_ask_review_notice' );
		$_POST['type']  = 'yes';

		try {
			$this->_handleAjax( 'gkt_dismiss_ask_review_notice' );
		} catch ( WPAjaxDieContinueException $e ) {
			unset( $e );
		} catch ( WPAjaxDieStopException $e ) {
			unset( $e );
		}
	}

	/**
	 * Subscribers cannot change the notice state.
	 */
	public function test_subscriber_cannot_dismiss_notice() {
		delete_site_option( 'gkt_ask_review_notice_state' );
		$this->_setRole( 'subscriber' );

		$this->dismiss();

		$this->assertFalse( get_site_option( 'gkt_ask_review_notice_state' ) );
	}

	/**
	 * Administrators can dismiss the notice.
	 */
	public function test_administrator_can_dismiss_notice() {
		delete_site_option( 'gkt_ask_review_notice_state' );
		$this->_setRole( 'administrator' );

		$this->dismiss();

		$this->assertSame( 'yes', get_site_option( 'gkt_ask_review_notice_state' ) );
	}
}
