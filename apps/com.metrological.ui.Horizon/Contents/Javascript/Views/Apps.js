var restoreFocus = function () {
	if (!document.activeElement || document.activeElement === document.body) this.focus();
};
var AppsView = new MAF.Class({
	ClassName: 'AppsView',

	Extends: MAF.system.FullscreenView,

	config: {
		loadingOverlay: false
	},

	state: null,
	firstCategory: 1,
	delayedInitialFocus: widget.getSetting('delayFocus') || 800,
	disableResetFocus: true,
	maxRecently: 13,
	maxFavorites: 22,
	isBoot: window.boot,

	initialize: function () {
		var view = this;
		view.parent();
		view.registerMessageCenterListenerCallback(view.dataHasChanged);
		view.onActivateBackButton = view.handleFavoriteBack.subscribeTo(MAF.application, 'onActivateBackButton', view);
		view.skipTOS = widget.getSetting('tos') === false || currentAppConfig.get('tos') === TOS;
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
		} else if (!view.frozen && !Browser.metrological) {
			ApplicationManager.exit();
		}
		event.stopPropagation();
		event.preventDefault();
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

	showTOS: function () {
		if (widget.getElementById('tos')) return;
		var view = this,
			apps = view.controls.apps,
			categories = view.elements.categories,
			tos;
		try {
			tos = filesystem.readFile('About/' + profile.locale + '/tos.txt', true);
		} catch(err) {}
		if (!tos) return categories.focus();
		var tosContainer = new MAF.element.Container({
			styles: {
				width: view.width,
				height: view.height,
				backgroundColor: 'rgba(0,0,0,.6)'
			}
		}).appendTo(view);

		var tosHeader = new MAF.element.Text({
			label: $_('TOS_HEADER'),
			styles: {
				fontSize: 42,
				fontFamily: 'UPCDigital-Bold',
				paddingTop: 4,
				borderTop: '2px solid rgba(255,255,255,.4)',
				borderBottom: '2px solid rgba(255,255,255,.4)',
				width: 1110,
				height: 133,
				hOffset: (view.width - 1110) / 2,
				vOffset: 200
			}
		}).appendTo(tosContainer);

		var tosBody = new MAF.element.TextGrid({
			label: tos,
			styles: {
				fontSize: 27,
				fontFamily: 'UPCDigital-Regular',
				wrap: true,
				width: tosHeader.width,
				hOffset: tosHeader.hOffset,
				vOffset: tosHeader.outerHeight + 11
			}
		}).appendTo(tosContainer);

		var tosAccept = new MAF.control.TextButton({
			id: 'tos',
			label: $_('AGREE').toUpperCase(),
			theme: false,
			styles: {
				fontFamily: 'InterstatePro-ExtraLight',
				borderTop: '6px solid white',
				fontSize: 60,
				width: tosBody.width,
				height: 90,
				hOffset: tosBody.hOffset,
				vOffset: (tosBody.textHeight > 252) ? tosBody.outerHeight + 25 : 590
			},
			textStyles: {
				hOffset: -10
			},
			events: {
				onSelect: function () {
					tosContainer.suicide();
					view.skipTOS = true;
					currentAppConfig.set('tos', TOS);
					categories.setDisabled(false);
					apps.setDisabled(false);
					if (view.data.startApp) {
						var id = view.data.startApp.id,
							params = view.data.startApp.params;
						ApplicationManager.load(id);
						ApplicationManager.open(id, params);
						delete view.data.startApp;
					} else {
						categories.focus();
					}
				},
				onFocus: function () {
					this.setStyle('fontFamily', 'InterstatePro-Bold');
				},
				onBlur: function () {
					this.setStyle('fontFamily', 'InterstatePro-ExtraLight');
				},
				onNavigate: function (event) {
					event.stop();
					if (event.payload.direction === 'down') tosCancel.focus();
				}
			}
		}).appendTo(tosContainer);

		var tosCancel = new MAF.control.TextButton({
			label: $_('CANCEL').toUpperCase(),
			theme: false,
			styles: {
				fontFamily: 'InterstatePro-ExtraLight',
				fontSize: 60,
				width: tosAccept.width,
				height: 75,
				hOffset: tosAccept.hOffset,
				vOffset: tosAccept.outerHeight + 2
			},
			textStyles: {
				hOffset: -10
			},
			events: {
				onSelect: function () {
					delete view.data;
					ApplicationManager.exit();
				},
				onFocus: function () {
					this.setStyle('fontFamily', 'InterstatePro-Bold');
				},
				onBlur: function () {
					this.setStyle('fontFamily', 'InterstatePro-ExtraLight');
				},
				onNavigate: function (event) {
					event.stop();
					if (event.payload.direction === 'up') tosAccept.focus();
				}
			}
		}).appendTo(tosContainer);

		tosAccept.focus.delay(view.delayedInitialFocus, tosAccept);
	},

	appsReady: function () {
		var view = this,
			elements = view.elements,
			controls = view.controls;
		if (view.ready !== true) {
			view.ready = true;
			if (view.skipTOS !== true) return;
			controls.apps.setDisabled(false);
			elements.categories.setDisabled(false).focus();
		}
		if (window.boot) ApplicationManager.exit(true);
	},

	createView: function () {
		var view = this,
			elements = view.elements,
			controls = view.controls,
			categories = ApplicationManager.getCategories();

		elements.categories = new MAF.element.Grid({
			rows: 9,
			columns: 1,
			carousel: true,
			orientation: 'vertical',
			manageWaitIndicator: false,
			dataset: categories,
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: Object.merge(this.getCellDimensions(), {
						transform: 'scale(1.0)',
						transformOrigin: '0% 50%',
						transition: 'all 0.2s ease'
					}),
					events: {
						onFocus: function () {
							var category = cell.getCellDataItem(),
								grid = cell.grid,
								apps = controls.apps,
								direction = apps.retrieve('navigating'),
								active = grid.retrieve('active');
							if (cell.category.element.textWidth > cell.category.width)
								cell.category.scrolling = true;
							if (!direction) cell.setStyle('transform', 'scale(1.2)');
							cell.category.setStyle('fontFamily', 'InterstatePro-Bold');
							if (active && active !== cell.category)
								active.setStyle('fontFamily', 'InterstatePro-ExtraLight');
							grid.store('active', cell.category);
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
								Horizon.setText('');
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
								}).delay(direction ? 0 : widget.getSetting('delayCategory') || 800);
							}
						},
						onBlur: function () {
							cell.category.scrolling = false;
							cell.setStyle('transform', 'scale(1)');
							if (cell.grid.retrieve('active') !== cell.category)
								cell.category.setStyle('fontFamily', 'InterstatePro-ExtraLight');
						}
					}
				});

				cell.category = new MAF.element.Text({
					styles: {
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
						onSelect: function (event) {
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
								Horizon.setText('');
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
							var id = cell.getCellDataItem();
							cell.focus.element.opacity = 0;
							cell.setStyles({
								transform: 'scale(1)',
								zOrder: 1
							});
							elements.appTitle.setText('');
							elements.appDescription.setText('');
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
				var view = cell.grid.owner,
					coords = cell.getCellCoordinates(),
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
//				transform: 'translateZ(0)',
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
				fontFamily: 'UPCDigital-Bold',
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
				fontFamily: 'UPCDigital-Regular',
				wrap: true/*,
				truncation: 'end'*/
			}
		}).appendTo(view);

		if (view.skipTOS !== true) view.showTOS();
	},

	updateView: function () {
		var view = this;
		if (view.isBoot) {
			Horizon.exit();
			view.isBoot = false;
		} else if (ApplicationManager.exited) {
			Horizon.resume();
		} else {
			Horizon.show();
		}
	},

	updateCategory: function () {
		var view = this,
			apps = view.controls.apps;
		if (view.category) {
			Horizon.setText($_('CATEGORY_' + view.category.toUpperCase()) + ' ' + (apps.getCurrentPage() + 1) + '/' + (apps.getPageCount() || 1));
			ApplicationManager.setCategory(view.category);
		}
	},

	selectView: function () {
		var view = this;
		view.hasbeenfocused = true;
		if (ApplicationManager.exited && !ApplicationManager.resuming) return;
		if (view.skipTOS !== true) {
			var tos = widget.getElementById('tos');
			if (tos) tos.focus();
		} else if (MAF.messages.exists('myApps') && !view.ready) {
			view.appsReady();
		} else if (view.ready && !view.category) {
			view.updateCategory();
			restoreFocus.delay(view.delayedInitialFocus, view.elements.categories);
		} else if (view.ready && view.category) {
			(function () {
				view.updateCategory();
				restoreFocus.call(view.controls.apps);
			}).delay(Horizon.isHidden() || ApplicationManager.exited ? view.delayedInitialFocus : 150);
		}
	},

	hideView: function () {
		var view = this,
			el = view.elements;
		el.appTitle.setText('');
		el.appDescription.setText('');
		if (ApplicationManager.exiting) {
			Horizon.exit();
		} else {
			Horizon.hide();
		}
		delete view.data;
	},

	destroyView: function () {
		var view = this;
		view.onActivateBackButton.unsubscribeFrom(MAF.application, 'onActivateBackButton');
		delete view.onActivateBackButton;
		delete view.skipTOS;
		delete view.reodered;
		delete view.reorder;
		delete view.cell;
		delete view.icon;
		delete view.category;
	}
});
