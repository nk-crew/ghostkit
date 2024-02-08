import $ from 'jquery';

function updateReusableBlockLinks($widgets) {
	if (!$widgets) {
		$widgets = $('[id*="ghostkit_reusable_widget"].widget');
	}

	$widgets.each(function () {
		const $widget = $(this);
		const $buttonWrap = $widget.find('.gkt-reusable-block-edit-button');
		const $select = $widget.find('.gkt-reusable-block-select');

		if (!$buttonWrap.length || !$select.length) {
			return;
		}

		const adminURL = $buttonWrap.attr('data-admin-url');
		const selectVal = $select.val();

		if (selectVal) {
			$buttonWrap
				.find('a')
				.attr(
					'href',
					`${adminURL}post.php?post=${selectVal}&action=edit`
				);
			$buttonWrap.show();
		} else {
			$buttonWrap.hide();
		}
	});
}
updateReusableBlockLinks();

$(document).on('widget-added widget-updated', (e, widget) => {
	updateReusableBlockLinks(widget);
});

$(document).on('change', '.gkt-reusable-block-select', function () {
	updateReusableBlockLinks(
		$(this).closest('[id*="ghostkit_reusable_widget"].widget')
	);
});
