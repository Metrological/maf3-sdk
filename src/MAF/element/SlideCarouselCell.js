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
			dispatchEvents: function(event) {
				var sl = this.grid;
				if(event.type === 'blur' && sl){
					this.parent(event);
					var sameSlider = false;
					if(event.relatedTarget && event.relatedTarget.owner && event.relatedTarget.owner.grid === this.grid){
						sameSlider = true;
					}
					if(sl.hasFocus && !sameSlider){
						sl.manageBounds(false);
						sl.hasFocus = false;
						sl.fire('onBlur');
					}
				} else if(event.type === 'focus' && sl){
					var newFocusCell;
					if(sl.config.subCells > 1){
						sl.current = [sl.cells.indexOf(this.owner), this.owner.subCells.indexOf(this)];
					}
					else{
						sl.current = sl.cells.indexOf(this);
					}
					if(sl.config.dynamicFocus === false){
						if(typeof sl.current === 'number' && sl.current !== sl.config.focusIndex){
							if(!sl.navigating)
								newFocusCell = sl.cells[sl.config.focusIndex];
						}
						else if (typeof sl.current === 'object' && sl.current[0] !== sl.config.focusIndex){
							if(!sl.navigating)
								newFocusCell = sl.cells[sl.config.focusIndex].subCells[sl.current[1]];
						}
					}
					else if(sl.config.dynamicFocus === true){
						if(typeof sl.current === 'number'){
							if(sl.current <= sl.config.dynamicFocusStart){
								if(!sl.navigating)
									newFocusCell = sl.cells[sl.config.dynamicFocusStart+1];
							}
							else if(sl.current > sl.config.visibleCells - sl.config.dynamicFocusEnd){
								if(!sl.navigating)
									newFocusCell = sl.cells[sl.config.visibleCells - sl.config.dynamicFocusEnd];
							}
						} else if(typeof sl.current === 'object'){
							if(sl.current[0] <= sl.config.dynamicFocusStart){
								if(!sl.navigating)
									newFocusCell = sl.cells[sl.config.dynamicFocusStart+1].subCells[sl.current[1]];
							}
							else if(sl.current[0] > sl.config.visibleCells - sl.config.dynamicFocusEnd){
								if(!sl.navigating)
									newFocusCell = sl.cells[sl.config.visibleCells - sl.config.dynamicFocusEnd].subCells[sl.current[1]];
							}
						}
					}
					if(newFocusCell){
						newFocusCell.focus();
					} else {
						this.parent(event);
						sl.manageBounds(true);
						sl.fire('onStateUpdated');
						if(!sl.hasFocus){
							sl.hasFocus = true;
							sl.fire('onFocus')
						}	
					}
				} else {
					this.parent(event);
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
		/**
		 * Sets the cell to a new offset
		 * @method MAF.element.SlideCarouselCell#setOffset
		 */
		setOffset: function(offsetX, offsetY, offsetZ){
			this.setStyle('transform', (getSetting('gpu') === false && !Browser.wpeCisco) ? 'translate('+offsetX+'px, '+offsetY+'px)' : 'translate3d('+offsetX+'px, '+offsetY+'px, '+offsetZ+'px)');
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