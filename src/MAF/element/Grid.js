define('MAF.element.Grid', function () {
	var onAppend = function () {
		if (this.config.render) {
			var st = this.config.state || {},
				op = {transition:'none'};
			if (st.focusCoordinates) {
				op.focus = st.focusCoordinates;
			}
			this.changePage(st.currentPage || 0, op);
		}
		delete this.config.state;
	};
	var onNavigateOutOfBounds = function (event) {
		if (event.defaultPrevented) {
			return;
		}
		var cellEl     = event && event.Event && event.Event.target,
			cellCl     = cellEl && cellEl.owner,
			direction  = event && event.payload && event.payload.direction,
			carousel   = this.config.carousel,
			shift      = false,
			state      = this.getState(),
			page       = state.currentPage || 0,
			lastpage   = Math.max(0, this.getPageCount() - 1),
			items      = state.dataLength,
			horiz      = this.config.orientation === 'horizontal',
			cellCoords = cellCl && cellCl.getCellCoordinates(),
			dataSize   = this.pager.getDataSize() || 0,
			availableRows = Math.ceil(items / this.config.columns);

		switch (direction) {
			case 'left':
				if (horiz) {
					if (cellCoords.column === 0) {
						if (page || (lastpage > 0 && carousel)) {
							shift = true;
							cellCoords.column = cellCoords.columns - 1;
						}
					}
				}
				break;
			case 'right':
				if (horiz) {
					if (cellCoords.column == cellCoords.columns - 1) {
						if (page < lastpage || (lastpage > 0 && carousel)) {
							shift = true;
							cellCoords.column = 0;
						}
					}
				}
				break;
			case 'up':
				if (!horiz) {
					if (cellCoords.row === 0) {
						if (page || (lastpage > 0 && carousel)) {
							shift = true;
							if (page === 0 && carousel) {
								var LastRowItems = Math.ceil(dataSize / this.config.columns) % this.config.rows;
									LastRowItems = (LastRowItems === 0 )? this.config.rows-1 : LastRowItems-1;
								cellCoords.row = LastRowItems;
							} else {
								cellCoords.row = this.config.rows - 1;
							}
						}
					}
				}
				break;
			case 'down':
				if (!horiz) {
					var LastColumn = (dataSize %  (this.config.columns * this.config.rows));
						LastColumn = ( LastColumn !== 0 ) ? LastColumn : this.config.columns; // last column number of the last row
					if (availableRows < (cellCoords.row + 2)) {
						cellCoords.row = (this.config.rows - 1);
					}
					if (cellCoords.row === this.config.rows - 1) {
						if (page < lastpage || (lastpage > 0 && carousel)) {
							shift = true;
							cellCoords.row = 0;
							if (page  ===  lastpage -1 && cellCoords.column+1 > LastColumn) {
								cellCoords.column = LastColumn-1;
							}
						}
					}
				}
				break;
		}

		if (shift && !state.animating) {
			this.shift(direction, {focus: cellCoords});
			event.preventDefault();
			event.stopPropagation();
		} else if (horiz && direction === 'right') {
/*			if (!cellCoords.row) {
				cellCoords.column = 0;
				this.shift(direction, {focus: cellCoords});
				return;
			}
*/			var col = Math.min(cellCoords.column + 1, cellCoords.columns - 1);
			if (col !== cellCoords.column) {
				cellCoords.row = cellCoords.row - 1;
				cellCoords.column = Math.min(cellCoords.column + 1, cellCoords.columns - 1);
				event.preventDefault();
				event.stopPropagation();
				this.focusCell(cellCoords, event);
			}
		} else if (!horiz && direction === 'down') {
			// handle page switch
		} else {
			this.setDisabled(true);
			if (this.element.navigate(direction)) {
				event.preventDefault();
				event.stopPropagation();
			}
			this.setDisabled(false);
		}
	};

	return new MAF.Class({
		ClassName: 'BaseGrid',

		Extends: MAF.element.Container,

		Protected: {
			registerEvents: function (types){
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
				if (count > 0 && count > this.cells.length) {
					var fragment = createDocumentFragment(),
						dims = {
							width: ((1 / this.config.columns) * 100) + '%',
							height: ((1 / this.config.rows) * 100) + '%'
						};
					for (var i = this.cells.length; i < count; i++) {
						var cell = this.config.cellCreator.call(this).setStyles(dims);
						cell.grid = this;
						fragment.appendChild(cell.element);
						cell.fire('onAppend', {
							parent: this.element,
							owner: this
						});
						this.cells.push(cell);
					}
					this.body.element.appendChild(fragment);
				}
				return this.cells.length;
			},
			updateWaitIndicator: function (event) {
				if (this.config.manageWaitIndicator) {
					var method = (event.type === 'onPageChanged') ? 'down' : 'up';
					MAF.utility.WaitIndicator[method]();
				}
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
			},
			onDataPage: function (event) {
				var state = this.getState(),
					request = state.pageRequested,
					cellUpdater = this.config.cellUpdater,
					payload = event.payload,
					type = event.type,
					index = payload && payload.index;
				if (!payload || type !== this.pager.eventType || !payload.data || !request || index !== request.index) {
					return;
				}
				var data = payload.data.items && payload.data.items.length && [].concat(payload.data.items) || [],
					dataLength = data.length;
				if (state.focusIndex === undefined) {
					this.updateState({ focusIndex: -1 });
				}
				this.body.freeze();
				if (this.cells && this.cells.length > 0 && request && request.options && request.options.refresh) {
					while(this.cells.length) {
						this.cells.pop().suicide();
					}
				}
				if (this.generateCells(dataLength) > 0) {
					this.cells.forEach(function (cell, i) {
						if (i < dataLength) {
							cell.show();
							cellUpdater.call(this, cell, data[i]);
						} else {
							cell.hide();
						}
					}, this);
				}
				this.body.thaw();
				this.updateState({
					startIndex: request.index,
					currentPage: request.index / this.getCellCount(),
					dataLength: dataLength
				});
				var focus = request.options.focus,
					fidx = this.getCellIndex(focus);
				if (focus && state.hasFocus) {
					var loop = this.cells.length;
					while (fidx >= dataLength && loop) {
						switch (request.options.direction) {
							case 'right':
								if (focus.column && focus.row) {
									focus.row = focus.row - 1;
								} else {
									if (focus.row) {
										focus.row = focus.row - 1;
										focus.column = this.config.columns - 1;
									} else {
										focus.column = focus.column - 1;
									}
								}
								fidx = this.getCellIndex(focus);
								break;
							case 'left':
								focus.row = Math.max(0, focus.row - 1);
								fidx = this.getCellIndex(focus);
								break;
							case 'up':
								focus.column = Math.max(0, focus.column - 1);
								fidx = this.getCellIndex(focus);
								break;
							case 'down':
								if (focus.row && focus.column) {
									focus.column = focus.column - 1;
								} else {
									if (focus.column) {
										focus.row = focus.row - 1;
										focus.column = this.config.row - 1;
									} else {
										focus.row = focus.row - 1;
									}
								}
								fidx = this.getCellIndex(focus);
								break;
							default:
								fidx--;
								fidx = this.getCellIndex(fidx);
								break;
						}
						loop--;
					}
					this.focusCell(fidx);
				}
				this.fire('onPageChanged', this.updateState({
					pageChanging: false
				}));
			}
		},

		config: {
			rows: 1,
			columns: 1,
			orientation: 'horizontal',
			carousel: false,
			inverted: false,
			render: true,
			manageWaitIndicator: true,
			animate: false, // TODO: Setting from plugin MAF.config.animationEnabled
			animation: {
				duration: 400,
				transition: 'slide',
				direction: 'left',
				ease: 0 // TODO: animator.kEaseInOut
			}
		},

		initialize: function () {
			this.config.orientation = (this.config.orientation === 'vertical') ? 'vertical' : 'horizontal';
			this.config.rows    = this.config.rows    || 1;
			this.config.columns = this.config.columns || 1;
			this.parent();
			this.cells = [];

			if (this.config.pager) {
				this.pager = this.config.pager;
				delete this.config.pager;
			} else {
				var ds = this.config.dataset || this.config.dataSet || [],
					ct = this.config.rows * this.config.columns;
				this.pager = new MAF.utility.Pager(ct, (this.config.payloadSize || ct));
				this.pager.initItems(ds, ds.length);
			}

			this.body = new MAF.element.Core({
				element: List,
				styles: {
					width: 'inherit',
					height: 'inherit',
					overflow: 'inherit'
				}
			}).appendTo(this);

			this.element.innerNavigation = true;

			this.generateCells(Math.min(this.pager.getDataSize(), this.pager.getPageSize()));

			this.onDataPage.subscribeTo(this.pager, this.pager.eventType, this);
			this.updateWaitIndicator.subscribeTo(this, ['onChangePage', 'onPageChanged'], this);
			this.handleFocusEvent.subscribeTo(this, ['onFocus', 'onBlur'], this);
			onNavigateOutOfBounds.subscribeTo(this, 'onNavigateOutOfBounds', this);
			onAppend.subscribeOnce(this, 'onAppend', this);

			this.store('state', {});

			delete this.config.dataset;
			delete this.config.dataSet;
		},

		setFilter: function (fn) {
			if (this.pager) {
				this.pager.setFilter(fn);
				this.changePage(0);
			}
		},

		appendTo: function (parent) {
			var appended = this.parent(parent);
			if (appended && this.getSubscriberCount('onBroadcast')) {
				var view = this.getView();
				if (view) {
					view.registerMessageCenterListenerControl(this);
				}
			}
			return this;
		},

		changeDataset: function (data, reset, dataLength) {
			data = data && data.length ? data : [];
			dataLength = dataLength && (dataLength > data.length) ? dataLength : data.length;
			this.pager.initItems(data, dataLength);
			if (reset) {
				this.updateState({row:null, column:null});
			}
			var state = this.getState(),
				focus = state.hasFocus && state.focusCoordinates,
				start = reset ? 0 : state.currentPage || 0,
				options = {transition: 'none', refresh: reset || false, focus: focus};
			this.changePage(start, options);
			this.fire("onDatasetChanged");
			return this;
		},

		getDataItem: function (index) {
			return this.pager.getItem(index);
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

		releaseFocus: function (direction, event) {
			return true;
		},

		shift: function (type, options) {
			var target   = false,
				state    = this.getState(),
				current  = state.currentPage || 0,
				lastpage = Math.max(0, this.pager.getNumPages() - 1),
				carousel = this.config.carousel;
			options = options || {};

			switch (type) {
				case 'first':
					target = 0;
					options.direction = (carousel && current > lastpage / 2) ? 'right' : 'left';
					break;
				case 'last':
					target = lastpage;
					options.direction = (carousel && current > lastpage / 2) ? 'right' : 'left';
					break;
				case 'up':
					target = carousel ? current - 1 : Math.max(current - 1, 0);
					options.direction = 'up';
					break;
				case 'down':
					target = carousel ? current + 1 : Math.min(current + 1, lastpage);
					options.direction = 'down';
					break;
				case 'left':
					target = carousel ? current - 1 : Math.max(current - 1, 0);
					options.direction = 'right';
					break;
				case 'right':
					target = carousel ? current + 1 : Math.min(current + 1, lastpage);
					options.direction = 'left';
					break;
				default:
					break;
			}
			if (target !== false) {
				this.changePage(target, options);
			}
		},

		changePage: function (pagenum, options) {
			var count = this.getCellCount(),
				state = this.getState(),
				index = this.normalizeIndex((pagenum || 0) * count);
			if (pagenum !== state.currentPage || (options && options.refresh)) {
				state = this.updateState({
					pageRequested: {
						index: index,
						options: options || {}
					},
					pageChanging: true
				});
				if (this.getPageCount()) {
					this.fire('onChangePage', state);
				}
			}
			this.pager.getPage(index);
		},

		normalizeIndex: function (i) {
			var c = this.pager.getPageSize(),
				d = this.pager.getDataSize(),
				p = Math.ceil(d / c),
				z = p * c,
				w = this.config.carousel;
			
			i = isNaN(i) ? 0 : i;
			
			if (c >= d) return 0;
			else if (i >= d) return w ? Math.floor( (i % z) / c) * c : p * c;
			else if (i < 0)  return w ? Math.floor( (((i % z) + z) % z) / c) * c : 0;
			else return Math.floor(i / c) * c;
		},

		getCellCount: function () {
			return this.config.rows * this.config.columns;
		},

		getVisibleCellCount: function () {
			return this.cells && this.cells.filter(function (c) {
				return c && c.visible;
			}).length || this.cells.length;
		},

		getPageCount: function () {
			return this.pager.getNumPages();
		},

		getCurrentPage: function () {
			return this.getState().currentPage || 0;
		},

		getStartIndex: function () {
			return this.getState().startIndex;
		},

		getFocusIndex: function () {
			var active = document.activeElement,
				state = this.getState(),
				idx = -1;
			if (active && this.cells) {
				idx = this.cells.indexOf(active.owner);
			}
			if (idx === -1 && state.focusIndex !== undefined) {
				idx = state.focusIndex;
			}
			return idx;
		},

		getFocusCoordinates: function () {
			return this.getState().focusCoordinates;
		},

		focus: function () {
			if (this.getVisibleCellCount()) {
				this.updateState({
					hasFocus: true
				});
				this.focusCell(this.getFocusCoordinates() || {row: 0, column: 0});
			}
		},

		focusCell: function (target) {
			var state    = this.getState(),
				focused  = state.focusIndex,
				newindex = this.getCellIndex(target || {row:0, column:0}),
				rendered = this.getVisibleCellCount();
			if (!rendered || newindex === -1 || !state.hasFocus) {
				return;
			}
			newindex = Math.min(rendered-1, newindex);
			if (focused != newindex) {
				this.blurCell(focused);
			}
			if (newindex > -1 && this.cells && this.cells[newindex]) {
				this.cells[newindex].element.focus();
			}
			focused = this.getCellCoordinates(newindex);
			this.updateState({
				focusIndex: newindex,
				focusCoordinates: {
					row:    focused.row,
					column: focused.column
				}
			});
			return this;
		},

		blurCell: function (target) {
			target = parseInt(target, 10) > -1 ? target : this.getState().focusCoordinates;
			var index = this.getCellIndex(target);
			if (index > -1 && this.cells[index]) {
				this.cells[index].element.blur();
			}
			return this;
		},

		getCellDimensions: function () {
			return {
				width:  Math.floor(this.width / this.config.columns),
				height: Math.floor(this.height / this.config.rows)
			};
		},

		getCellCoordinates: function (c) {
			var index = this.cells.indexOf(c);
			try {
				if (index == -1) {
					index = parseInt(c, 10);
				}
			} catch(e) {}
			return index == -1 ? false : {
				row:     Math.floor(index / this.config.columns),
				column:  index % this.config.columns,
				rows:    this.config.rows,
				columns: this.config.columns
			};
		},

		getCellIndex: function (a, b) {
			var index = this.cells.indexOf(a),
				cols  = this.config.columns;
			if (parseInt(index, 10) > -1) {
				return index;
			} else if (typeOf(a) === 'object') {
				if ('row' in a && 'column' in a) {
					index = (a.row||0) * cols + (a.column||0);
				}
			} else if (parseInt(b, 10) > -1) {
				index = a * cols + b;
			} else if (parseInt(a, 10) > -1) {
				index = a;
			}
			index = index > -1 ? index : -1;
			return index;
		},

		getCellDataIndex: function (c) {
			var state = this.getState(),
				start = state.pageRequested && state.pageRequested.index,
				index = this.getCellIndex(c);
			return parseInt(start, 10) > -1 && index > -1 ? start+index : false;
		},

		getCellDataItem: function (c) {
			var index = this.getCellDataIndex(c);
			return parseInt(index, 10) > -1 && this.pager.getItem(index);
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

		inspectStatePacket: function (packet, focusOnly) {
			if (!this.config.guid) {
				return packet;
			}
			if (packet && !(this.config.guid in packet)) {
				return packet;
			}
			var data = packet && packet[this.config.guid],
				type = typeOf(data);
			if (type === 'null' || type === 'undefined') {
				return packet;
			}
			if (focusOnly) {
				if (data.focused) {
					if (this.getVisibleCellCount()) {
						this.updateState({
							hasFocus: true
						});
						this.focusCell(data.state.focusCoordinates || {row: 0, column: 0});
					} else {
						var view = this.getView();
						if (view) {
							view.resetFocus();
						}
					}
				}
			} else {
				if (type == 'object' && data.state) {
					this.changePage(data.state.currentPage || 0, {
						transition: 'none',
						focus: false
					});
				}
			}
			return data;
		},

		setDisabled: function (disabled) {
			this.element.allowNavigation = !disabled;
			return this;
		},

		generateStatePacket: function (packet) {
			var currentState = this.getState();
			return Object.merge({
				state: currentState,
				focused: currentState.hasFocus
			}, packet || {});
		},

		suicide: function () {
			while(this.cells.length) {
				this.cells.pop().suicide();
			}
			delete this.cells;
			this.body.suicide();
			delete this.body;
			delete this.pager;
			this.parent();
		}
	});
});
