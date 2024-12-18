/**
 * Block Alert
 */
const {
	Motion: { animate },
	GHOSTKIT: { events },
} = window;

events.on(document, 'click', '.ghostkit-alert-hide-button', (e) => {
	e.preventDefault();

	const alert = e.delegateTarget.parentNode;

	events.trigger(alert, 'close.alert.gkt');

	animate(alert, { opacity: 0 }, { duration: 0.5 }).then(() => {
		alert.style.height = `${alert.offsetHeight}px`;
		alert.style.paddingTop = '0px';
		alert.style.paddingBottom = '0px';

		animate(
			alert,
			{ height: 0, marginTop: 0, marginBottom: 0 },
			{ duration: 0.5 }
		).then(() => {
			events.trigger(alert, 'closed.alert.gkt');
		});
	});
});
