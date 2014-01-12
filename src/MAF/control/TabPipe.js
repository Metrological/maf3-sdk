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
 * @class MAF.control.TabPipe
 * @extends MAF.control.TabStrip
 */
define('MAF.control.TabPipe', function () {
	return new MAF.Class({
		ClassName: 'ControlTabPipe',

		Extends: MAF.control.TabStrip,

		config: {
			buttonClass: MAF.control.TabPipeButton
		},

		initialize: function () {
			this.parent();
			this.body.appendTo(new MAF.element.Container({
				ClassName: 'ControlTabPipeContainer'
			}).appendTo(this));
		}
	});
}, {
	ControlTabPipe: {
		styles: {
			borderBottom: '2px solid grey',
			width: 'inherit',
			height: '57px'
		}
	},
	ControlTabPipeBody: 'ControlTabStripBody',
	ControlTabPipeContainer: {
		styles: {
			width: '100%',
			height: '100%',
			paddingTop: 6,
			paddingLeft: 18,
			paddingRight: 18
		}
	}
});
