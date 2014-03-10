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
 * @class MAF.utility.WaitIndicator
 * @singleton
 * If there are outstanding tasks on the WaitIndicator it will start the wait indicator.
 */
define('MAF.utility.WaitIndicator', function () {
	var tasks = 0,
		last = null,
		stale = 60,
		timer = new Timer(60, function () {
			MAF.utility.WaitIndicator.police(true);
		});
	return {
		/**
		 * Increase the number of outstanding tasks by one.
		 * @method MAF.utility.WaitIndicator#up
		 * @return {Number} Number outstanding tasks
		 */
		up: function () {
			tasks = tasks + 1;
			last = Date.now();
			return this.check();
		},

		/**
		 * Decrease the number of outstanding tasks by one.
		 * @method MAF.utility.WaitIndicator#down
		 * @return {Number} Number outstanding tasks
		 */
		down: function () {
			tasks = Math.max(0, tasks - 1);
			return this.check();
		},

		/**
		 * Turn the waitindicator on. This does not increase the number of oustanding tasks.
		 * @method MAF.utility.WaitIndicator#on
		 * @return {Number} Number outstanding tasks
		 */
		on: function () {
			return (this.tasks > 0) ? (last = Date.now()) && this.check() : this.up();
		},

		/**
		 * Force the waitindicator off. Outstanding tasks will be set to 0.
		 * @method MAF.utility.WaitIndicator#off
		 * @return {Boolean}
		 */
		off: function () {
			this.hide(true);
		},

		/**
		 * @method MAF.utility.WaitIndicator#show
		 * @return {Boolean}
		 */
		show: function (force) {
			timer.start();
			return this.active || (this.active=true) && MAF.utility.BusyIndicators.check(tasks);
		},

		/**
		 * Hide the waitindicator.
		 * @method MAF.utility.WaitIndicator#hide
		 * @param  {Boolean} force Wether to force hide the waitindicator.
		 * @return {Boolean}
		 */
		hide: function (force) {
			if (force) {
				tasks = 0;
			}
			return !this.active || (this.active=false) || MAF.utility.BusyIndicators.check(tasks);
		},

		/**
		 * Method that does a check if the waitindicator should turn off. No need to call this method yourself.
		 * @method MAF.utility.WaitIndicator#police
		 * @private
		 */
		police: function (force) {
			if (force || last + (stale * 1000) < Date.now()) {
				timer.stop();
				return this.hide(true);
			}
		},

		/**
		 * Toggle the waitindicator on and off.
		 * @method MAF.utility.WaitIndicator#toggle
		 * @return {Boolean}
		 */
		toggle: function () {
			return this.active ? this.hide(true) : (tasks = 1) && this.show();
		},

		/**
		 * Waitindicator checks its state and updates.
		 * @method MAF.utility.WaitIndicator#check
		 * @return {Number} Number outstanding tasks
		 */
		check: function () {
			if (tasks > 0) {
				this.show();
			} else {
				this.hide();
			}
			this.police();
			return tasks;
		}
	};
});