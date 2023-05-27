/**
 * Block Alert
 */
const {
  jQuery: $,
  Motion: { animate },
  GHOSTKIT,
} = window;

const $doc = $(document);

// Dismiss button.
$doc.on('click', '.ghostkit-alert-hide-button', function (e) {
  e.preventDefault();

  const alert = this.parentNode;
  const $alert = $(alert);

  animate(alert, { opacity: 0 }, { duration: 0.5 }).finished.then(() => {
    alert.style.height = `${alert.offsetHeight}px`;
    alert.style.paddingTop = '0px';
    alert.style.paddingBottom = '0px';

    animate(alert, { height: 0, marginTop: 0, marginBottom: 0 }, { duration: 0.5 }).finished.then(
      () => {
        GHOSTKIT.triggerEvent('dismissedAlert', GHOSTKIT.classObject, $alert);
      }
    );
  });
});
