/**
 * Block Video
 */
import { throttle } from 'throttle-debounce';
import rafSchd from 'raf-schd';

const { GHOSTKIT, jQuery: $ } = window;

const $doc = $(document);

// set video size
function setFullscreenVideoSize() {
  $('.ghostkit-video-fullscreen:visible .ghostkit-video-fullscreen-frame').each(function () {
    const $this = $(this);
    const aspectRatio = $this.data('ghostkit-video-aspect-ratio') || 16 / 9;
    let resultW;
    let resultH;

    if (aspectRatio > window.innerWidth / window.innerHeight) {
      resultW = window.innerWidth * 0.9;
      resultH = resultW / aspectRatio;
    } else {
      resultH = window.innerHeight * 0.9;
      resultW = resultH * aspectRatio;
    }

    $this.css({
      width: resultW,
      height: resultH,
      top: (window.innerHeight - resultH) / 2,
      left: (window.innerWidth - resultW) / 2,
    });
  });
}

// Set FS video size.
const throttledSetFullscreenVideoSize = throttle(
  200,
  rafSchd(() => {
    setFullscreenVideoSize();
  })
);
$(window).on('DOMContentLoaded load resize orientationchange', () => {
  throttledSetFullscreenVideoSize();
});

/**
 * Prepare Videos.
 */
$doc.on('initBlocks.ghostkit', (e, self) => {
  if ('undefined' === typeof window.VideoWorker) {
    return;
  }

  GHOSTKIT.triggerEvent('beforePrepareVideo', self);

  $('.ghostkit-video:not(.ghostkit-video-ready)').each(function () {
    const $this = $(this).addClass('ghostkit-video-ready');
    const url = $this.attr('data-video');
    const clickAction = $this.attr('data-click-action');

    const videoAutoplay = 'true' === $this.attr('data-video-autoplay');
    const videoAutopause = 'true' === $this.attr('data-video-autopause');
    const videoLoop = 'true' === $this.attr('data-video-loop');

    let fullscreenCloseIcon = $this.find('.ghostkit-video-fullscreen-close-icon');
    if (fullscreenCloseIcon.length) {
      fullscreenCloseIcon = fullscreenCloseIcon.html();
    } else if ($this.attr('data-fullscreen-action-close-icon')) {
      fullscreenCloseIcon = `<span class="${$this.attr(
        'data-fullscreen-action-close-icon'
      )}"></span>`;
    } else {
      fullscreenCloseIcon = '';
    }

    const fullscreenBackgroundColor = $this.attr('data-fullscreen-background-color');

    let $poster = $this.find('.ghostkit-video-poster');
    let $fullscreenWrapper = false;
    let $iframe = false;
    let mute = 0;

    let aspectRatio = $this.attr('data-video-aspect-ratio');
    if (aspectRatio && aspectRatio.split(':')[0] && aspectRatio.split(':')[1]) {
      aspectRatio = aspectRatio.split(':')[0] / aspectRatio.split(':')[1];
    } else {
      aspectRatio = 16 / 9;
    }

    // mute if volume 0
    if (!parseFloat($this.attr('data-video-volume'))) {
      mute = 1;
    }

    // mute if autoplay
    if (videoAutoplay) {
      mute = 1;
    }

    const api = new window.VideoWorker(url, {
      autoplay: 0,
      loop: videoLoop,
      mute,
      volume: parseFloat($this.attr('data-video-volume')) || 0,
      showContols: 1,
    });

    if (api && api.isValid()) {
      let loaded = 0;
      let clicked = 0;
      let isPlaying = false;

      // add play event
      $this.on('click', () => {
        if (clicked) {
          return;
        }
        clicked = 1;

        // fullscreen video
        if ('fullscreen' === clickAction) {
          // add loading button
          if (!loaded) {
            $this.addClass('ghostkit-video-loading');

            api.getIframe((iframe) => {
              // add iframe
              $iframe = $(iframe);
              const $parent = $iframe.parent();

              $fullscreenWrapper = $(
                `<div class="ghostkit-video-fullscreen" style="background-color: ${fullscreenBackgroundColor};">`
              )
                .appendTo('body')
                .append(
                  $(`<div class="ghostkit-video-fullscreen-close">${fullscreenCloseIcon}</div>`)
                )
                .append($('<div class="ghostkit-video-fullscreen-frame">').append($iframe));
              $fullscreenWrapper.data('ghostkit-video-aspect-ratio', aspectRatio);
              $parent.remove();

              $fullscreenWrapper.fadeIn(200);

              $fullscreenWrapper.on('click', (evt) => {
                const $target = $(evt.target);

                if (
                  $target.hasClass('ghostkit-video-fullscreen') ||
                  $target.hasClass('ghostkit-video-fullscreen-close') ||
                  $target.closest('.ghostkit-video-fullscreen-close').length
                ) {
                  api.pause();
                  $fullscreenWrapper.fadeOut(200);
                  $this.addClass('ghostkit-video-fullscreen-closed');
                }
              });

              setFullscreenVideoSize();
            });

            loaded = 1;
          } else if ($fullscreenWrapper) {
            $this.removeClass('ghostkit-video-fullscreen-closed');
            $fullscreenWrapper.fadeIn(200);
            api.play();
          }

          // plain video
        } else if (!loaded) {
          $this.addClass('ghostkit-video-loading');

          api.getIframe((iframe) => {
            // add iframe
            $iframe = $(iframe);
            const $parent = $iframe.parent();
            $('<div class="ghostkit-video-frame">').appendTo($this).append($iframe);
            $parent.remove();
          });

          loaded = 1;
        } else {
          api.play();
        }
      });

      // set thumb
      if (!$poster.length && !$this.hasClass('is-style-icon-only')) {
        api.getImageURL((imgSrc) => {
          $poster = $(`<div class="ghostkit-video-poster"><img src="${imgSrc}" alt=""></div>`);
          $this.append($poster);
        });
      }

      let autoplayOnce = false;

      api.on('ready', () => {
        $this.removeClass('ghostkit-video-loading');

        if ('fullscreen' === clickAction) {
          if (!$this.hasClass('ghostkit-video-fullscreen-closed')) {
            api.play();
          }
        } else {
          $this.addClass('ghostkit-video-playing');
          api.play();
        }
      });
      api.on('play', () => {
        isPlaying = true;
      });
      api.on('pause', () => {
        isPlaying = false;
        autoplayOnce = true;
        if ('fullscreen' === clickAction) {
          clicked = 0;
        }
      });

      if ('fullscreen' !== clickAction && (videoAutoplay || videoAutopause)) {
        if (!('IntersectionObserver' in window)) {
          return;
        }

        const counterObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if ($this[0] !== entry.target) {
                return;
              }

              // autoplay
              if (!autoplayOnce && !isPlaying && videoAutoplay && entry.isIntersecting) {
                if (clicked) {
                  api.play();
                } else {
                  $this.click();
                }
              }

              // autopause
              if (isPlaying && videoAutopause && !entry.isIntersecting) {
                api.pause();
              }
            });
          },
          { threshold: 0.6 }
        );

        counterObserver.observe($this[0]);
      }
    }
  });

  GHOSTKIT.triggerEvent('afterPrepareVideo', self);
});
