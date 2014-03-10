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
 * @class MAF.control.Grid
 * @classdesc Basically the same as MAF.element.Grid, with the exception that this has default styling.
 * @extends MAF.element.Grid
 */
define('MAF.control.Grid', function () {
	return new MAF.Class({
		ClassName: 'ControlGrid',

		Extends: MAF.element.Grid,

		Protected: {
			onThemeNeeded: function (event) {
				if (event.defaultPrevented) {
					return;
				}
				switch(event.type) {
					case 'onFocus':
						this.renderSkin('focused');
						break;
					case 'onBlur':
					case 'onAppend':
						this.renderSkin('normal');
						break;
				}
			}
		},

		initialize: function () {
			if (this.config.theme !== false) {
				this.onThemeNeeded.subscribeTo(this, ['onAppend', 'onFocus', 'onBlur'], this);
			}
			this.parent();
		}
	});
}, {});
