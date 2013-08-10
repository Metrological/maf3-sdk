define('MAF.element.Grid', function () {
	return new MAF.Class({
		ClassName: 'BaseGrid',

		Extends: MAF.element.Container,

		Protected: {
			generateCells: function (count) {
				if (count > 0 && this.cells.length === 0) {
					var fragment = createDocumentFragment(),
						dims = this.getCellDimensions();
					for (var i = this.cells.length; i < count; i++) {
						this.cells[i] = this.getNewCell();
						this.cells[i].grid = this;
						this.cells[i].setStyles(dims);
						this.layoutCell(this.cells[i], i, count, this.cells.length);
						fragment.appendChild(this.cells[i].element);
					}
					this.body.element.appendChild(fragment);
				}
				return this.cells.length;
			},
			updateWaitIndicator: function () {
			},
			getNewCell: function () {
				return this.config.cellCreator.apply(this);
			},
			updateState: function (state) {
				this._state = Object.merge(this._state, state || {});
				this.fire('onStateUpdated', this._state);
				return this._state;
			},
			handleFocusEvent: function (event) {
				if (this.element.allowNavigation === false) {
					event.preventDefault();
					return false;
				}
				var fc = this._state.focusCoordinates || {row:0,column:0},
					direction = this.element.currentNavigation || 'down';
				switch (event.type) {
					case 'onFocus':
						switch (direction) {
							case 'up':
								fc.row = this.config.rows - 1;
								break;
							case 'down':
								fc.row = 0;
								break;
						}
						this.focusCell(fc);
						break;
					case 'onBlur':
						this.blurCell(fc);
						break;
				}
			},
			handleSelectEvent: function (event) {
				var cellIndex = this.getCellIndex(this._state.focusCoordinates || -1),
					target    = cellIndex > -1 ? this.cells[cellIndex] : false,
					dataIndex = target && this.getCellDataIndex(target),
					dataItem  = target && this.getCellDataItem(target);
				if (target) {
					target.fire('onSelect', {
						cellIndex: cellIndex,
						dataIndex: dataIndex,
						dataItem:  dataItem
					});
				}
			},
			handleNavEvent: function (event) {
				var direction = event.payload.direction,
					carousel  = this.config.carousel,
					release   = false,
					shift     = false,
					state     = this._state,
					page      = state.currentPage || 0,
					lastpage  = Math.max(0, this.getPageCount() - 1),
					items     = state.dataLength,
					horiz     = this.config.orientation == 'horizontal',
					focused   = state.focusCoordinates || {},
					target    = {
						row:    focused.row    || 0,
						column: focused.column || 0
					},
					dataSize = this.pager._dataSize,
					availableRows = Math.ceil(items / this.config.columns);
				switch (direction) {
					case 'left':
						if (horiz) {
							if (target.column === 0) {
								if (page || carousel) {
									shift = true;
									target.column = this.config.columns - 1;
								}
							} else {
								target.column--;
							}
						} else {
							if (target.column === 0) {
								release = true;
							} else {
								target.column = target.column - 1;
							}
						}
						break;
					case 'right':
						if (horiz) {
							if (target.column == this.config.columns - 1) {
								if (page < lastpage || carousel) {
									shift = true;
									target.column = 0;
								}
							} else {
								target.column++;
							}
						} else {
							var availableCols = (items / availableRows) / (target.column + 1);
							if (focused.column === this.config.columns - 1) {
								release = true;
							} else {
								target.column = target.column + 1;
							}
						}
						break;
					case 'up':
						if (horiz) {
							if (target.row === 0) release = true;
							else target.row--;
						} else {
							var LastRowItems = Math.ceil(dataSize / this.config.columns) % this.config.rows;
								LastRowItems = (LastRowItems === 0 )? this.config.rows-1 : LastRowItems-1;
							
							if (target.row === 0) {
								if (page || carousel) {
									shift = true;
									if (page === 0 && carousel) {
										target.row = LastRowItems;
									} else {
										target.row = this.config.rows - 1;
									}
								}
							} else {
								target.row = target.row - 1;
							}
						}
						break;
					case 'down':
						if (horiz) {
							if (target.row == this.config.rows - 1) release = true;
							else target.row++;
						} else {
							var LastColumn =(dataSize %  (this.config.columns * this.config.rows));
								LastColumn = ( LastColumn !== 0 ) ? LastColumn : this.config.columns; // last column number of the last row
							if (availableRows < (target.row + 2)) {
								target.row = (this.config.rows - 1);
							}
							if (target.row === this.config.rows - 1) {
								if (page < lastpage || carousel) {
									shift = true;
									target.row = 0;
									if (page  ===  lastpage -1 && focused.column+1 > LastColumn) {
										target.column = LastColumn-1;
									}
								}
							} else {
								var LastItems = items % this.config.columns;
								if ((items - ((focused.row+1) * this.config.columns)) < this.config.columns && focused.column+1 > (LastItems)) {
									target.column =  LastItems -1; // end column
								}
								target.row = focused.row + 1;
							}
						}
						break;
				}
				if (!this.getVisibleCellCount()) {
					release = true;
				}
				if (shift && !state.animating) {
					this.shift(direction, {focus: target});
					event.preventDefault();
				} else if (release) {
					this.releaseFocus(direction, event);
				} else if (target.column == focused.column && target.row == focused.row) {
					event.preventDefault();
				} else {
					var fidx = this.getCellIndex(target);
					if (fidx > -1 && this.cells[fidx] && this.cells[fidx].visible) {
						event.preventDefault();
						this.focusCell(target, event);
					} else {
						switch (direction) {
							case 'right':
								if (!target.row) {
									target.column = 0;
									this.shift(direction, {focus: target});
									return;
								}
								target.row = target.row - 1;
								event.preventDefault();
								this.focusCell(target, event);
								break;
							case 'down':
								var hit = false;
								for (var i = target.column; i; i--) {
									target.column = target.column - 1;
									fidx = this.getCellIndex(target);
									if (fidx === -1 || !this.cells[fidx] || !this.cells[fidx].visible) {
										continue;
									}
									event.preventDefault();
									this.focusCell(target, event);
									hit = true;
								}
								if (hit) this.releaseFocus(direction, event);
								break;
						}
					}
				}
			},
			onDataPage: function (event) {
				var request = this._state.pageRequested,
					index = event.payload.index;
				if (event.type != this.pager._eventType || !event.payload.data) {
					return;
				}
				if (index != request.index) {
					return;
				}
				if (this.body) {
					this.body.freeze();
				}
				var data = event.payload.data.items.length && [].concat(event.payload.data.items) || [];
				this._state.dataLength = data.length;
				if (this.config.focus) {
					if (data.length === 0) {
						this.element.wantsFocus = false;
					} else {
						this.element.wantsFocus = true;
					}
				}
				if (this._state.focusIndex === undefined) {
					this._state.focusIndex = -1;
				}
				this.cells.forEach(function(c) {
					c.hide();
				});
				this.generateCells(data.length);
				for (var i = 0; i < data.length; i++) {
					var cell = this.cells[i];
					if (cell) {
						this.updateCell(cell, data[i]);
						cell.show();
					}
				}
				this.updateState({
					startIndex: request.index,
					currentPage: request.index / this.getCellCount()
				});
				var focus = request.options.focus,
					fidx = this.getCellIndex(focus);
				if (focus) {
					var loop = this.cells.length;
					while (fidx >= data.length && loop) {
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
				}
				this.fire('onPageChanged', this.updateState({
					pageChanging: false
				}));
				if (this.body) this.body.thaw();
				if (fidx !== undefined && fidx > -1) this.focusCell(fidx);
			},
			layoutCell: function (cell, cellIndex) {
				var h = (cellIndex % this.config.columns),
					v = Math.floor(cellIndex / this.config.columns);
				if (h > 0) {
					cell.hOffset = cell.width * h;
				}
				if (v > 0) {
					cell.vOffset = cell.height * v;
				}
			},
			updateCell: function (cell, dataItem) {
				return this.config.cellUpdater.call(this, cell, dataItem);
			}
		},

		config: {
			rows: 1,
			columns: 1,
			orientation: 'horizontal',
			carousel: false,
			inverted: false,
			render: true,
			focus: true,
			manageWaitIndicator: false,
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
			var dims = {
				width:  'inherit',
				height: 'inherit'
			};

			this.body = new MAF.element.Core({
				styles: dims
			}).appendTo(this);

			this.generateCells(Math.min(this.pager.getDataSize(), this.pager.getPageSize()));

			this.onDataPage.subscribeTo(this.pager, this.pager._eventType, this);
			this.updateWaitIndicator.subscribeTo(this,['onChangePage','onPageChanged'],this);
			this.handleFocusEvent.subscribeTo(this,['onFocus','onBlur'],this);
			this.handleSelectEvent.subscribeTo(this,'onSelect',this);
			this.handleNavEvent.subscribeTo(this,'onNavigate',this);
			this._state = {};

			if (this.config.render) {
				var st = this.config.state || {},
					op = {transition:'none'};
				if (st.focusCoordinates) {
					op.focus = st.focusCoordinates;
				}
				this.changePage(st.currentPage || 0, op);
			}
			delete this.config.state;
			delete this.config.dataset;
			delete this.config.dataSet;

			if (this.getVisibleCellCount() === 0) {
				this.element.wantsFocus = false;
			}
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
				var view = this.getViewController();
				if (view) {
					view.registerMessageCenterListenerControl(this);
				}
			}
			return this;
		},

		changeDataset: function (data, reset, data_length) {
			data = data && data.length ? data : [];
			data_length = data_length && (data_length > data.length) ? data_length : data.length;
			this.pager.initItems(data, data_length);
			if (reset) {
				this._state.focusCoordinates = {row:null, column:null};
			}
			var state = this._state,
				focus = this.element.hasFocus && state.focusCoordinates,
				start = reset ? 0 : this._state.currentPage || 0,
				options = {transition:'none', refresh:true, focus:focus};
			this.changePage(start, options);
			this.fire("onDatasetChanged");
			return this;
		},

		getDataItem: function (index) {
			return this.pager.getItem(index);
		},

		getState: function () {
			return clone(this._state);
		},

		releaseFocus: function (direction, event) {
			return true;
		},

		shift: function (type, options) {
			var target = false,
				current = this._state.currentPage || 0,
				lastpage = Math.max(0, this.pager.getNumPages() - 1),
				carousel = this.config.carousel;
			options = options || {};
			switch (type) {
				case 'back':
				case 'previous':
					// needs history
					break;
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
				index = this.normalizeIndex((pagenum || 0) * count);
			if (pagenum === this._state.currentPage && (options && !options.refresh)) {
				return;
			}
			var state = this.updateState({
				pageRequested: {
					index: index,
					options: options || {}
				},
				pageChanging: true
			});

			this.fire('onChangePage', state);
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
			return this.cells && this.cells.filter(function(c) {
				return c && c.visible;
			}).length || this.cells.length;
		},

		getPageCount: function () {
			return this.pager.getNumPages();
		},

		getCurrentPage: function () {
			return this._state.currentPage;
		},

		getStartIndex: function () {
			return this._state.startIndex;
		},

		getFocusIndex: function () {
			return this._state.focusIndex;
		},

		getFocusCoordinates: function () {
			return this._state.focusCoordinates;
		},

		focusCell: function (target) {
			var focused  = this._state.focusIndex,
				newindex = this.getCellIndex(target || {row:0, column:0}),
				rendered = this.getVisibleCellCount();
			if (!rendered || newindex === -1 || !this.element || !this.element.hasFocus) {
				return;
			}
			newindex = Math.min(rendered-1, newindex);
			if (focused != newindex) {
				this.blurCell(focused);
			}
			if (newindex > -1) {
				this.cells[newindex].fire('onFocus');
			}
			focused = this.getCellCoordinates(newindex);
			this.updateState({
				focusIndex: newindex,
				focusCoordinates: {
					row:    focused.row,
					column: focused.column
				}
			});
		},

		blurCell: function (target) {
			target = parseInt(target, 10) > -1 ? target : this._state.focusCoordinates;
			var index = this.getCellIndex(target);
			if (index > -1 && this.cells[index]) {
				this.cells[index].fire('onBlur');
			}
		},

		getCellDimensions: function () {
			return {
				width:  Math.floor(this.body.width / this.config.columns),
				height: Math.floor(this.body.height / this.config.rows)
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
			var state = this._state,
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
				type = typeof data;
			if (type == 'null' || type == 'undefined') {
				return packet;
			}
			if (focusOnly) {
				if (data.focused) {
					if (this.getVisibleCellCount()) {
						this.focus();
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

		generateStatePacket: function (packet) {
			return Object.merge({
				state: this._state,
				focused: this.element.hasFocus
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
			delete this._state;
			this.parent();
		}
	});
});
