/**
 * Block Alert
 */
import addEventListener from '../../utils/add-event-listener';

const {
  Motion: { animate },
  GHOSTKIT,
} = window;

addEventListener(
  document.body,
  'click',
  function (e) {
    e.preventDefault();

    const alert = this.parentNode;

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
  },
  '.ghostkit-alert-hide-button'
);
