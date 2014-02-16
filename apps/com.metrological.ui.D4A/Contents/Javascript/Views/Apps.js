var AppsView = new MAF.Class({
	ClassName: 'AppsView',

	Extends: MAF.system.FullscreenView,

	state: null,
	firstCategory: 1,
	disableResetFocus: true,
	oldFocus: 'categories',

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
			event.stop();
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
				view.tos = new MAF.element.Container({
					styles: {
						backgroundColor: 'rgba(0,0,0,.5)',
						width: view.width,
						height: view.height
					},
					content: [
						new MAF.element.Container({
							styles: {
								backgroundImage: widget.getPath('Images/DialogBack.png'),
								width: 1540,
								height: 751,
								hOffset: (view.width - 1540) / 2,
								vOffset: 256,
								border: '5px solid #a0eaff',
								borderRadius: '15px',
								zOrder: Animator.ZORDER + 2
							}
						})
					]
				}).appendTo(view);

				new MAF.element.Text({
					label: $_('TERMS'),
					styles: {
						width: view.tos.content[0].width - 135,
						hOffset: 45,
						vOffset: 38,
						fontFamily: 'UPCDigital-Bold',
						fontSize: '2em'
					}
				}).appendTo(view.tos.content[0]);

				var grid = new MAF.element.TextGrid({
					visibleLines: 10,
					label: tos,
					styles: {
						fontFamily: 'UPCDigital-Regular',
						opacity: 0.7,
						width: view.tos.content[0].width - 135,
						hOffset: 45,
						vOffset: 135,
						fontSize: '1.5em',
						color: 'white',
						wrap: true
					}
				}).appendTo(view.tos.content[0]);

				view.tosscroll = new MAF.control.ScrollIndicator({
					theme: false,
					styles: {
						backgroundColor: 'rgba(255,255,255,.2)',
						height: grid.height,
						width: 30,
						hOffset: grid.outerWidth + 20,
						vOffset: 130
					},
					events:{
						onNavigate: function(event){
							event.stop();
						}
					}
				}).appendTo(view.tos.content[0]).attachToSource(grid);

				new MAF.element.Text({
					label: FontAwesome.get('caret-up'),
					styles: {
						opacity: grid.getPageCount() === 1 ? 0.1 : 1,
						hOffset: view.tosscroll.hOffset,
						vOffset: view.tosscroll.vOffset - 40,
						fontFamily: 'UPCDigital-Bold',
						fontSize: '2em'
					}
				}).appendTo(view.tos.content[0]);

				new MAF.element.Text({
					label: FontAwesome.get('caret-down'),
					styles: {
						opacity: grid.getPageCount() === 1 ? 0.1 : 1,
						hOffset: view.tosscroll.hOffset,
						vOffset: view.tosscroll.outerHeight - 10,
						fontFamily: 'UPCDigital-Bold',
						fontSize: '2em'
					}
				}).appendTo(view.tos.content[0]);

				new MAF.element.Text({
					label: $_('EXITTOS'),
					styles: {
						width: view.tos.content[0].width - 135,
						hOffset: 45,
						vOffset: view.tos.content[0].height - 90,
						fontFamily: 'UPCDigital-Bold',
						fontSize: '1.5em'
					}
				}).appendTo(view.tos.content[0]);

				view.tosscroll.focus();
			}
		} else {
			view.tos.visible = true;
			view.tosscroll.focus();
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
			categories.focus();
		}
	},

	handleKeys: function (event) {
		if (!this.frozen) {
			switch(event.payload.key){
				case 'blue':
					this.showTOSDialog();
					break;
				case 'back':
					if (this.tos && this.tos.visible){
						this.tos.visible = false;
						delete this.tos;
						currentAppConfig.set('tos', TOS);
						if (this.oldFocus === 'categories')
							this.controls.categories.focus();
						else
							this.controls.apps.focus();
						event.stop();
					}
					break;
				default:
					break;
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
							backgroundRepeat: 'no-repeat',
							transform: 'translateZ(0)',
							transformOrigin: '0% 50%'
						}),
						events: {
							onFocus: function () {
								var category = this.getCellDataItem(),
									grid = this.grid,
									view = grid.owner,
									data;
								view.oldFocus = 'categories';
								if (category === 'favorites') {
									data = view.getFavoritesCategory();
								} else {
									data = ApplicationManager.getApplicationsByCategory(category);
								}
								this.setStyle('transformOrigin', '0% 50%');
								this.animate({
									backgroundImage: 'Images/CategoryFocus.png',
									duration: 0.2
								});
								this.category.animate({
									//scale: 1.1,
									fontFamily: 'UPCDigital-Bold',
									color: '#223b6d',
									duration: 0.2
								});
								if (view.category !== category) {
									var first = view.category === undefined;
									if (first && view.getFavorites().length === 0 && !view.first) {
										view.first = true;
										grid.focusCell.defer(100, grid, [view.firstCategory]);
										grid.cells[view.firstCategory].setStyle.defer(210, grid.cells[view.firstCategory], ['backgroundImage', 'Images/CategorySelected.png']);
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
							onBlur: function (event) {
								var cell = this,
									grid = cell.grid,
									view = grid.owner;
									this.animate({
										backgroundImage: null,
										duration: 0.2
									});	
									(function () {
									if (this.getCellDataItem() !== view.category) {
										this.category.animate({
											color: 'white',
											fontFamily: 'UPCDigital-Regular',
											duration: 0.2
										});
									}
								}).delay(100, cell);
							}
						}
					});

				cell.category = new MAF.element.Text({
					styles: {
						fontFamily: 'UPCDigital-Regular',
						color: 'white',
						hOffset: 24,
						width: cell.width - 10,
						height: cell.height,
						fontSize: '1.4em',
						anchorStyle: 'leftCenter',
						truncation: 'end'
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function (cell, data) {
				cell.category.setText($_('CATEGORY_' + data.toUpperCase()));
			},
			styles: {
				transform: 'translateZ(0)',
				width: 343,
				height: 510,
				hOffset: 110,
				vAlign: 'bottom',
				vOffset: 290
			},
			events: {
				onNavigateOutOfBounds: function (event) {
					var direction = event.payload.direction;
					if (direction === 'right' || direction === 'left') {
						var apps = this.owner.controls.apps;
						apps.focus();
						apps.focusCell(direction === 'left' ? Math.min(apps.cells.length, apps.config.columns - 1) : 0);
						this.cells[this.getFocusIndex()].setStyle.defer(10, this.cells[this.getFocusIndex()], ['backgroundImage', 'Images/CategorySelected.png']);
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
			theme: false,
			styles: {
				backgroundColor: 'rgba(255,255,255,.2)',
				width: 30,
				height: (cellSize * cellRows) - 31,
				hAlign: 'right',
				hOffset: 100,
				vOffset: this.controls.categories.vOffset + 4
			}
		}).appendTo(this);
		scroll.content.setStyles({ backgroundImage: 'Images/ScrollBar.jpg', backgroundSize: '100% 100%', border: '2px solid #c0ddeb' });

		var arrowUp = new MAF.element.Text({
			label: FontAwesome.get('caret-up'),
			styles: {
				hAlign: 'right',
				hOffset: scroll.hOffset,
				vOffset: scroll.vOffset - 40,
				fontFamily: 'UPCDigital-Bold',
				fontSize: '2em'
			}
		}).appendTo(this);

		var arrowDown = new MAF.element.Text({
			label: FontAwesome.get('caret-down'),
			styles: {
				hAlign: 'right',
				hOffset: scroll.hOffset,
				vOffset: scroll.outerHeight - 10,
				fontFamily: 'UPCDigital-Bold',
				fontSize: '2em'
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
						transform: 'translateZ(0)',
						backgroundRepeat: 'no-repeat',
						backgroundPosition: '5'
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
							}
						},
						onFocus: function () {
							var id = this.getCellDataItem(),
								coords = this.getCellCoordinates(),
								view = this.grid.owner,
								origin = [],
								isFavorite = view.getFavorites().indexOf(id) !== -1;
							view.oldFocus = 'apps';
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
				width: ((cellSize - 7) * cellColumns) + 55,
				height: (cellSize * cellRows) + 50,
				hOffset: this.controls.categories.outerWidth + 24,
				vOffset: this.controls.categories.vOffset - 35
			},
			events: {
				onDatasetChanged: function () {
					if (this.getPageCount() === 1){
						arrowUp.setStyle('opacity', 0.1);
						arrowDown.setStyle('opacity', 0.1);
					} else {
						arrowUp.setStyle('opacity', 1);
						arrowDown.setStyle('opacity', 1);
					}
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
						view.controls.categories.cells[idx].setStyle.defer(20, view.controls.categories.cells[idx], ['backgroundImage', 'Images/CategorySelected.png']);
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
				hOffset: this.controls.apps.hOffset,
				vOffset: this.controls.apps.outerHeight + 25,
				fontFamily: 'UPCDigital-Bold',
				fontSize: '2.5em'
			}
		}).appendTo(this);

		this.elements.appDescription = new MAF.element.Text({
			visibleLines: 3,
			styles: {
				width: this.width - this.elements.appTitle.hOffset - 140,
				hOffset: this.elements.appTitle.hOffset,
				vOffset: this.elements.appTitle.outerHeight + 13,
				fontFamily: 'UPCDigital-Regular',
				fontSize: '1.4em',
				wrap: true,
				truncation: 'end'
			}
		}).appendTo(this);

		new MAF.element.Image({
			src: 'Images/BlueButton.png',
			styles: {
				width: 51,
				height: 51,
				hOffset: 1315,
				vOffset: this.controls.apps.outerHeight + 210
			}
		}).appendTo(this);

		new MAF.element.Text({
			label: $_('SHOW_TERMS'),
			styles: {
				width: this.width - 1400,
				hOffset: 1382,
				vOffset: this.controls.apps.outerHeight + 220,
				fontFamily: 'UPCDigital-Regular',
				fontSize: '1.55em'
			}
		}).appendTo(this);
	},

	updateView: function() {
		this.subcribedFunctionBack = this.handleKeys.subscribeTo(MAF.application, 'onWidgetKeyPress', this);
	},

	hideView: function () {
		if (this.tos) {
			this.tos.hide();
		}
		if (this.subcribedFunctionBack && this.subcribedFunctionBack.unsubscribeFrom(MAF.application, 'onWidgetKeyPress')) {
			delete this.subcribedFunctionBack;
		}
	},

	selectView: function () {
		if (MAF.messages.exists('myApps') && !this.ready) {
			this.appsReady();
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
		delete this.oldFocus;
	}
});
