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
