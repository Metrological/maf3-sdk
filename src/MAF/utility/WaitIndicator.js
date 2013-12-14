/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2013  Metrological
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
define('MAF.utility.WaitIndicator', function () {
	var tasks = 0,
		last = null,
		stale = 60,
		timer = new Timer(60, function () {
			MAF.utility.WaitIndicator.police(true);
		});
	return {
		up: function () {
			tasks = tasks + 1;
			last = Date.now();
			return this.check();
		},
		down: function () {
			tasks = Math.max(0, tasks - 1);
			return this.check();
		},
		on: function () {
			return (this.tasks > 0) ? (last = Date.now()) && this.check() : this.up();
		},
		off: function () {
			this.hide(true);
		},
		show: function (force) {
			timer.start();
			return this.active || (this.active=true) && MAF.utility.BusyIndicators.check(tasks);
		},
		hide: function (force) {
			if (force) {
				tasks = 0;
			}
			return !this.active || (this.active=false) || MAF.utility.BusyIndicators.check(tasks);
		},
		police: function (force) {
			if (force || last + (stale * 1000) < Date.now()) {
				timer.stop();
				return this.hide(true);
			}
		},
		toggle: function () {
			return this.active ? this.hide(true) : (tasks = 1) && this.show();
		},
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