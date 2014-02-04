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
 * @class MAF.element.TextGrid
 * @extends MAF.element.Text
 */
define('MAF.element.TextGrid', function () {
	return new MAF.Class({
		ClassName: 'BaseTextGrid',

		Extends: MAF.element.Text,

		Protected: {
			dispatchEvents: function (event, payload) {
				if (event.type === 'layoutchange') {
					this.fire('onStateUpdated', {
						currentPage: this.getCurrentPage(),
						pageCount: this.getPageCount()
					}, event);
				}
				this.parent(event, payload);
			},
			registerEvents: function (eventTypes) {
				this.parent([
					'change',
					'layoutchange'
				].concat(eventTypes || []));
			}
		},

		initialize: function () {
			this.parent();
			this.element.allowChangeEvents = true;
			this.element.textPaging = true;
		},

		getCurrentPage: function () {
			return Math.ceil(this.getPageCount() * this.firstLine / this.totalLines);
		},

		getPageCount: function () {
			return Math.ceil(this.totalLines / this.visibleLines);
		},

		getStartLine: function (pagenum) {
			return pagenum * this.visibleLines;
		},

		shift: function (direction) {
			var current = this.getCurrentPage(),
				lastpage = this.getPageCount(),
				target;

			switch (direction) {
				case 'left':
					target = Math.max(current - 1, 0);
					break;
				case 'right':
					target = Math.min(current + 1, lastpage - 1);
					break;
			}
			this.firstLine = this.getStartLine(target);
			return this;
		},

		attachAccessory: function (accessory) {
			if (accessory && accessory.attachToSource) {
				accessory.attachToSource(this);
			}
			return this;
		},

		attachAccessories: function () {
			Array.slice(arguments).forEach(this.attachAccessory, this);
			return this;
		},

		setText: function (text) {
			this.firstLine = 0;
			this.parent(text);
		}
	});
});
