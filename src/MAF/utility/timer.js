/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2014  Metrological
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/
/**
 * @class MAF.utility.timer
 * @singleton
 */
define('MAF.utility.timer', function () {
	return {
		/**
		 * Create a timer that will trigger a callback each time the defined interval has expired.
		 * @method MAF.utility.timer#setInterval
		 * @param {Function} callback Method to execute everytime the timer triggers.
		 * @param {Number} interval Time in miliseconds.
		 * @return {Timer} The created timer object.
		 */
		setInterval: function (callback, interval) {
			var timer = new Timer();
			timer.onTimerFired = callback;
			timer.interval = interval / 1000;
			timer.ticking = true;
			return timer;
		},

		/**
		 * Stop and destroy a Timer.
		 * @method MAF.utility.timer#clearInterval
		 * @param {Timer} timer The timer to destroy.
		 */
		clearInterval: function (timer) {
			timer.ticking = false;
			delete timer;
		},

		/**
		 * Create a timer that will trigger a callback when the defined interval has expired. After its triggered it will stop.
		 * @method MAF.utility.timer#setTimeout
		 * @param {Function} callback Method to execute when the timer triggers.
		 * @param {Number} interval Time in miliseconds.
		 * @return {Timer} The created timer object.
		 */
		setTimeout: function (callback, interval) {
			var timer = new Timer();
			timer.onTimerFired = function() {
				this.ticking = false;
				callback();
			};
			timer.interval = interval / 1000;
			timer.ticking = true;
			return timer;
		},

		/**
		 * Stop and destroy a Timer.
		 * @method MAF.utility.timer#clearTimeout
		 * @param {Timer} timer The timer to destroy.
		 */
		clearTimeout: function (timer) {
			timer.ticking = false;
			delete timer;
		}
	};
});
