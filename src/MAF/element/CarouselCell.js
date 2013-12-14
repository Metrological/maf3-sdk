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
define('MAF.element.CarouselCell', function () {
	var proxyProperties = MAF.element.GridCell.prototype.proxyProperties;
	return new MAF.Class({
		ClassName: 'BaseCarouselCell',

		Extends: MAF.element.Container,

		Protected: {
			dispatchEvents: function (event) {
				if (this.carousel) {
					var coords = this.getCellCoordinates();
					switch (event.type) {
						case 'focus':
							if (!this.carousel.getState().hasFocus) {
								this.carousel.fire('onFocus', this);
							} else {
								this.carousel.updateState({
									focusIndex: this.getCellIndex()
								});
							}
							break;
						case 'blur':
							if (this.carousel && (!this.element.navigateTo || (this.carousel.cells && this.carousel.cells.indexOf(this.element.navigateTo.owner) === -1))) {
								this.carousel.fire('onBlur', this);
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
			proxyProperties: proxyProperties
		},

		config: {
			focus: true,
			element: Item
		},

		getCellDimensions: function () {
			return this.carousel && this.carousel.getCellDimensions() || {};
		},

		getCellCoordinates: function () {
			return this.carousel && this.carousel.getCellCoordinates(this);
		},

		getCellIndex: function () {
			return this.carousel && this.carousel.getCellIndex(this);
		},

		getCellDataIndex: function () {
			return this.carousel && this.carousel.getCellDataIndex(this);
		},

		getCellDataItem: function () {
			return this.carousel && this.carousel.getCellDataItem(this);
		},

		suicide: function () {
			delete this.carousel;
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
