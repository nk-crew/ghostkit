/**
 * Block Alert
 */
const {
  Motion: { animate },
  GHOSTKIT,
} = window;

// Dismiss button.
document.querySelectorAll('.ghostkit-alert-hide-button').forEach(($button) => {
  const handler = (e) => {
    e.preventDefault();

    const alert = $button.parentNode;

    animate(alert, { opacity: 0 }, { duration: 0.5 }).finished.then(() => {
      alert.style.height = `${alert.offsetHeight}px`;
      alert.style.paddingTop = '0px';
      alert.style.paddingBottom = '0px';

      animate(alert, { height: 0, marginTop: 0, marginBottom: 0 }, { duration: 0.5 }).finished.then(
        () => {
          GHOSTKIT.triggerEvent('dismissedAlert', GHOSTKIT.classObject, alert);
        }
      );
    });
  };

  $button.addEventListener('click', handler);
});
