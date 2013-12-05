define('MAF.element.Carousel', function () {
	var handleNavEvent = function (event) {
		var orientation = this.config.orientation,
			carousel = this.config.carousel,
			len = this.cells.length,
			direction = event && event.payload && event.payload.direction;

		if (direction) {
			if (carousel && len > 0 && ((orientation === 'horizontal' && direction === 'right') || (orientation === 'vertical' && direction === 'down'))) {
				this.cells[0].focus();
			} else if (carousel && len > 0 && ((orientation === 'horizontal' && direction === 'left') || (orientation === 'vertical' && direction === 'up'))) {
				this.cells[len - 1].focus();
			} else {
				this.setDisabled(true);
				this.element.navigate(direction);
				this.setDisabled(false);
			}
			event.stopPropagation();
			event.preventDefault();
		}
	};
	return new MAF.Class({
		ClassName: 'BaseCarousel',

		Extends: MAF.element.Container,

		Protected: {
			registerEvents: function (types) {
				this.parent(['navigateoutofbounds'].concat(types || []));
			},
			dispatchEvents: function (event) {
				this.parent(event);
				switch (event.type) {
					case 'navigateoutofbounds':
						this.fire('onNavigateOutOfBounds', event.detail, event);
						break;
				}
			},
			generateCells: function (count, data) {
				while(this.cells.length) {
					this.cells.pop().suicide();
				}

				var cellUpdater = this.config.cellUpdater;
				if (count > 0 && count > this.cells.length) {
					var fragment = createDocumentFragment(),
						dims = {
							width: ((1 / this.config.columns) * 100)/((this.config.orientation === 'horizontal') ? this.getPageCount() : 1) + '%',
							height: ((1 / this.config.rows) * 100)/((this.config.orientation === 'horizontal') ? 1 : this.getPageCount()) + '%'
						};
					for (var i = this.cells.length; i < count; i++) {
						var cell = this.config.cellCreator.call(this).setStyles(dims);
						cell.carousel = this;
						fragment.appendChild(cell.element);
						cell.fire('onAppend', {
							parent: this.element,
							owner: this
						});
						this.cells.push(cell);
						cellUpdater.call(this, cell, data[i]);
						
					}
					this.body.element.appendChild(fragment);
					
				}
				return this.cells.length;
			},
			handleFocusEvent: function (event) {
				var payload = event.payload;
				switch (event.type) {
					case 'onFocus':
						var newindex = this.getCellIndex(payload || {row:0, column:0});
						this.updateState({
							hasFocus: true,
							focusIndex: newindex,
							focusCoordinates: {
								row:    payload.row,
								column: payload.column
							}
						});
						break;
					case 'onBlur':
						this.updateState({
							hasFocus: false
						});
						break;
				}
			}
		},

		config: {
			rows: 1,
			columns: 1,
			orientation: 'horizontal',
			carousel: true
		},

		initialize: function () {
			this.config.orientation = (this.config.orientation === 'vertical') ? 'vertical' : 'horizontal';
			this.config.rows    = this.config.rows    || 1;
			this.config.columns = this.config.columns || 1;
			this.parent();
			this.cells = [];

			getter(this, 'hasFocus', function () {
				var activeElement = document.activeElement;
				return activeElement && this.cells.indexOf(activeElement) > -1 || false;
			});

			this.body = new MAF.element.Core({
				element: List,
				styles: {
					width: 'inherit',
					height: 'inherit',
					overflow: 'inherit'
				}
			}).appendTo(this);

			this.element.innerNavigation = true;

			this.handleFocusEvent.subscribeTo(this, ['onFocus', 'onBlur'], this);
			handleNavEvent.subscribeTo(this, 'onNavigateOutOfBounds', this);

			this.store('state', {});

			var data = this.config.dataset || this.config.dataSet;
			if (data && data.length > 0) {
				this.changeDataset(this.config.dataset || this.config.dataSet);
				delete this.config.dataset;
				delete this.config.dataSet;
			}
		},

		focus: function () {
			if (this.cells.length > 0 && !this.hasFocus) {
				this.cells[0].focus();
			}
		},

		getCellCount: function () {
			return this.config.rows * this.config.columns;
		},

		getVisibleCellCount: function () {
			return this.cells && this.cells.filter(function (c) {
				return c && c.visible;
			}).length || this.cells.length;
		},

		setDisabled: function (disabled) {
			this.element.allowNavigation = !disabled;
			return this;
		},

		getCurrentPage: function () {},

		getPageCount: function () {
			var data = this.retrieve('data', data) || [];
			return Math.ceil(data.length/this.getCellCount());
		},

		getStartIndex: function () {},
		getFocusIndex: function () {},
		setFilter: function () {},

		getCellCoordinates: function (a, b) {
			var index = this.cells.indexOf(a),
				cols  = this.config.columns;
			return 0;
		},

		getCellDimensions: function () {
			return {
				width:  Math.floor(this.width / this.config.columns),
				height: Math.floor(this.height / this.config.rows)
			};
		},

		getCellIndex: function (cell) {
			return this.cells.indexOf(cell);
		},

		getCellDataIndex: function (cell) {
			return this.getCellIndex(cell);
		},

		getCellDataItem: function (cell) {
			var data = this.retrieve('data'),
				len = data.length,
				i = this.getCellDataIndex(cell);
			return i > -1 && i < len ? data[i] : null;
		},

		getState: function () {
			return this.retrieve('state');
		},

		updateState: function (state) {
			var newState = Object.merge(this.getState(), state || {});
			this.store('state', newState);
			this.fire('onStateUpdated', newState);
			return newState;
		},

		changeDataset: function (data) {
			data = data || [];
			this.store('data', data);
			this.generateCells(data.length, data);
			if (this.config.orientation === 'horizontal') {
				this.body.setStyle('width', (this.width * this.getPageCount()));
			}
			return this;
		},

		suicide: function () {
			if (this.cells) {
				while(this.cells.length) {
					this.cells.pop().suicide();
				}
				delete this.cells;
			}
			if (this.body) {
				this.body.suicide();
				delete this.body;
			}
			this.parent();
		}
	});
});
