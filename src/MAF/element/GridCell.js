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
							if (this.grid && !this.grid.getState().hasFocus) {
								this.grid.fire('onFocus', coords);
							} else {
								this.grid.updateState({
									focusIndex: this.getCellIndex(),
									focusCoordinates: {
										row:    coords.row,
										column: coords.column
									}
								});
							}
							break;
						case 'blur':
							if (this.grid && (!this.element.navigateTo || (this.grid.cells && this.grid.cells.indexOf(this.element.navigateTo.owner) === -1))) {
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

				var el = this.element;
				getter(this, 'width', function () {
					return this.getCellDimensions().width || el.width;
				});
				getter(this, 'height', function () {
					return this.getCellDimensions().height || el.height;
				});
				getter(this, 'outerWidth', function () {
					return this.width + (el.hOffset || 0);
				});
				getter(this, 'outerHeight', function () {
					return this.height + (el.vOffset || 0);
				});
				getter(this, 'id', function () {
					return el.getAttribute('id');
				});
				setter(this, 'id', function (id) {
					return el.setAttribute('id', id);
				});
			}
		},

		config: {
			focus: true,
			element: Item
		},

		getCellDimensions: function () {
			return this.grid && this.grid.getCellDimensions() || {};
		},

		getCellCoordinates: function () {
			return this.grid && this.grid.getCellCoordinates(this);
		},

		getCellIndex: function () {
			return this.grid && this.grid.getCellIndex(this);
		},

		getCellDataIndex: function () {
			return this.grid && this.grid.getCellDataIndex(this);
		},

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
