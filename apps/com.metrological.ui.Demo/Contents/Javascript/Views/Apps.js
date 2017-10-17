var AppsView = new MAF.Class({
	ClassName: 'AppsView',

	Extends: MAF.system.FullscreenView,

	config: {
		loadingOverlay: false
	},

	state: null,
	firstCategory: 1,
	delayCatagoryLoading: 800,
	delayedInitialFocus: 300,
	disableResetFocus: true,
	maxRecently: 13,
	maxFavorites: 22,

	initialize: function () {
		var view = this;
		view.parent();
		view.setStyle('backgroundColor', 'rgba(0,0,0,.8)');
		MAF.mediaplayer.init();
		view.registerMessageCenterListenerCallback(view.dataHasChanged);
		view.onActivateBackButton = view.handleFavoriteBack.subscribeTo(MAF.application, 'onActivateBackButton', view);
		view.onChannelChange = view.updateNowPlaying.subscribeTo(MAF.mediaplayer, 'onChannelChange', view);
	},

	dataHasChanged: function (event) {
		if (event.payload.value && event.payload.key === 'myApps') {
			var view = this,
				elements = view.elements,
				controls = view.controls;
			if (!view.ready) return view.appsReady();
			elements.categories.eliminate('active');
			elements.categories.changeDataset(ApplicationManager.getCategories(), true);
			if (view.category !== 'favorites') controls.apps.changeDataset(ApplicationManager.getApplicationsByCategory(view.category), true);
		}
	},

	handleFavoriteBack: function (event) {
		var view = this;
		if (view.state !== null) {
			var data;
			view.state = null;
			if (view.category === 'favorites') {
				delete view.reodered;
				delete view.reorder;
				delete view.cell;
				delete view.icon;
				data = view.getFavoritesCategory();
			} else {
				data = ApplicationManager.getApplicationsByCategory(view.category);
			}
			view.controls.apps.changeDataset(data, true);
			event.stopPropagation();
			event.preventDefault();
		} else if (!view.frozen) {
			ApplicationManager.exit();
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
		var view = this,
			favorites = view.getFavorites();
		if (favorites.indexOf(id) === -1) {
			favorites.push(id);
			view.setFavorites(favorites);
		}
		return favorites;
	},

	removeFavorite: function (id) {
		var view = this,
			favorites = view.getFavorites(),
			i = view.getFavoriteIndex(id);
		if (i !== -1) {
			favorites.splice(i, 1);
			view.setFavorites(favorites);
		}
		return favorites;
	},

	reorderFavorite: function (id, idx) {
		var view = this,
			favorites = view.getFavorites(),
			i = view.getFavoriteIndex(id);
		if (i !== -1 && idx < favorites.length) {
			favorites.splice(i, 1);
			favorites.splice(idx, 0, id);
			view.setFavorites(favorites);
		}
		return favorites;
	},

	getFavoritesCategory: function () {
		var view = this;
		switch (view.state) {
			case 'addfavo':
			case 'reorderfavo':
				return view.getFavorites().concat([view.state]);
			default:
				var favo = view.getFavorites().concat(['addfavo']);
				if (favo.length > 2) return favo.concat(['reorderfavo']);
				return favo;
		}
	},

	getRecentlyCategory: function () {
		return currentAppConfig.get('recentlyApps') && currentAppConfig.get('recentlyApps').filter(function (id) {
			return ApplicationManager.exists(id);
		}).reverse() || [];
	},

	getFeaturedCategory: function () {
		return ApplicationManager.getFeatured();
	},

	getFavoriteIndex: function (id) {
		return this.getFavorites().indexOf(id);
	},

	appsReady: function () {
		var view = this;
		if (view.ready !== true) {
			view.ready = true;
			var categories = view.elements.categories,
				apps = view.controls.apps;
			categories.setDisabled(false);
			apps.setDisabled(false);
			categories.focus();
		}
	},

	updateNowPlaying: function () {
		var view = this,
			asset = MAF.mediaplayer.currentAsset,
			title = asset && asset.title,
			now = '';
		if (title) {
			now += $_('NOW_PLAYING') + ' ';
			if (MAF.mediaplayer.isTVActive) {
				now += $_('LIVE_TV');
			} else {
				now += $_('APPS');
			}
			now += ' - ' + title;
		}
		view.elements.playing.setText(now);
	},

	createView: function () {
		var view = this,
			elements = view.elements,
			controls = view.controls;

		var title = new MAF.element.Text({
			label: $_('APP_STORE'),
			styles: {
				hOffset: 134,
				vOffset: 47,
				color: 'rgba(255,255,255,.4)',
				fontFamily: 'InterstatePro-Light',
				fontSize: '1em'
			}
		}).appendTo(view);

		elements.subtitle = new MAF.element.Text({
			label: $_('ALL APPS'),
			styles: {
				transform: 'translateZ(0)',
				hOffset: title.hOffset,
				vOffset: title.height + title.vOffset,
				fontFamily: 'InterstatePro-Light',
				fontSize: '1em'
			}
		}).appendTo(view);

		var clock = new MAF.element.Text({
			label: Date.format(new Date(), 'HH:mm') + '<br/>' + Date.format(new Date(), 'ddd D MMM').toUpperCase(),
			styles: {
				transform: 'translateZ(0)',
				hAlign: 'right',
				hOffset: 134,
				vOffset: title.vOffset,
				color: 'rgba(255,255,255,.4)',
				fontFamily: 'InterstatePro-Light',
				fontSize: '1em',
				textAlign: 'right'
			}
		}).appendTo(view);

		(function updateClock() {
			clock.data = Date.format(new Date(), 'HH:mm') + '<br/>' + Date.format(new Date(), 'ddd D MMM').toUpperCase();
		}).periodical(60000);

		elements.playing = new MAF.element.Text({
			styles: {
				transform: 'translateZ(0)',
				width: 800,
				height: 40,
				hOffset: 560,
				vOffset: 47,
				fontFamily: 'InterstatePro-Light',
				fontSize: '1em',
				color: 'rgba(255,255,255,.4)',
				anchorStyle: 'center',
				truncation: 'end'
			}
		}).appendTo(view);

		elements.categories = new MAF.element.Grid({
			rows: 9,
			columns: 1,
			carousel: true,
			orientation: 'vertical',
			manageWaitIndicator: false,
			dataset: ApplicationManager.getCategories(),
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: Object.merge(this.getCellDimensions(), {
						transform: 'scale(1.0)',
						transformOrigin: '0% 50%',
						transition: 'all 0.2s ease'
					}),
					events: {
						onFocus: function () {
							var category = this.getCellDataItem(),
								grid = this.grid,
								apps = controls.apps,
								direction = apps.retrieve('navigating'),
								active = grid.retrieve('active');
							if (this.category.element.textWidth > this.category.width)
								this.category.scrolling = true;
							if (!direction) this.setStyle('transform', 'scale(1.2)');
							this.category.setStyle('fontFamily', 'InterstatePro-Bold');
							if (active && active !== this.category)
								active.setStyle('fontFamily', 'InterstatePro-ExtraLight');
							grid.store('active', this.category);
							if (view.category !== category) {
								var first = view.category === undefined,
									forceFocus = false;
								if (first && view.getFavorites().length === 0) {
									view.category = category;
									view.first = true;
									return grid.focusCell.defer(0, grid, [view.firstCategory]);
								} else if (first) {
									forceFocus = true;
								}
								view.category = category;
								elements.subtitle.setText('');
								apps.body.freeze();
								if (view.categoryTimer) {
									clearTimeout(view.categoryTimer);
									delete view.categoryTimer;
								}
								view.categoryTimer = (function () {
									if (!view.categoryTimer) return;
									delete view.categoryTimer;
									if (view.category !== category) return;
									var data;
									switch (category) {
										case 'favorites':
											data = view.getFavoritesCategory();
											break;
										case 'featured':
											data = view.getFeaturedCategory();
											break;
										case 'recently':
											data = view.getRecentlyCategory();
											break;
										default:
											data = ApplicationManager.getApplicationsByCategory(category);
											break;
									}
									apps.changeDataset(data || [], true);
									if (direction) {
										var idx = 0,
											columns = apps.config.columns,
											rows = apps.config.rows;
										switch (direction) {
											case 'up':
												var page = Math.ceil(data.length / (columns * rows)) - 1;
												if (page > 0) apps.changePage(page);
												var currentFocusIndex = apps.getFocusIndex() || 0;
												if (columns < apps.getVisibleCellCount()) currentFocusIndex += columns;
												idx = Math.min(data.length, currentFocusIndex);
												break;
											case 'down':
												var currentCoordinates = apps.getFocusCoordinates() || { column: 0 };
												idx = Math.min(data.length, currentCoordinates.column);
												break;
											default:
												return apps.eliminate('navigating');
										}
										apps.focus();
										apps.focusCell(idx);
										apps.eliminate('navigating');
									} else if (forceFocus) {
										apps.focus();
									}
								}).delay(direction ? 0 : view.delayCatagoryLoading);
							}
						},
						onBlur: function () {
							this.category.scrolling = false;
							this.setStyle('transform', 'scale(1)');
							if (this.grid.retrieve('active') !== this.category)
								this.category.setStyle('fontFamily', 'InterstatePro-ExtraLight');
						}
					}
				});

				cell.category = new MAF.element.Text({
					styles: {
						transform: 'translateZ(0)',
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
				if (view.category === data) {
					cell.category.setStyle('fontFamily', 'InterstatePro-Bold');
					cell.grid.store('active', cell.category);
				}
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
						var apps = controls.apps;
						apps.focus();
						apps.focusCell(direction === 'left' ? Math.min(apps.cells.length, apps.config.columns - 1) : 0);
						event.preventDefault();
					}
				}
			}
		}).appendTo(view).setDisabled(true);

		var cellSize = 215,
			cellRows = 2,
			cellColumns = 6;

		var scroll = new MAF.control.ScrollIndicator({
			focus: false,
			styles: {
				width: 14,
				height: (cellSize * cellRows) - 42,
				hAlign: 'right',
				vAlign: 'bottom',
				hOffset: 134,
				vOffset: elements.categories.vOffset + 10,
				visible: false
			}
		}).appendTo(view);

		controls.apps = new MAF.element.Grid({
			guid: 'apps',
			rows: cellRows,
			columns: cellColumns,
			//carousel: true,
			manageWaitIndicator: false,
			orientation: 'vertical',
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: Object.merge(this.getCellDimensions(), {
						transform: 'scale(1)',
						transformOrigin: '0 0',
						transition: 'all 0.2s ease',
						backgroundRepeat: 'no-repeat',
						zOrder: 1
					}),
					events: {
						onSelect: function () {
							var id = cell.getCellDataItem(),
								grid = cell.grid;
							if (id === 'addfavo') {
								if (view.state === id) {
									view.state = null;
									grid.changeDataset(view.getFavoritesCategory(), true);
								} else if (view.state === null) {
									view.state = id;
									if (view.getFavorites().length === 0) {
										elements.categories.focus();
										elements.categories.focusCell(view.firstCategory);
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
										if ((i === -1) && (view.getFavorites().length < view.maxFavorites)) {
											view.addFavorite(id);
											cell.overlay.setSource('Images/RemoveFavoIcon.png');
										} else {
											view.removeFavorite(id);
											cell.overlay.setSource('Images/AddFavoIcon.png');
										}
										var isFavorite = view.getFavorites().indexOf(id) !== -1;
										elements.appTitle.setText($_(isFavorite ? 'REMOVEFAVO_APP' : 'ADDFAVO_APP', [ApplicationManager.getMetadataByKey(id, 'name')]));
										elements.appDescription.setText($_(isFavorite ? 'CONFIRM_REMOVEFAVO' : 'CONFIRM_ADDFAVO'));
										break;
									case 'reorderfavo':
										if (!view.reorder) {
											view.reorder = id;
											view.cell = cell;
											view.icon = cell.icon.source;
											elements.categories.setDisabled(true);
											elements.appDescription.setText($_('STOP_REORDERFAVO'));
											cell.setStyle('backgroundImage', 'Images/IconMove.png');
										} else if (view.reodered !== undefined) {
											view.reorderFavorite(view.reorder, view.reodered);
											delete view.reodered;
											delete view.reorder;
											delete view.cell;
											delete view.icon;
											elements.categories.setDisabled(false);
											elements.appDescription.setText($_('START_REORDERFAVO'));
											grid.changeDataset(view.getFavoritesCategory(), true);
										}
										break;
								}
							} else {
								var recently = currentAppConfig.get('recentlyApps') || [],
									curId = recently.indexOf(id);
								if (curId !== -1) recently.splice(curId, 1);
								recently.push(id);
								if (recently.length === view.maxRecently) recently.shift();
								currentAppConfig.set('recentlyApps', recently);
								ApplicationManager.load(id);
								ApplicationManager.open(id);
								elements.subtitle.setText('');
							}
						},
						onFocus: function () {
							var id = cell.getCellDataItem(),
								isFavorite = view.getFavorites().indexOf(id) !== -1;
							cell.focus.element.opacity = 1;
							cell.setStyles({
								transform: 'scale(1.25)',
								zOrder: 2
							});
							if (id === 'addfavo') {
								elements.appTitle.setText($_('ADDFAVO'));
								elements.appDescription.setText($_(view.state === id ? 'ADDFAVO_SELECTED' : 'ADDFAVO_DESC'));
							} else if (id === 'reorderfavo') {
								elements.appTitle.setText($_('REORDERFAVO'));
								elements.appDescription.setText($_(view.state === id ? 'REORDERFAVO_SELECTED' : 'REORDERFAVO_DESC'));
							} else if (view.state === 'addfavo') {
								elements.appTitle.setText($_(isFavorite ? 'REMOVEFAVO_APP' : 'ADDFAVO_APP', [ApplicationManager.getMetadataByKey(id, 'name')]));
								elements.appDescription.setText($_(isFavorite ? 'CONFIRM_REMOVEFAVO' : 'CONFIRM_ADDFAVO'));
							} else if (view.state === 'reorderfavo') {
								elements.appTitle.setText($_('REORDERFAVO_APP', [ApplicationManager.getMetadataByKey(view.reorder || id, 'name')]));
								elements.appDescription.setText($_(!view.reorder ? 'START_REORDERFAVO' : 'STOP_REORDERFAVO'));
							} else {
								elements.appTitle.setText(ApplicationManager.getMetadataByKey(id, 'name') + ' ' + (isFavorite ? FontAwesome.get(['star', 'half', 'middle']) : ''));
								var desc = ApplicationManager.getMetadataByKey(id, 'description') || '';
								elements.appDescription.setText(desc + (desc.length === 0 || (desc[desc.length - 1] === '.' || desc[desc.length - 1] === '!' || desc[desc.length - 1] === '?') ? '' : '.'));
								elements.appVersion.setText(widget.getSetting('showAppVersion') ? ApplicationManager.getMetadataByKey(id, 'version') || '' : '');
							}
							if (view.reorder && view.cell && cell.retrieve('favbutton') !== true) {
								var currentIcon = cell.icon.source;
								view.reodered = cell.getCellDataIndex();
								cell.setStyle('backgroundImage', 'Images/IconMove.png');
								if (view.cell === cell) {
									cell.icon.setSource(view.icon);
								} else if (view.cell) {
									if (view.cell.original) {
										view.cell.icon.setSource(view.cell.original);
										delete view.cell.original;
									}
									cell.original = currentIcon;
									cell.icon.setSource(view.icon);
									if (view.cell.icon) {
										view.cell.setStyle('backgroundImage', null);
										view.cell.icon.setSource(currentIcon);
									}
								}
							}
						},
						onBlur: function () {
							cell.focus.element.opacity = 0;
							cell.setStyles({
								transform: 'scale(1)',
								zOrder: 1
							});
							elements.appTitle.setText('');
							elements.appDescription.setText('');
							elements.appVersion.setText('');
							if (view.reorder) cell.setStyle('backgroundImage', null);
							if (view.reorder && view.cell && cell.original && cell.retrieve('favbutton') !== true)
								view.cell = cell;
						}
					}
				});

				cell.focus = new MAF.element.Image({
					src: 'Images/IconFocus.png',
					styles: {
						opacity: 0,
						width: 192,
						height: 192,
						hOffset: (cell.width - 192) / 2,
						vOffset: (cell.height - 192) / 2,
						transform: 'translateZ(0)',
						transition: 'opacity 0.2s ease'
					}
				}).appendTo(cell);

				cell.icon = new MAF.element.Image({
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
				var coords = cell.getCellCoordinates(),
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
				cell.setStyle('transformOrigin', origin.join(' '));
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
				hOffset: elements.categories.outerWidth,
				vAlign: 'bottom',
				vOffset: elements.categories.vOffset - 10
			},
			events: {
				onBlur: function () {
					scroll.visible = false;
				},
				onFocus: function () {
					scroll.visible = (this.getPageCount() > 1);
				},
				onPageChanged: function () {
					if (view.first) {
						delete view.first;
						this.focus();
					}
					view.updateCategory();
				},
				onNavigateOutOfBounds: function (event) {
					var cats = elements.categories,
						direction = event.payload.direction;
					if (view.state !== 'reorderfavo' && (direction === 'right' || direction === 'left')) {
						cats.setDisabled(false);
						cats.focus();
						event.preventDefault();
					} else {
						var categories = ApplicationManager.getCategories(),
							max = categories.length - 1,
							page = this.getCurrentPage() || 0,
							lastpage = Math.max(0, this.getPageCount() - 1),
							idx = categories.indexOf(view.category),
							catsCurrentPage = cats.getCurrentPage(),
							catsRows = cats.config.rows,
							catsPage;
						if (direction === 'down') {
							if (page !== lastpage) return;
							catsPage = Math.floor((idx+1)/catsRows);
							if (idx === (categories.length -1)) catsPage = 0;
							if (catsPage !== catsCurrentPage) cats.changePage(catsPage);
							idx = (idx === max) ? 0 : idx + 1;
						} else if (direction === 'up') {
							if (page !== 0) return;
							catsPage = Math.floor((idx-1)/catsRows);
							if (catsPage !== catsCurrentPage) cats.changePage(catsPage);
							idx = (idx === 0) ? max : idx - 1;
						}
						if (view.state === 'reorderfavo') return event.preventDefault();
						this.store('navigating', direction);
						cats.focus();
						cats.focusCell(idx);
						event.preventDefault();
					}
				}
			}
		}).appendTo(view).setDisabled(true);

		scroll.attachToSource(controls.apps);

		elements.appTitle = new MAF.element.Text({
			styles: {
				transform: 'translateZ(0)',
				hOffset: controls.apps.hOffset + 20,
				vOffset: (view.height + 25) - elements.categories.vOffset,
				fontFamily: 'InterstatePro-Regular',
				fontSize: '2em'
			}
		}).appendTo(view);

		elements.appDescription = new MAF.element.Text({
			visibleLines: 3,
			styles: {
				transform: 'translateZ(0)',
				width: view.width - elements.appTitle.hOffset - 140,
				hOffset: elements.appTitle.hOffset,
				vOffset: elements.appTitle.outerHeight + 25,
				fontSize: '1.15em',
				fontFamily: 'InterstatePro-Light',
				wrap: true
			}
		}).appendTo(view);

    elements.appVersion = new MAF.element.Text({
      styles: {
        transform: 'translateZ(0)',
        width: view.width - elements.appTitle.hOffset - 140,
        hOffset: elements.appTitle.hOffset,
        vOffset: elements.appDescription.outerHeight + 25,
        fontSize: '0.85em',
        fontFamily: 'InterstatePro-Light',
        wrap: true
      }
    }).appendTo(view);
	},

	updateView: function () {
		var elements = this.elements;
		elements.appTitle.setText('');
		elements.appDescription.setText('');
    elements.appVersion.setText('');
	},

	updateCategory: function () {
		var view = this,
			apps = view.controls.apps;
		if (view.category) {
			view.elements.subtitle.setText($_('CATEGORY_' + view.category.toUpperCase()) + ' ' + (apps.getCurrentPage() + 1) + '/' + (apps.getPageCount() || 1));
			ApplicationManager.setCategory(view.category);
		}
	},

	selectView: function () {
		var view = this;
		view.hasbeenfocused = true;
		if (MAF.messages.exists('myApps') && !view.ready) {
			return view.appsReady();
		} else if (view.ready && !view.category) {
			view.updateCategory();
			(function () {
				if (!document.activeElement) this.focus();
			}).delay(view.delayedInitialFocus, view.elements.categories);
		}
	},

	destroyView: function () {
		var view = this;
		view.onActivateBackButton.unsubscribeFrom(MAF.application, 'onActivateBackButton');
		view.onChannelChange.unsubscribeFrom(MAF.mediaplayer, 'onChannelChange');
		delete view.onActivateBackButton;
		delete view.onChannelChange;
		delete view.reodered;
		delete view.reorder;
		delete view.cell;
		delete view.icon;
		delete view.category;
	}
});
