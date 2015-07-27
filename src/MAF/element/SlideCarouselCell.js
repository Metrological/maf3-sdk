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
 * @class MAF.element.SlideCarouselCell
 * @extends MAF.element.Container
**/
define('MAF.element.SlideCarouselCell', function () {
	return new MAF.Class({
		ClassName: 'SlideCarouselCell',

		Extends: MAF.element.Container,

		Protected: {
			proxyProperties: function (propnames) {
				propnames = [
					'visible',
					'frozen',
					'hAlign',
					'vAlign',
					'rotate',
					'zOrder',
					'scrollLeft',
					'scrollTop'
				].concat(propnames || []);
				MAF.Class.Methods.proxyProperties(this, this.element, propnames);
				getter(this, 'width', function () {
					var el = this.element;
					return this.getCellDimensions().width || (el && el.width);
				});
				getter(this, 'height', function () {
					var el = this.element;
					return this.getCellDimensions().height || (el && el.height);
				});
				getter(this, 'outerWidth', function () {
					var el = this.element,
						width = el && el.width;
					return width !== undefined && (width + (el.hOffset || 0));
				});
				getter(this, 'outerHeight', function () {
					var el = this.element,
						height = el && el.height;
					return height !== undefined && (height + (el.vOffset || 0));
				});
				getter(this, 'id', function () {
					var el = this.element;
					return el && el.getAttribute('id');
				});
				setter(this, 'id', function (id) {
					var el = this.element;
					return el && el.setAttribute('id', id);
				});
				getter(this, 'disabled', function () {
					var el = this.element;
					return el && el.disabled;
				});
				setter(this, 'disabled', function (disabled) {
					disabled = disabled || false;
					var el = this.element;
					if (this.disabled !== disabled) {
						this.fire(disabled ? 'onDisable' : 'onEnable');
						if (el) el.disabled = disabled;
						this.fire('onChangeDisabled', {
							disabled: disabled
						});
					}
				});
			}
		},
		config: {
			focus: true,
			animation: true
		},
		/**
		 * @method MAF.element.SlideCarouselCell#getCellDimensions
		 * @return {Object} With the width and height of the cells for the grid.
		 */
		getCellDimensions: function () {
			return this.grid && this.grid.getCellDimensions() || {};
		},

		/**
		 * @method MAF.element.SlideCarouselCell#getCellDataItem
		 * @return {Mixed} Returns a dataset item.
		 */
		getCellDataItem: function () {
			return this.grid && this.grid.getCellDataItem(this);
		},
		/**
		 * @method MAF.element.SlideCarouselCell#getCellDataIndex
		 * @return {Number} Returns the index of the dataItem in the dataset.
		 */
		getCellDataIndex: function () {
			return this.grid && this.grid.getCellDataIndex(this);
		},

		suicide: function () {
			delete this.grid;
			Object.forEach(this, function (key, obj) {
				if (key !== 'owner' && typeOf(obj) === 'instance' && obj.suicide && obj !== this) {
					delete this[key];
					obj.suicide();
				}
			}, this);
			this.parent();
		}
	});
});