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
 * @class MAF.system.FullscreenView
 * @classdesc This is a windowed view thats will fill the complete viewport.
 * @extends MAF.system.WindowedView
 */
define('MAF.system.FullscreenView', function () {
	return new MAF.Class({
		ClassName: 'FullscreenView',

		Extends: MAF.system.WindowedView,

		viewType: 'FULLSCREEN',

		config: {
			showPassthroughVideo: false
		},

		/**
		 * Change the position and size of the media plane rectangle.
		 * @method MAF.system.FullscreenView#setTVViewportSize
		 * @param {Number} x Position on viewport where to start horizontally
		 * @param {Number} y Position on viewport where to start vertically
		 * @param {Number} width Size of the media plane
		 * @param {Number} height Size of the media plane
		 */
		setTVViewportSize: function(x, y, width, height) {
			MAF.mediaplayer.setViewportBounds(x, y, width, height);
		},

		/**
		 * Get the size and position of the media plane.
		 * @method MAF.system.FullscreenView#getTVViewportSize
		 * @return {Object} x, y, width and height of the media plane rectangle.
		 */
		getTVViewportSize: function() {
			return MAF.mediaplayer.getViewportBounds();
		}
	});
}, {
	FullscreenView: {
		styles: {
			width: '1920px',
			height: '1080px'
		}
	}
});
