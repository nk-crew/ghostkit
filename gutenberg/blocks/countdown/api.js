/* eslint-disable no-bitwise */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-param-reassign */

import { _n } from '@wordpress/i18n';

/**
 * API for countdown.
 * Thanks https://github.com/mckamey/countdownjs/.
 *
 * @public
 * @param {number} units the units to populate
 *
 * @return {Object|number}
 */
export default (() => {
	const MILLISECONDS = 0x001;
	const SECONDS = 0x002;
	const MINUTES = 0x004;
	const HOURS = 0x008;
	const DAYS = 0x010;
	const WEEKS = 0x020;
	const MONTHS = 0x040;
	const YEARS = 0x080;
	const DEFAULTS = YEARS | MONTHS | DAYS | HOURS | MINUTES | SECONDS;
	const ALL =
		YEARS |
		MONTHS |
		WEEKS |
		DAYS |
		HOURS |
		MINUTES |
		SECONDS |
		MILLISECONDS;
	const MILLISECONDS_PER_SECOND = 1000;
	const SECONDS_PER_MINUTE = 60;
	const MINUTES_PER_HOUR = 60;
	const HOURS_PER_DAY = 24;
	const MILLISECONDS_PER_DAY =
		HOURS_PER_DAY *
		MINUTES_PER_HOUR *
		SECONDS_PER_MINUTE *
		MILLISECONDS_PER_SECOND;
	const DAYS_PER_WEEK = 7;
	const MONTHS_PER_YEAR = 12;

	const { ceil } = Math;
	const { floor } = Math;

	/**
	 * @private
	 * @param {Date}   ref   reference date
	 * @param {number} shift number of months to shift
	 * @return {number} number of days shifted
	 */
	function borrowMonths(ref, shift) {
		const prevTime = ref.getTime();

		// increment month by shift
		ref.setMonth(ref.getMonth() + shift);

		// this is the trickiest since months vary in length
		return Math.round((ref.getTime() - prevTime) / MILLISECONDS_PER_DAY);
	}

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @return {number} number of days
	 */
	function daysPerMonth(ref) {
		const a = ref.getTime();

		// increment month by 1
		const b = new Date(a);
		b.setMonth(ref.getMonth() + 1);

		// this is the trickiest since months vary in length
		return Math.round((b.getTime() - a) / MILLISECONDS_PER_DAY);
	}

	/**
	 * @private
	 * @param {Date} ref reference date
	 * @return {number} number of days
	 */
	function daysPerYear(ref) {
		const a = ref.getTime();

		// increment year by 1
		const b = new Date(a);
		b.setFullYear(ref.getFullYear() + 1);

		// this is the trickiest since years (periodically) vary in length
		return Math.round((b.getTime() - a) / MILLISECONDS_PER_DAY);
	}

	/**
	 * Applies the Timespan to the given date.
	 *
	 * @private
	 * @param {Timespan} ts   time span
	 * @param {Date=}    date current date
	 *
	 * @return {Date} result date.
	 */
	function addToDate(ts, date) {
		date =
			date instanceof Date || (date !== null && Number.isFinite(date))
				? new Date(+date)
				: new Date();

		if (!ts) {
			return date;
		}

		// if there is a value field, use it directly
		let value = +ts.value || 0;
		if (value) {
			date.setTime(date.getTime() + value);
			return date;
		}

		value = +ts.milliseconds || 0;
		if (value) {
			date.setMilliseconds(date.getMilliseconds() + value);
		}

		value = +ts.seconds || 0;
		if (value) {
			date.setSeconds(date.getSeconds() + value);
		}

		value = +ts.minutes || 0;
		if (value) {
			date.setMinutes(date.getMinutes() + value);
		}

		value = +ts.hours || 0;
		if (value) {
			date.setHours(date.getHours() + value);
		}

		value = +ts.weeks || 0;
		if (value) {
			value *= DAYS_PER_WEEK;
		}

		value += +ts.days || 0;
		if (value) {
			date.setDate(date.getDate() + value);
		}

		value = +ts.months || 0;
		if (value) {
			date.setMonth(date.getMonth() + value);
		}

		value += +ts.years || 0;
		if (value) {
			date.setFullYear(date.getFullYear() + value);
		}

		return date;
	}

	/**
	 * Timespan representation of a duration of time
	 *
	 * @private
	 * @this {Timespan}
	 * @class
	 */
	function Timespan() {}

	/**
	 * Borrow any underflow units, carry any overflow units
	 *
	 * @private
	 * @param {Timespan} ts     time span
	 * @param {string}   toUnit unit name
	 */
	function rippleRounded(ts, toUnit) {
		switch (toUnit) {
			case 'seconds':
				if (
					ts.seconds !== SECONDS_PER_MINUTE ||
					Number.isNaN(ts.minutes)
				) {
					return;
				}
				// ripple seconds up to minutes
				ts.minutes += 1;
				ts.seconds = 0;

			/* falls through */
			case 'minutes':
				if (ts.minutes !== MINUTES_PER_HOUR || Number.isNaN(ts.hours)) {
					return;
				}
				// ripple minutes up to hours
				ts.hours += 1;
				ts.minutes = 0;

			/* falls through */
			case 'hours':
				if (ts.hours !== HOURS_PER_DAY || Number.isNaN(ts.days)) {
					return;
				}
				// ripple hours up to days
				ts.days += 1;
				ts.hours = 0;

			/* falls through */
			case 'days':
				if (ts.days !== DAYS_PER_WEEK || Number.isNaN(ts.weeks)) {
					return;
				}
				// ripple days up to weeks
				ts.weeks += 1;
				ts.days = 0;

			/* falls through */
			case 'weeks':
				if (
					ts.weeks !== daysPerMonth(ts.refMonth) / DAYS_PER_WEEK ||
					Number.isNaN(ts.months)
				) {
					return;
				}
				// ripple weeks up to months
				ts.months += 1;
				ts.weeks = 0;

			/* falls through */
			case 'months':
				if (ts.months !== MONTHS_PER_YEAR || Number.isNaN(ts.years)) {
					return;
				}
				// ripple months up to years
				ts.years += 1;
				ts.months = 0;
			// no default
		}
	}

	/**
	 * Ripple up partial units one place
	 *
	 * @private
	 * @param {Timespan} ts         timespan
	 * @param {number}   frac       accumulated fractional value
	 * @param {string}   fromUnit   source unit name
	 * @param {string}   toUnit     target unit name
	 * @param {number}   conversion multiplier between units
	 * @param {number}   digits     max number of decimal digits to output
	 * @return {number} new fractional value
	 */
	function fraction(ts, frac, fromUnit, toUnit, conversion, digits) {
		if (ts[fromUnit] >= 0) {
			frac += ts[fromUnit];
			delete ts[fromUnit];
		}

		frac /= conversion;
		if (frac + 1 <= 1) {
			// drop if below machine epsilon
			return 0;
		}

		if (ts[toUnit] >= 0) {
			// ensure does not have more than specified number of digits
			ts[toUnit] = +(ts[toUnit] + frac).toFixed(digits);
			rippleRounded(ts, toUnit);
			return 0;
		}

		return frac;
	}

	/**
	 * Ripple up partial units to next existing
	 *
	 * @private
	 * @param {Timespan} ts     timespan
	 * @param {number}   digits max number of decimal digits to output
	 */
	function fractional(ts, digits) {
		let frac = fraction(
			ts,
			0,
			'milliseconds',
			'seconds',
			MILLISECONDS_PER_SECOND,
			digits
		);
		if (!frac) {
			return;
		}

		frac = fraction(
			ts,
			frac,
			'seconds',
			'minutes',
			SECONDS_PER_MINUTE,
			digits
		);
		if (!frac) {
			return;
		}

		frac = fraction(ts, frac, 'minutes', 'hours', MINUTES_PER_HOUR, digits);
		if (!frac) {
			return;
		}

		frac = fraction(ts, frac, 'hours', 'days', HOURS_PER_DAY, digits);
		if (!frac) {
			return;
		}

		frac = fraction(ts, frac, 'days', 'weeks', DAYS_PER_WEEK, digits);
		if (!frac) {
			return;
		}

		frac = fraction(
			ts,
			frac,
			'weeks',
			'months',
			daysPerMonth(ts.refMonth) / DAYS_PER_WEEK,
			digits
		);
		if (!frac) {
			return;
		}

		frac = fraction(
			ts,
			frac,
			'months',
			'years',
			daysPerYear(ts.refMonth) / daysPerMonth(ts.refMonth),
			digits
		);
		if (!frac) {
			return;
		}

		// should never reach this with remaining fractional value
		if (frac) {
			throw new Error('Fractional unit overflow');
		}
	}

	/**
	 * Borrow any underflow units, carry any overflow units
	 *
	 * @private
	 * @param {Timespan} ts timespan
	 */
	function ripple(ts) {
		let x;

		if (ts.milliseconds < 0) {
			// ripple seconds down to milliseconds
			x = ceil(-ts.milliseconds / MILLISECONDS_PER_SECOND);
			ts.seconds -= x;
			ts.milliseconds += x * MILLISECONDS_PER_SECOND;
		} else if (ts.milliseconds >= MILLISECONDS_PER_SECOND) {
			// ripple milliseconds up to seconds
			ts.seconds += floor(ts.milliseconds / MILLISECONDS_PER_SECOND);
			ts.milliseconds %= MILLISECONDS_PER_SECOND;
		}

		if (ts.seconds < 0) {
			// ripple minutes down to seconds
			x = ceil(-ts.seconds / SECONDS_PER_MINUTE);
			ts.minutes -= x;
			ts.seconds += x * SECONDS_PER_MINUTE;
		} else if (ts.seconds >= SECONDS_PER_MINUTE) {
			// ripple seconds up to minutes
			ts.minutes += floor(ts.seconds / SECONDS_PER_MINUTE);
			ts.seconds %= SECONDS_PER_MINUTE;
		}

		if (ts.minutes < 0) {
			// ripple hours down to minutes
			x = ceil(-ts.minutes / MINUTES_PER_HOUR);
			ts.hours -= x;
			ts.minutes += x * MINUTES_PER_HOUR;
		} else if (ts.minutes >= MINUTES_PER_HOUR) {
			// ripple minutes up to hours
			ts.hours += floor(ts.minutes / MINUTES_PER_HOUR);
			ts.minutes %= MINUTES_PER_HOUR;
		}

		if (ts.hours < 0) {
			// ripple days down to hours
			x = ceil(-ts.hours / HOURS_PER_DAY);
			ts.days -= x;
			ts.hours += x * HOURS_PER_DAY;
		} else if (ts.hours >= HOURS_PER_DAY) {
			// ripple hours up to days
			ts.days += floor(ts.hours / HOURS_PER_DAY);
			ts.hours %= HOURS_PER_DAY;
		}

		while (ts.days < 0) {
			// NOTE: never actually seen this loop more than once

			// ripple months down to days
			ts.months -= 1;
			ts.days += borrowMonths(ts.refMonth, 1);
		}

		// weeks is always zero here

		if (ts.days >= DAYS_PER_WEEK) {
			// ripple days up to weeks
			ts.weeks += floor(ts.days / DAYS_PER_WEEK);
			ts.days %= DAYS_PER_WEEK;
		}

		if (ts.months < 0) {
			// ripple years down to months
			x = ceil(-ts.months / MONTHS_PER_YEAR);
			ts.years -= x;
			ts.months += x * MONTHS_PER_YEAR;
		} else if (ts.months >= MONTHS_PER_YEAR) {
			// ripple months up to years
			ts.years += floor(ts.months / MONTHS_PER_YEAR);
			ts.months %= MONTHS_PER_YEAR;
		}
	}

	/**
	 * Remove any units not requested
	 *
	 * @private
	 * @param {Timespan} ts     timespan
	 * @param {number}   units  the units to populate
	 * @param {number}   max    number of labels to output
	 * @param {number}   digits max number of decimal digits to output
	 */
	function pruneUnits(ts, units, max, digits) {
		let count = 0;

		if (!(units & YEARS) || count >= max) {
			// ripple years down to months
			ts.months += ts.years * MONTHS_PER_YEAR;
			delete ts.years;
		} else if (ts.years) {
			count += 1;
		}

		if (!(units & MONTHS) || count >= max) {
			// ripple months down to days
			if (ts.months) {
				ts.days += borrowMonths(ts.refMonth, ts.months);
			}
			delete ts.months;

			if (ts.days >= DAYS_PER_WEEK) {
				// ripple day overflow back up to weeks
				ts.weeks += floor(ts.days / DAYS_PER_WEEK);
				ts.days %= DAYS_PER_WEEK;
			}
		} else if (ts.months) {
			count += 1;
		}

		if (!(units & WEEKS) || count >= max) {
			// ripple weeks down to days
			ts.days += ts.weeks * DAYS_PER_WEEK;
			delete ts.weeks;
		} else if (ts.weeks) {
			count += 1;
		}

		if (!(units & DAYS) || count >= max) {
			// ripple days down to hours
			ts.hours += ts.days * HOURS_PER_DAY;
			delete ts.days;
		} else if (ts.days) {
			count += 1;
		}

		if (!(units & HOURS) || count >= max) {
			// ripple hours down to minutes
			ts.minutes += ts.hours * MINUTES_PER_HOUR;
			delete ts.hours;
		} else if (ts.hours) {
			count += 1;
		}

		if (!(units & MINUTES) || count >= max) {
			// ripple minutes down to seconds
			ts.seconds += ts.minutes * SECONDS_PER_MINUTE;
			delete ts.minutes;
		} else if (ts.minutes) {
			count += 1;
		}

		if (!(units & SECONDS) || count >= max) {
			// ripple seconds down to milliseconds
			ts.milliseconds += ts.seconds * MILLISECONDS_PER_SECOND;
			delete ts.seconds;
		} else if (ts.seconds) {
			count += 1;
		}

		// nothing to ripple milliseconds down to
		// so ripple back up to smallest existing unit as a fractional value
		if (!(units & MILLISECONDS) || count >= max) {
			fractional(ts, digits);
		}
	}

	/**
	 * Populates the Timespan object
	 *
	 * @private
	 * @param {Timespan} ts     timespan
	 * @param {?Date}    start  the starting date
	 * @param {?Date}    end    the ending date
	 * @param {number}   units  the units to populate
	 * @param {number}   max    number of labels to output
	 * @param {number}   digits max number of decimal digits to output
	 *
	 * @return {Timespan} timespan
	 */
	function populate(ts, start, end, units, max, digits) {
		const now = new Date();

		start = start || now;
		end = end || now;

		ts.start = start;
		ts.end = end;
		ts.units = units;

		ts.value = end.getTime() - start.getTime();
		if (ts.value < 0) {
			// swap if reversed
			const tmp = end;
			end = start;
			start = tmp;
		}

		// reference month for determining days in month
		ts.refMonth = new Date(
			start.getFullYear(),
			start.getMonth(),
			15,
			12,
			0,
			0
		);
		try {
			// reset to initial deltas
			ts.years = end.getFullYear() - start.getFullYear();
			ts.months = end.getMonth() - start.getMonth();
			ts.weeks = 0;
			ts.days = end.getDate() - start.getDate();
			ts.hours = end.getHours() - start.getHours();
			ts.minutes = end.getMinutes() - start.getMinutes();
			ts.seconds = end.getSeconds() - start.getSeconds();
			ts.milliseconds = end.getMilliseconds() - start.getMilliseconds();

			ripple(ts);
			pruneUnits(ts, units, max, digits);
		} finally {
			delete ts.refMonth;
		}

		return ts;
	}

	/**
	 * Determine an appropriate refresh rate based upon units
	 *
	 * @private
	 * @param {number} units the units to populate
	 * @return {number} milliseconds to delay
	 */
	function getDelay(units = []) {
		if (units.indexOf('milliseconds') !== -1) {
			// refresh very quickly
			return MILLISECONDS_PER_SECOND / 30; // 30Hz
		}

		if (units.indexOf('seconds') !== -1) {
			// refresh every second
			return MILLISECONDS_PER_SECOND; // 1Hz
		}

		if (units.indexOf('minutes') !== -1) {
			// refresh every minute
			return MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
		}

		if (units.indexOf('hours') !== -1) {
			// refresh hourly
			return (
				MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR
			);
		}

		if (units.indexOf('days') !== -1) {
			// refresh daily
			return (
				MILLISECONDS_PER_SECOND *
				SECONDS_PER_MINUTE *
				MINUTES_PER_HOUR *
				HOURS_PER_DAY
			);
		}

		// refresh the rest weekly
		return (
			MILLISECONDS_PER_SECOND *
			SECONDS_PER_MINUTE *
			MINUTES_PER_HOUR *
			HOURS_PER_DAY *
			DAYS_PER_WEEK
		);
	}

	/**
	 * Units list to units data.
	 *
	 * @param {Array} unitsList list of all units to display
	 *
	 * @return {number} units data.
	 */
	function unitsListToData(unitsList) {
		let units = ~ALL;

		unitsList.forEach((unit) => {
			if (countdown[unit.toUpperCase()]) {
				units |= countdown[unit.toUpperCase()];
			}
		});

		// ensure some units or use defaults
		units = +units || DEFAULTS;

		return units;
	}

	/**
	 * API entry point
	 *
	 * @public
	 * @param {Date|number|Timespan} start     the starting date
	 * @param {Date|number|Timespan} end       the ending date
	 * @param {Array}                unitsList list of all units to display
	 * @param {number}               digits    max number of decimal digits to output
	 *
	 * @return {Timespan} timespan
	 */
	function countdown(start, end, unitsList, digits) {
		// max must be positive
		const max = unitsList.length > 0 ? unitsList.length : NaN;

		// clamp digits to an integer between [0, 20]
		if (digits > 0) {
			digits = digits < 20 ? Math.round(digits) : 20;
		} else {
			digits = 0;
		}

		// ensure start date
		let startTS = null;
		if (!(start instanceof Date)) {
			if (start !== null && Number.isFinite(start)) {
				start = new Date(+start);
			} else {
				if (typeof startTS === 'object') {
					startTS = start;
				}
				start = null;
			}
		}

		// ensure end date
		let endTS = null;
		if (!(end instanceof Date)) {
			if (end !== null && Number.isFinite(end)) {
				end = new Date(+end);
			} else {
				if (typeof end === 'object') {
					endTS = end;
				}
				end = null;
			}
		}

		// must wait to interpret timespans until after resolving dates
		if (startTS) {
			start = addToDate(startTS, end);
		}
		if (endTS) {
			end = addToDate(endTS, start);
		}

		if (!start && !end) {
			// used for unit testing
			return new Timespan();
		}

		const units = unitsListToData(unitsList);

		return populate(new Timespan(), start, end, units, max, digits);
	}

	countdown.MILLISECONDS = MILLISECONDS;
	countdown.SECONDS = SECONDS;
	countdown.MINUTES = MINUTES;
	countdown.HOURS = HOURS;
	countdown.DAYS = DAYS;
	countdown.WEEKS = WEEKS;
	countdown.MONTHS = MONTHS;
	countdown.YEARS = YEARS;
	countdown.DEFAULTS = DEFAULTS;
	countdown.ALL = ALL;

	countdown.getDelay = getDelay;

	countdown.formatUnit = (number, label) => {
		// prepare label.
		switch (label) {
			case 'years':
				label = _n('Year', 'Years', number, 'ghostkit');
				break;
			case 'months':
				label = _n('Month', 'Months', number, 'ghostkit');
				break;
			case 'weeks':
				label = _n('Week', 'Weeks', number, 'ghostkit');
				break;
			case 'days':
				label = _n('Day', 'Days', number, 'ghostkit');
				break;
			case 'hours':
				label = _n('Hour', 'Hours', number, 'ghostkit');
				break;
			case 'minutes':
				label = _n('Minute', 'Minutes', number, 'ghostkit');
				break;
			case 'seconds':
				label = _n('Second', 'Seconds', number, 'ghostkit');
				break;
			// no default
		}

		// additional 0 for number.
		number = `${number < 10 ? '0' : ''}${number}`;

		return {
			number,
			label,
		};
	};

	return countdown;
})();
