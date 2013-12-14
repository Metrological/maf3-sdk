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
define('MAF.utility.LoadingOverlay', function () {
	return {
		show: function () {
			return this.active ? this.active : (this.active = true) && MAF.utility.BusyIndicators.check();
		},
		hide: function () {
			return this.active ? (this.active = false) || MAF.utility.BusyIndicators.check() : this.active;
		},
		on: function () {
			return this.show();
		},
		off: function () {
			return this.hide();
		},
		toggle: function () {
			return this.active ? this.hide() : this.show();
		},
		check: function () {
			return this.active;
		}
	};
});