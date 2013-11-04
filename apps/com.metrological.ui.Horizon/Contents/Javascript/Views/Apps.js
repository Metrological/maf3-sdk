var AppsView = new MAF.Class({
	ClassName: 'AppsView',

	Extends: MAF.system.FullscreenView,
/*
	transition: {
		updateView: {
			scale: 1,
			timingFunction: 'linear',
			duration: 0.3
		},
		hideView: {
			scale: 0,
			timingFunction: 'linear',
			duration: 0.3
		}
	},
*/
	initialize: function () {
		this.parent();
		this.registerMessageCenterListenerCallback(this.dataHasChanged);
	},

	dataHasChanged: function (event) {
		if (event.payload.value && event.payload.key === 'myApps') {
			this.appsReady(event.payload.value);
		}
	},

	appsReady: function (data) {
		this.controls.apps.changeDataset(data || [], true);
		this.controls.apps.focus();
	},

	createView: function () {
		this.elements.categories = new MAF.element.Carousel({
			rows: 10,
			columns: 1,
			carousel: true,
			orientation: 'vertical',
			dataset: [
				'My Favorites',
				'TV & Video',
				'News & Info',
				'Social TV',
				'Games',
				'Sport',
				'Lifestyle'
			],
			cellCreator: function () {
				var baseFontColor = 'rgba(255,255,255,.6)',
					cell = new MAF.element.CarouselCell({
						styles: Object.merge(this.getCellDimensions(), {
							transform: 'translateZ(0)'
						}),
						events: {
							onSelect: function (event) {
							},
							onFocus: function () {
								this.category.animate({
									color: 'white',
									fontWeight: 'bold',
									duration: 0.2
								});
							},
							onBlur: function () {
								this.category.animate({
									color: baseFontColor,
									fontWeight: 'normal',
									duration: 0.2
								});
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
				cell.category.setText(data.toUpperCase());
			},
			styles: {
				transform: 'translateZ(0)',
				width: 376,
				height: 400,
				hOffset: 134,
				vAlign: 'bottom',
				vOffset: 300
			}
		}).appendTo(this);

		var cellSize = 215,
			cellRows = 2,
			cellColumns = 6;

		this.controls.apps = new MAF.element.Carousel({
			guid: 'apps',
			rows: cellRows,
			columns: cellColumns,
			carousel: true,
			orientation: 'vertical',
			cellCreator: function () {
				var cell = new MAF.element.CarouselCell({
					styles: Object.merge(this.getCellDimensions(), {
						transform: 'translateZ(0)'
					}),
					events: {
						onSelect: function (event) {
							var id = this.getCellDataItem();
							ApplicationManager.load(id);
							ApplicationManager.open(id);
						},
						onFocus: function () {
							var idx = this.getCellIndex(),
								carousel = this.carousel,
								view = carousel.owner,
								id = this.getCellDataItem(),
								origin = [];
							if (idx%cellColumns === 0) {
								origin.push('left');
							} else if ((idx+1)%cellColumns === 0) {
								origin.push('right');
							} else {
								origin.push('center');
							}
							//log(((idx/6)%cellColumns)%2, (carousel.body.scrollTop / cellSize));
							if (idx < cellColumns) {
								origin.push('top');
							} else if (idx >= cellColumns) {
								origin.push('bottom');
							} else {
								origin.push('center');
							}
							this.focusImg.visible = true;
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
							view.elements.appTitle.setText(ApplicationManager.getMetadataByKey(id, 'name'));
							view.elements.appDescription.setText(ApplicationManager.getMetadataByKey(id, 'description'));
						},
						onBlur: function () {
							var idx = this.getCellIndex(),
								view = this.carousel.owner,
								origin = [];
							if (idx%cellColumns === 0) {
								origin.push('left');
							} else if ((idx+1)%cellColumns === 0) {
								origin.push('right');
							} else {
								origin.push('center');
							}
							if (idx < cellColumns) {
								origin.push('top');
							} else if (idx >= cellColumns) {
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
						}
					}
				});

				cell.focusImg = new MAF.element.Image({
					src: 'Images/IconFocus.png',
					autoShow: false,
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

				return cell;
			},
			cellUpdater: function (cell, data) {
				cell.icon.setSource(ApplicationManager.getRootPath(data) + ApplicationManager.getMetadata(data).images.icon['192x192']);
			},
			styles: {
				transform: 'translateZ(0)',
				width: cellSize * cellColumns,
				height: cellSize * cellRows,
				hOffset: this.elements.categories.outerWidth,
				vAlign: 'bottom',
				vOffset: this.elements.categories.vOffset - 20
			},
			events: {
				onNavigate: function (event) {
					if (event.payload.direction === 'down') {
						this.body.scrollTop += cellSize;
					} else if (event.payload.direction === 'up') {
						this.body.scrollTop -= cellSize;
					}
				}
			}
		}).appendTo(this);

		this.elements.appTitle = new MAF.element.Text({
			styles: {
				hOffset: this.controls.apps.hOffset + 20,
				vOffset: (this.height + 25) - this.elements.categories.vOffset,
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

		var apps = MAF.messages.fetch('myApps');
		if (apps) {
			this.appsReady(apps);
		}
	}
});
