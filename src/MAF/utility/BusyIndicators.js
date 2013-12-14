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
define('MAF.utility.BusyIndicators', function () {
	//0: 'no indicators', 
	//1: 'small spinner only', 
	//2: 'dimmed loading overlay', 
	//3: 'clear loading overlay' 
	return {
		check: function (state) {
			state = state || 0;
			if (MAF.utility.LoadingOverlay.check()) {
				state = 2;
			} else if (MAF.utility.WaitIndicator.check() > 0) {
				state = 1;
			}
			return MAF.HostEventManager.send('setWaitIndicator', state);
		}
	};
});