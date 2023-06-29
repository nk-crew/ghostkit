/**
 * Block Countdown
 */
import countDownApi from './api';
import { TIMEZONELESS_FORMAT } from './constants';

const { GHOSTKIT, jQuery: $, luxon } = window;

const $doc = $(document);

/**
 * Prepare Countdowns.
 */
$doc.on('initBlocks.ghostkit', (e, self) => {
  function updateUnits(date, units, unitsElements, $this) {
    const currentDate = new Date(
      luxon.DateTime.now().setZone(GHOSTKIT.timezone).toFormat(TIMEZONELESS_FORMAT)
    );

    const dateData = countDownApi(date, currentDate, units, 0);
    const isEnd = dateData.value >= 0;

    if (isEnd) {
      $this.querySelectorAll(':scope > .ghostkit-countdown-unit').forEach(($unit) => {
        $unit.style.display = 'none';
      });

      $this.querySelector(':scope > .ghostkit-countdown-expire-action').style.display = 'block';
      return;
    }

    Object.keys(unitsElements).forEach((unitName) => {
      let formattedUnit = false;

      if (dateData && typeof dateData[unitName] !== 'undefined') {
        formattedUnit = countDownApi.formatUnit(dateData[unitName], unitName);
      }

      const newNumber = formattedUnit ? formattedUnit.number : '00';
      const newLabel = formattedUnit ? formattedUnit.label : unitName;

      if (unitsElements[unitName].$number.innerHTML !== newNumber) {
        unitsElements[unitName].$number.innerHTML = newNumber;
      }
      if (unitsElements[unitName].$label.innerHTML !== newLabel) {
        unitsElements[unitName].$label.innerHTML = newLabel;
      }
    });

    setTimeout(() => {
      updateUnits(date, units, unitsElements, $this);
    }, countDownApi.getDelay(units));
  }

  GHOSTKIT.triggerEvent('beforePrepareCountdown', self);

  document
    .querySelectorAll('.ghostkit-countdown:not(.ghostkit-countdown-ready)')
    .forEach(($countdown) => {
      $countdown.classList.add('ghostkit-countdown-ready');

      const date = new Date($countdown.getAttribute('data-date'));

      const unitsElements = [];
      const units = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'].filter(
        (unitName) => {
          const $unit = $countdown.querySelector(`:scope > .ghostkit-countdown-unit-${unitName}`);

          if ($unit) {
            unitsElements[unitName] = {
              $number: $unit.querySelector('.ghostkit-countdown-unit-number'),
              $label: $unit.querySelector('.ghostkit-countdown-unit-label'),
            };
            return true;
          }

          return false;
        }
      );

      updateUnits(date, units, unitsElements, $countdown);
    });

  GHOSTKIT.triggerEvent('afterPrepareCountdown', self);
});
