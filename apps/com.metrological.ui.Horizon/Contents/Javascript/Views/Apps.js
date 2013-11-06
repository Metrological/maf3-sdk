var AppsView = new MAF.Class({
	ClassName: 'AppsView',

	Extends: MAF.system.FullscreenView,

	state: null,

	initialize: function () {
		this.parent();
		this.registerMessageCenterListenerCallback(this.dataHasChanged);
		this.onWidgetKeyPress = this.handleFavoriteBack.subscribeTo(MAF.application, 'onWidgetKeyPress', this);
	},

	dataHasChanged: function (event) {
		if (event.payload.value && event.payload.key === 'myApps') {
			this.appsReady();
		}
	},

	handleFavoriteBack: function (event) {
		if (event.payload.key === 'back' && this.state !== null) {
			var categories = ApplicationManager.getCategories(),
				data;
			this.state = null;
			if (this.category === 'favorites') {
				delete this.reodered;
				delete this.reorder;
				delete this.cell;
				delete this.icon;
				data = this.getFavoritesCategory();
			} else {
				data = ApplicationManager.getApplicationsByCategory(this.category);
			}
			this.controls.apps.changeDataset(data, true);
			event.stopPropagation();
			event.preventDefault();
		}
	},

	getFavorites: function () {
		return currentAppData.get('favorites') || [];
	},

	setFavorites: function (favorites) {
		currentAppData.set('favorites', favorites || []);
		return favorites;
	},

	addFavorite: function (id) {
		var favorites = this.getFavorites();
		if (favorites.indexOf(id) === -1) {
			favorites.push(id);
			this.setFavorites(favorites);
		}
		return favorites;
	},

	removeFavorite: function (id) {
		var favorites = this.getFavorites(),
			i = this.getFavoriteIndex(id);
		if (i !== -1) {
			favorites.splice(i, 1);
			this.setFavorites(favorites);
		}
		return favorites;
	},

	reorderFavorite: function (id, idx) {
		var favorites = this.getFavorites(),
			i = this.getFavoriteIndex(id);
		if (i !== -1 && idx < favorites.length) {
			favorites.splice(i, 1);
			favorites.splice(idx, 0, id);
			this.setFavorites(favorites);
		}
		return favorites;
	},

	getFavoritesCategory: function () {
		switch (this.state) {
			case 'addfavo':
			case 'reorderfavo':
				return this.getFavorites().concat([this.state]);
			default:
				return this.getFavorites().concat(['addfavo', 'reorderfavo']);
		}
	},

	getFavoriteIndex: function (id) {
		return this.getFavorites().indexOf(id);
	},

	appsReady: function () {
		if (this.ready !== true) {
			this.ready = true;
			this.controls.categories.setDisabled(false);
			this.controls.categories.focus();
			if (this.getFavorites().length === 0) {
				this.controls.categories.focusCell(1);
			}
			this.controls.apps.focus();
		}
	},

	createView: function () {
		this.controls.categories = new MAF.element.Grid({
			guid: 'categories',
			rows: 10,
			columns: 1,
			carousel: true,
			orientation: 'vertical',
			dataset: ApplicationManager.getCategories(),
			cellCreator: function () {
				var baseFontColor = 'rgba(255,255,255,.6)',
					cell = new MAF.element.GridCell({
						styles: Object.merge(this.getCellDimensions(), {
							transform: 'translateZ(0)'
						}),
						events: {
							onFocus: function () {
								var category = this.getCellDataItem(),
									view = this.grid.owner,
									data;
								if (category === 'favorites') {
									data = view.getFavoritesCategory();
								} else {
									data = ApplicationManager.getApplicationsByCategory(category);
								}
								this.animate({
									scale: 1.2,
									origin: ['0%', '50%'],
									duration: 0.2
								});
								this.category.animate({
									color: 'white',
									fontWeight: 'bold',
									duration: 0.2
								});
								if (view.category !== category) {
									var first = view.category === undefined;
									Horizon.setText($_('CATEGORY_' + category.toUpperCase()));
									view.category = category;
									view.controls.apps.animate({
										opacity: 0,
										duration: 0.3,
										events: {
											onAnimationEnded: function () {
												if (view.category === category) {
													this.animate({
														opacity: 1,
														duration: 0.3,
														events: {
															onAnimationEnded: function () {
																if (view.category === category && first) {
																	this.focus();
																}
															}
														}
													});
												}
												if (view.category === category) {
													this.changeDataset(data || [], true);
												}
											}
										}
									});
								}
							},
							onBlur: function () {
								var cell = this,
									category = cell.getCellDataItem(),
									view = cell.grid.owner;
								cell.animate({
									scale: 1,
									origin: ['0%', '50%'],
									duration: 0.2
								});
								(function () {
									if (cell && view.category !== category) {
										cell.category.animate({
											color: baseFontColor,
											fontWeight: 'normal',
											duration: 0.2
										});
									}
								}).delay(100);
							}
						}
					});

				cell.category = new MAF.element.Text({
					styles: {
						color: baseFontColor,
						width: 'inherit',
						height: 'inherit',
						fontSize: '1.3em',
						anchorStyle: 'leftCenter'
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function (cell, data) {
				cell.category.setText($_('CATEGORY_' + data.toUpperCase()));
			},
			styles: {
				transform: 'translateZ(0)',
				width: 376,
				height: 400,
				hOffset: 134,
				vAlign: 'bottom',
				vOffset: 300
			},
			events: {
				onNavigateOutOfBounds: function (event) {
					var direction = event.payload.direction;
					if (direction === 'right' || direction === 'left') {
						var apps = this.owner.controls.apps;
						apps.focus();
						apps.focusCell(direction === 'left' ? Math.min(apps.cells.length, apps.config.columns - 1) : 0);
						event.preventDefault();
					}
				}
			}
		}).appendTo(this);

		var cellSize = 215,
			cellRows = 2,
			cellColumns = 6;

		this.controls.apps = new MAF.element.Grid({
			guid: 'apps',
			rows: cellRows,
			columns: cellColumns,
			//carousel: true,
			orientation: 'vertical',
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: Object.merge(this.getCellDimensions(), {
						transform: 'translateZ(0)'
					}),
					events: {
						onSelect: function (event) {
							var id = this.getCellDataItem(),
								grid = this.grid,
								view = grid.owner;
							if (id === 'addfavo') {
								if (view.state === id) {
									view.state = null;
								} else if (view.state === null) {
									view.state = id;
								}
								grid.changeDataset(view.getFavoritesCategory(), true);
							} else if (id === 'reorderfavo') {
								if (view.state === id) {
									view.state = null;
								} else {
									view.state = id;
								}
								grid.changeDataset(view.getFavoritesCategory(), true);
								grid.focusCell(grid.cells.length - 1);
							} else if (view.state !== null) {
								var i = view.getFavoriteIndex(id);
								switch (view.state) {
									case 'addfavo':
										if (i === -1) {
											view.addFavorite(id);
											cell.overlay.setSource('Images/RemoveFavoIcon.png');
										} else {
											view.removeFavorite(id);
											cell.overlay.setSource('Images/AddFavoIcon.png');
										}
										break;
									case 'reorderfavo':
										if (!view.reorder) {
											view.reorder = id;
											view.cell = this;
											view.icon = this.icon.source;
										} else if (view.reodered !== undefined) {
											view.reorderFavorite(view.reorder, view.reodered);
											delete view.reodered;
											delete view.reorder;
											delete view.cell;
											delete view.icon;
											grid.changeDataset(view.getFavoritesCategory(), true);
										}
										break;
								}
							} else {
								ApplicationManager.load(id);
								ApplicationManager.open(id);
								Horizon.setText('');
							}
						},
						onFocus: function () {
							var id = this.getCellDataItem(),
								coords = this.getCellCoordinates(),
								view = this.grid.owner,
								origin = [];
							if (coords.column === 0) {
								origin.push('left');
							} else if (coords.column === (coords.columns - 1)) {
								origin.push('right');
							} else {
								origin.push('center');
							}
							if (coords.row === 0) {
								origin.push('top');
							} else if (coords.row === (coords.rows - 1)) {
								origin.push('bottom');
							} else {
								origin.push('center');
							}
							this.focusImg.animate({
								opacity: 1,
								duration: 0.2
							});
							this.animate({
								scale: 1.25,
								origin: origin,
								zOrder: Animator.ZORDER,
								duration: 0.2
							});
							if (id === 'addfavo') {
								view.elements.appTitle.setText($_('ADDFAVO'));
								if (view.state === id) {
									view.elements.appDescription.setText($_('ADDFAVO_SELECTED'));
								} else {
									view.elements.appDescription.setText($_('ADDFAVO_DESC'));
								}
							} else if (id === 'reorderfavo') {
								view.elements.appTitle.setText($_('REORDERFAVO'));
								if (view.state === id) {
									view.elements.appDescription.setText($_('REORDERFAVO_SELECTED'));
								} else {
									view.elements.appDescription.setText($_('REORDERFAVO_DESC'));
								}
							} else {
								view.elements.appTitle.setText(ApplicationManager.getMetadataByKey(id, 'name'));
								view.elements.appDescription.setText(ApplicationManager.getMetadataByKey(id, 'description'));
							}
							if (view.reorder && view.cell && this.retrieve('favbutton') !== true) {
								var currentIcon = this.icon.source;
								view.reodered = this.getCellDataIndex();
								if (view.cell === this) {
									this.icon.setSource(view.icon);
								} else if (view.cell) {
									this.original = currentIcon;
									this.icon.setSource(view.icon);
									if (view.cell.icon) {
										view.cell.icon.setSource(currentIcon);
									}
								}
							}
						},
						onBlur: function () {
							var id = this.getCellDataItem(),
								coords = this.getCellCoordinates(),
								view = this.grid.owner,
								origin = [];
							if (coords.column === 0) {
								origin.push('left');
							} else if (coords.column === (coords.columns - 1)) {
								origin.push('right');
							} else {
								origin.push('center');
							}
							if (coords.row === 0) {
								origin.push('top');
							} else if (coords.row === (coords.rows - 1)) {
								origin.push('bottom');
							} else {
								origin.push('center');
							}
							this.focusImg.animate({
								opacity: 0,
								duration: 0.2
							});
							this.animate({
								scale: 1,
								origin: origin,
								zOrder: null,
								duration: 0.2
							});
							view.elements.appTitle.setText('');
							view.elements.appDescription.setText('');
							if (view.reorder && view.cell && this.original && this.retrieve('favbutton') !== true) {
								view.cell = this;
								this.icon.setSource(this.original);
								delete this.original;
							}
						}
					}
				});

				cell.focusImg = new MAF.element.Image({
					src: 'Images/IconFocus.png',
					styles: {
						opacity: 0,
						width: 192,
						height: 192,
						hOffset: (cell.width - 192) / 2,
						vOffset: (cell.height - 192) / 2
					}
				}).appendTo(cell);

				cell.icon = new MAF.element.Image({
					hideWhileLoading: true,
					styles: {
						width: 192,
						height: 192,
						hOffset: (cell.width - 192) / 2,
						vOffset: (cell.height - 192) / 2
					}
				}).appendTo(cell);

				cell.overlay = new MAF.element.Image({
					hideWhileLoading: true,
					styles: {
						width: 192,
						height: 192,
						hOffset: (cell.width - 192) / 2,
						vOffset: (cell.height - 192) / 2
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function (cell, id) {
				var view = cell.grid.owner;
				if (id === 'addfavo') {
					cell.store('favbutton', true);
					if (view.state === id) {
						cell.icon.setSource('Images/AddFavoActive.png');
					} else {
						cell.icon.setSource('Images/AddFavo.png');
					}
				} else if (id === 'reorderfavo') {
					cell.store('favbutton', true);
					if (view.state === id) {
						cell.icon.setSource('Images/ReOrderFavoActive.png');
					} else {
						cell.icon.setSource('Images/ReOrderFavo.png');
					}
				} else {
					cell.eliminate('favbutton');
					cell.icon.setSource(ApplicationManager.getRootPath(id) + ApplicationManager.getMetadata(id).images.icon['192x192']);
					if (view.state === 'addfavo') {
						var i = view.getFavoriteIndex(id);
						if (view.category === 'favorites' || i !== -1) {
							cell.overlay.setSource('Images/RemoveFavoIcon.png');
						} else {
							cell.overlay.setSource('Images/AddFavoIcon.png');
						}
					} else if (view.state === 'reorderfavo') {
						cell.overlay.setSource('Images/ReOrderFavoIcon.png');
					} else {
						cell.overlay.setSource('');
					}
				}
			},
			styles: {
				transform: 'translateZ(0)',
				width: cellSize * cellColumns,
				height: cellSize * cellRows,
				hOffset: this.controls.categories.outerWidth,
				vAlign: 'bottom',
				vOffset: this.controls.categories.vOffset - 15,
				opacity: 0
			},
			events: {
				onNavigateOutOfBounds: function (event) {
					var view = this.owner;
					if (view.state !== 'reorderfavo' && (event.payload.direction === 'right' || event.payload.direction === 'left')) {
						view.controls.categories.focus();
						event.preventDefault();
					} else {
						var categories = ApplicationManager.getCategories(),
							max = categories.length - 1,
							page = this.getCurrentPage() || 0,
							lastpage = Math.max(0, this.getPageCount() - 1),
							idx = categories.indexOf(view.category);
						if (event.payload.direction === 'down') {
							if (page !== lastpage) {
								return;
							}
							if (idx === max) {
								idx = 0;
							} else {
								idx++;
							}
						} else if (event.payload.direction === 'up'){
							if (page !== 0) {
								return;
							}
							if (idx === 0) {
								idx = max;
							} else {
								idx--;
							}
						}
						if (view.state === 'reorderfavo') {
							event.preventDefault();
							return;
						}
						view.controls.categories.focus();
						view.controls.categories.focusCell(idx);
						this.focus();
						this.focusCell(0);
						event.preventDefault();
					}
				}
			}
		}).appendTo(this);

		this.elements.appTitle = new MAF.element.Text({
			styles: {
				hOffset: this.controls.apps.hOffset + 20,
				vOffset: (this.height + 25) - this.controls.categories.vOffset,
				fontSize: '2em',
				fontWeight: 'bold'
			}
		}).appendTo(this);

		this.elements.appDescription = new MAF.element.Text({
			visibleLines: 3,
			styles: {
				width: this.width - this.elements.appTitle.hOffset - 140,
				hOffset: this.elements.appTitle.hOffset,
				vOffset: this.elements.appTitle.outerHeight + 25,
				wrap: true,
				truncation: 'end'
			}
		}).appendTo(this);
	},

	focusView: function () {
		if (MAF.messages.exists('myApps')) {
			this.appsReady();
		}
		if (this.category) {
			Horizon.setText($_('CATEGORY_' + this.category.toUpperCase()));
		}
	},

	destroyView: function () {
		this.onWidgetKeyPress.unsubscribeFrom(MAF.application, 'onWidgetKeyPress');
		delete this.onWidgetKeyPress;
		delete this.reodered;
		delete this.reorder;
		delete this.cell;
		delete this.icon;
		delete this.category;
	}
});
