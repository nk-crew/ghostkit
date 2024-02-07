import $ from 'jquery';

const { ajaxurl, GKTAskReviewNotice } = window;
const $body = $('body');

$body.on('click', '.gkt-review-plugin-notice-dismiss', function (e) {
	const $this = $(this);
	const type = $this.attr('data-gkt-review-action');

	// Don't prevent click on Yes link, as it is URL for rate.
	if (type !== 'yes') {
		e.preventDefault();
	}

	// Hide notice.
	$this.closest('.notice').slideUp('slow');

	// Save user answer in DB.
	$.post(ajaxurl, {
		action: 'gkt_dismiss_ask_review_notice',
		type,
		nonce: GKTAskReviewNotice.nonce,
	});
});
