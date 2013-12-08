var AppsView = new MAF.Class({
	ClassName: 'AppsView',

	Extends: MAF.system.FullscreenView,

	state: null,
	firstCategory: 1,
	delayedInitialFocus: 800,

	initialize: function () {
		this.parent();
		this.registerMessageCenterListenerCallback(this.dataHasChanged);
		this.onActivateBackButton = this.handleFavoriteBack.subscribeTo(MAF.application, 'onActivateBackButton', this);
	},

	dataHasChanged: function (event) {
		if (event.payload.value && event.payload.key === 'myApps' && !this.ready) {
			this.appsReady();
		}
	},

	handleFavoriteBack: function (event) {
		if (this.state !== null) {
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
		return (currentAppConfig.get('favorites') || []).filter(function (id) {
			return ApplicationManager.exists(id);
		});
	},

	setFavorites: function (favorites) {
		currentAppConfig.set('favorites', favorites || []);
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
				var favo = this.getFavorites().concat(['addfavo']);
				if (favo.length > 2) {
					return favo.concat(['reorderfavo']);
				}
				return favo;
		}
	},

	getFavoriteIndex: function (id) {
		return this.getFavorites().indexOf(id);
	},

	showTOSDialog: function () {
		var view = this;
		if (!document.body.visible || !view.ready || view.frozen) {
			return;
		}
		if (!view.tos) {
			var categories = view.controls.categories,
				tos = filesystem.readFile('About/' + profile.locale + '/tos.txt', true);
			if (!tos) {
				categories.focus();
			} else {
				view.tos = new MAF.dialogs.Alert({
					title: $_('TERMS'),
					isModal: true,
					message: tos,
					buttons: [{
						label: $_('AGREE'),
						callback: function () {
							delete view.tos;
							currentAppConfig.set('tos', TOS);
							categories.focus();
						}
					}, {
						label: $_('CANCEL'),
						callback: function () {
							delete view.tos;
							ApplicationManager.exit();
						}
					}]
				}).show();
			}
		} else {
			view.tos.hide().show();
		}
	},

	appsReady: function () {
		var view = this;
		if (view.ready !== true) {
			view.ready = true;
			var categories = view.controls.categories,
				apps = view.controls.apps;
			categories.setDisabled(false);
			apps.setDisabled(false);
			if (currentAppConfig.get('tos') === TOS) {
				categories.focus();
			} else {
				view.showTOSDialog();
			}
		}
	},

	createView: function () {
		this.controls.categories = new MAF.element.Grid({
			guid: 'categories',
			rows: 9,
			columns: 1,
			carousel: true,
			orientation: 'vertical',
			dataset: ApplicationManager.getCategories(),
			cellCreator: function () {
				var baseFontColor = 'rgba(255,255,255,.6)',
					cell = new MAF.element.GridCell({
						styles: Object.merge(this.getCellDimensions(), {
							transform: 'translateZ(0)',
							transformOrigin: '0% 50%'
						}),
						events: {
							onFocus: function () {
								var category = this.getCellDataItem(),
									grid = this.grid,
									view = grid.owner,
									data;
								if (category === 'favorites') {
									data = view.getFavoritesCategory();
								} else {
									data = ApplicationManager.getApplicationsByCategory(category);
								}
								this.setStyle('transformOrigin', '0% 50%');
								this.animate({
									scale: 1.2,
									origin: ['0%', '50%'],
									duration: 0.2
								});
								this.category.animate({
									color: 'white',
									fontFamily: 'InterstatePro-Bold',
									duration: 0.2
								});
								if (view.category !== category) {
									var first = view.category === undefined;
									if (first && view.getFavorites().length === 0 && !view.first) {
										view.first = true;
										grid.focusCell.defer(100, grid, [view.firstCategory]);
									} else {
										view.category = category;
										view.controls.apps.changeDataset(data || [], true);
										if (first || view.first) {
											delete view.first;
											view.controls.apps.focus();
										}
									}
								}
							},
							onBlur: function () {
								var cell = this,
									grid = cell.grid,
									view = grid.owner;
								cell.animate({
									scale: 1,
									origin: ['0%', '50%'],
									duration: 0.2
								});
								(function () {
									if (this.getCellDataItem() !== view.category) {
										this.category.animate({
											color: baseFontColor,
											fontFamily: 'InterstatePro-ExtraLight',
											duration: 0.2
										});
									}
								}).delay(100, cell);
							}
						}
					});

				cell.category = new MAF.element.Text({
					styles: {
						color: baseFontColor,
						width: 'inherit',
						height: 'inherit',
						fontFamily: 'InterstatePro-ExtraLight',
						fontSize: '1.5em',
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

		this.controls.categories.setDisabled(true);

		var cellSize = 215,
			cellRows = 2,
			cellColumns = 6;

		var scroll = new MAF.control.ScrollIndicator({
			focus: false,
			styles: {
				height: (cellSize * cellRows) - 42,
				hAlign: 'right',
				vAlign: 'bottom',
				hOffset: 134,
				vOffset: this.controls.categories.vOffset + 10
			}
		}).appendTo(this);

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
									grid.changeDataset(view.getFavoritesCategory(), true);
								} else if (view.state === null) {
									view.state = id;
									if (view.getFavorites().length === 0) {
										view.controls.categories.focus();
										view.controls.categories.focusCell(view.firstCategory);
										grid.focus();
									} else {
										grid.changeDataset(view.getFavoritesCategory(), true);
									}
								}
							} else if (id === 'reorderfavo') {
								if (view.state === id) {
									view.state = null;
									delete view.reodered;
									delete view.reorder;
									delete view.cell;
									delete view.icon;
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
										var isFavorite = view.getFavorites().indexOf(id) !== -1;
										view.elements.appTitle.setText($_(isFavorite ? 'REMOVEFAVO_APP' : 'ADDFAVO_APP', [ApplicationManager.getMetadataByKey(id, 'name')]));
										view.elements.appDescription.setText($_(isFavorite ? 'CONFIRM_REMOVEFAVO' : 'CONFIRM_ADDFAVO'));
										break;
									case 'reorderfavo':
										if (!view.reorder) {
											view.reorder = id;
											view.cell = this;
											view.icon = this.icon.source;
											view.controls.categories.setDisabled(true);
											view.elements.appDescription.setText($_('STOP_REORDERFAVO'));
											this.setStyle('backgroundImage', 'Images/IconMove.png');
										} else if (view.reodered !== undefined) {
											view.reorderFavorite(view.reorder, view.reodered);
											delete view.reodered;
											delete view.reorder;
											delete view.cell;
											delete view.icon;
											view.controls.categories.setDisabled(false);
											view.elements.appDescription.setText($_('START_REORDERFAVO'));
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
								origin = [],
								isFavorite = view.getFavorites().indexOf(id) !== -1;
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
							this.setStyle('transformOrigin', origin.join(' '));
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
								if (view.state === 'addfavo') {
									view.elements.appTitle.setText($_(isFavorite ? 'REMOVEFAVO_APP' : 'ADDFAVO_APP', [ApplicationManager.getMetadataByKey(id, 'name')]));
									view.elements.appDescription.setText($_(isFavorite ? 'CONFIRM_REMOVEFAVO' : 'CONFIRM_ADDFAVO'));
								} else if (view.state === 'reorderfavo') {
									if (!view.reorder) {
										view.elements.appTitle.setText($_('REORDERFAVO_APP', [ApplicationManager.getMetadataByKey(id, 'name')]));
										view.elements.appDescription.setText($_('START_REORDERFAVO'));
									} else {
										view.elements.appTitle.setText($_('REORDERFAVO_APP', [ApplicationManager.getMetadataByKey(view.reorder, 'name')]));
										view.elements.appDescription.setText($_('STOP_REORDERFAVO'));
									}
								} else {
									view.elements.appTitle.setText(ApplicationManager.getMetadataByKey(id, 'name') + ' ' + (isFavorite ? FontAwesome.get(['star', 'half', 'middle']) : ''));
									view.elements.appDescription.setText(ApplicationManager.getMetadataByKey(id, 'description'));
								}
							}
							if (view.reorder && view.cell && this.retrieve('favbutton') !== true) {
								var currentIcon = this.icon.source;
								view.reodered = this.getCellDataIndex();
								this.setStyle('backgroundImage', 'Images/IconMove.png');
								if (view.cell === this) {
									this.icon.setSource(view.icon);
								} else if (view.cell) {
									this.original = currentIcon;
									this.icon.setSource(view.icon);
									if (view.cell.icon) {
										view.cell.setStyle('backgroundImage', null);
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
							if (view.reorder) {
								this.setStyle('backgroundImage', null);
							}
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
					cell.icon.setSource(ApplicationManager.getIcon(id) || '');
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
				width: (cellSize - 7) * cellColumns,
				height: cellSize * cellRows,
				hOffset: this.controls.categories.outerWidth,
				vAlign: 'bottom',
				vOffset: this.controls.categories.vOffset - 10
			},
			events: {
				onPageChanged: function () {
					this.owner.updateCategory();
				},
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

		this.controls.apps.setDisabled(true);

		scroll.attachToSource(this.controls.apps);

		this.elements.appTitle = new MAF.element.Text({
			styles: {
				hOffset: this.controls.apps.hOffset + 20,
				vOffset: (this.height + 25) - this.controls.categories.vOffset,
				fontFamily: 'UPCDigital-Bold',
				fontSize: '2em'
			}
		}).appendTo(this);

		this.elements.appDescription = new MAF.element.Text({
			visibleLines: 3,
			styles: {
				width: this.width - this.elements.appTitle.hOffset - 140,
				hOffset: this.elements.appTitle.hOffset,
				vOffset: this.elements.appTitle.outerHeight + 25,
				fontFamily: 'UPCDigital-Regular',
				wrap: true,
				truncation: 'end'
			}
		}).appendTo(this);
	},

	updateCategory: function () {
		if (this.category) {
			Horizon.setText($_('CATEGORY_' + this.category.toUpperCase()) + ' ' + (this.controls.apps.getCurrentPage() + 1) + '/' + (this.controls.apps.getPageCount() || 1));
		}
	},

	hideView: function () {
		if (this.tos) {
			this.tos.hide();
		}
	},

	selectView: function () {
		this.disableResetFocus = false;
		if (MAF.messages.exists('myApps') && !this.ready) {
			this.appsReady();
		} else if (currentAppConfig.get('tos') !== TOS) {
			this.showTOSDialog();
		}
		if (this.ready) {
			this.updateCategory();
		}
	},

	destroyView: function () {
		this.onActivateBackButton.unsubscribeFrom(MAF.application, 'onActivateBackButton');
		delete this.onWidgetKeyPress;
		delete this.reodered;
		delete this.reorder;
		delete this.cell;
		delete this.icon;
		delete this.category;
	}
});
