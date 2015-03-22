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
 * @class MAF.element.GridCell
 * @extends MAF.element.Container
 */
define('MAF.element.GridCell', function () {
	return new MAF.Class({
		ClassName: 'BaseGridCell',

		Extends: MAF.element.Container,

		Protected: {
			dispatchEvents: function (event) {
				if (this.grid) {
					var coords = this.getCellCoordinates();
					switch (event.type) {
						case 'focus':
							if (!this.grid.getState().hasFocus) {
								this.grid.updateState({
									hasFocus: true
								});
								this.grid.fire('onFocus', coords);
							} else {
								this.grid.updateState({
									focusIndex: this.getCellIndex(),
									focusCoordinates: {
										row:    coords.row,
										column: coords.column
									}
								});
								this.grid.fire('onFocus', coords);
							}
							break;
						case 'blur':
							if (!this.element.navigateTo || (this.grid.cells && this.grid.cells.indexOf(this.element.navigateTo.owner) === -1)) {
								this.grid.updateState({
									hasFocus: false
								});
								this.grid.fire('onBlur', coords);
							}
							break;
						case 'select':
							this.fire('onSelect', {
								cellIndex: this.getCellIndex(),
								dataIndex: this.getCellDataIndex(),
								dataItem:  this.getCellDataItem()
							});
							break;
					}
					if (event.type !== 'select') {
						this.parent(event);
					}
				}
			},
			proxyProperties: function (propnames) {
				propnames = [
					'visible',
					'frozen',
					'hAlign',
					'vAlign',
					'rotate',
					'zOrder',
					'hOffset',
					'vOffset',
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
			element: Item
		},

		/**
		 * @method MAF.element.GridCell#getCellDimensions
		 * @return {Object} With the width and height of the cells for the grid.
		 */
		getCellDimensions: function () {
			return this.grid && this.grid.getCellDimensions() || {};
		},

		/**
		 * @method MAF.element.GridCell#getCellCoordinates
		 * @return {Object} With row, column, rows and columns
		 */
		getCellCoordinates: function () {
			return this.grid && this.grid.getCellCoordinates(this);
		},

		/**
		 * @method MAF.element.GridCell#getCellIndex
		 * @return {Number} Index of the cell if found. Otherwise it returns -1.
		 */
		getCellIndex: function () {
			return this.grid && this.grid.getCellIndex(this);
		},

		/**
		 * @method MAF.element.GridCell#getCellDataIndex
		 * @return {Number} Dataset Index.
		 */
		getCellDataIndex: function () {
			return this.grid && this.grid.getCellDataIndex(this);
		},

		/**
		 * @method MAF.element.GridCell#getCellDataItem
		 * @return {Mixed} Returns a dataset item.
		 */
		getCellDataItem: function () {
			return this.grid && this.grid.getCellDataItem(this);
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
