define('MAF.element.GridCell', function () {
	return new MAF.Class({
		ClassName: 'BaseGridCell',

		Extends: MAF.element.Container,

		Protected: {
			dispatchEvents: function (event) {
				switch (event.type) {
					case 'focus':
						this.grid.fire('onFocus', this.getCellCoordinates());
						break;
					case 'blur':
						this.grid.fire('onBlur', this.getCellCoordinates());
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

		config: {
			focus: true
		},

		getCellDimensions: function () {
			return this.grid && this.grid.getCellDimensions();
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
