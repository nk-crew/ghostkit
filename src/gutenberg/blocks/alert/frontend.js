/**
 * Block Alert
 */
const { jQuery: $, GHOSTKIT } = window;

const $doc = $(document);

// Dismiss button.
$doc.on('click', '.ghostkit-alert-hide-button', function (e) {
  e.preventDefault();

  const $alert = $(this).parent();

  $alert.animate({ opacity: 0 }, 150, function () {
    $alert.slideUp(200, () => {
      GHOSTKIT.triggerEvent('dismissedAlert', GHOSTKIT.classObject, $alert);
    });
  });
});
