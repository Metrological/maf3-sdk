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
 * @class MAF.control.GridCell
 * @classdesc Basically the same as MAF.element.GridCell, with the exception that this has default styling.
 * @extends MAF.element.GridCell
 */
define('MAF.control.GridCell', function () {
	return new MAF.Class({
		ClassName: 'ControlGridCell',

		Extends: MAF.element.GridCell,

		Protected: {
			onThemeNeeded: function (event) {
				if (event.defaultPrevented) {
					return;
				}
				var coords = this.getCellCoordinates();
				switch(event.type) {
					case 'onFocus':
						this.renderSkin('focused', coords);
						break;
					case 'onBlur':
					case 'onAppend':
						this.renderSkin('normal', coords);
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
}, {
	ControlGridCell: {
		renderSkin: function (state, w, h, args, theme) {
			var frame = new Frame();
			theme.applyLayer('BaseGlow', frame);
			if (state === 'focused') {
				theme.applyLayer('BaseFocus', frame);
			}
			theme.applyLayer('BaseHighlight', frame);
			return frame;
		}
	}
});
