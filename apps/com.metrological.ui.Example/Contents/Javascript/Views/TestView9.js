var TestView9 = new MAF.Class({
	ClassName: 'TestView9',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
		this.parent();
		this.registerMessageCenterListenerCallback(this.dataHasChanged);
		this.clockTimerId = this.setClock.periodical(60000, this);
		MAF.mediaplayer.init();
		this.channelChange.subscribeTo(MAF.mediaplayer, 'onChannelChange', this);
		this.onActivateBackButton.subscribeTo(MAF.application, 'onActivateBackButton', this);
	},

	dataHasChanged: function (event) {
		if (event.payload.value && event.payload.key === 'myApps') {
			this.controls.myApps.changeDataset(event.payload.value, true);
			this.controls.myMenu.changeDataset([
				{ label: $_('Apps'), meta: $_('AppMeta') },
				{ label: $_('Channel'), meta: $_('ChannelMeta') },
				{ label: $_('Settings'), meta: $_('SettingsMeta') },
			]);
		}
	},

	channelChange: function () {
		this.controls.myEPG.changeDataset([MAF.mediaplayer.getCurrentProgram()]);
	},

	setClock: function() {
		this.elements.datetime.setText(Date.format(new Date(), 'dd MMM yyyy HH:mm'));
	},

	animteBar: function(fadeIn, fadeOut, barHeight, barOffset){
		fadeOut.animate({
			opacity: 0,
			duration: 0.2,
			events: {
				onAnimationEnded: function() {
					fadeOut.setStyle('visible', false);
				}
			}
		});
		this.elements.menuBackground.animate({
			height: barHeight,
			vOffset: barOffset,
			duration: 0.5
		});
		this.elements.menuTop.animate({
			vOffset: barOffset - 54,
			duration: 0.5
		});
		this.elements.menuBottom.animate({
			vOffset: barOffset + barHeight,
			duration: 0.5
		});
		fadeIn.animate({
			visible: true,
			opacity: 1,
			delay: 0.2,
			duration: 0.3,
			events: {
				onAnimationEnded: function() {
					fadeIn.focus();
				}
			}
		});
	},

	onActivateBackButton: function(event) {
		if (!this.frozen) {
			if (this.controls.myApps.visible){
				this.animteBar(this.controls.myMenu, this.controls.myApps, 100, 725);
				event.preventDefault();
			} else if (this.controls.myEPG.visible){
				this.animteBar(this.controls.myMenu, this.controls.myEPG, 100, 725);
				event.preventDefault();
			}
		}
	},

	createView: function () {
		this.elements.menuBackground = new MAF.element.Container({
			styles: {
				backgroundImage: 'Images/menuBar.png',
				backgroundSize:'100% 100%',
				boxShadow: '8px 8px 10px rgba(0,0,0,.6)',
				width: this.width,
				height: 100,
				vOffset: 725
			}
		}).appendTo(this);

		new MAF.element.Image({
			src: 'Images/ml.png',
			styles: {
				width: 320,
				height: 67,
				hOffset: this.width - 350,
				vOffset: this.elements.menuBackground.outerHeight + 140
			}
		}).appendTo(this);

		this.elements.menuTop = new MAF.element.Container({
			styles: {
				backgroundImage: 'Images/menuTop.png',
				width: 503,
				height: 54,
				hOffset: this.width - 503,
				vOffset: this.elements.menuBackground.vOffset - 54
			}
		}).appendTo(this);

		this.elements.datetime = new MAF.element.Text({
			label: Date.format(new Date(), 'dd MMM yyyy HH:mm'),
			styles: {
				fontSize: 25,
				color: 'white',
				opacity: 0.7,
				width: this.elements.menuTop.width - 40,
				height: this.elements.menuTop.height,
				hOffset: 40,
				anchorStyle: 'center'
			}
		}).appendTo(this.elements.menuTop);

		this.elements.menuBottom = new MAF.element.Container({
			styles: {
				backgroundImage: 'Images/menuBottom.png',
				width: 1300,
				height: 57,
				hOffset: this.width - 1300,
				vOffset: this.elements.menuBackground.outerHeight
			}
		}).appendTo(this);

		this.elements.meta = new MAF.element.Text({
			styles: {
				fontSize: 25,
				color: 'black',
				width: this.elements.menuBottom.width - 70,
				height: this.elements.menuBottom.height,
				hOffset: 60,
				anchorStyle: 'leftCenter',
				truncation: 'end'
			}
		}).appendTo(this.elements.menuBottom);

		this.controls.myMenu = new MAF.element.Grid({
			guid: 'MyMenu',
			rows: 1,
			columns: 3,
			carousel: true,
			dataset: [
				{ label: $_('Apps') + ' ' + FontAwesome.get('refresh icon-spin'), meta: $_('AppMeta') },
				{ label: $_('Channel'), meta: $_('ChannelMeta') },
				{ label: $_('Settings'), meta: $_('SettingsMeta') },
			],
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: Object.merge(this.getCellDimensions(), {
						opacity: 0.5
					}),
					events: {
						onSelect: function (event) {
							var data = this.getCellDataItem(),
								view = this.grid.owner.owner,
								label = data.label.split(' ')[0];
							switch (label) {
								case $_('Apps'):
									var myApps = MAF.messages.fetch('myApps') || [];
									if (myApps.length > 0)
										view.animteBar(view.controls.myApps, view.controls.myMenu, 230, 660);
									break;
								case $_('Channel'):
									view.animteBar(view.controls.myEPG, view.controls.myMenu, 230, 660);
									view.controls.myEPG.changeDataset([MAF.mediaplayer.getCurrentProgram()]);
									break;
								case $_('Settings'):
									MAF.application.loadView('view-TestView1');
									break;
								default:
									break;
							}
						},
						onFocus: function () {
							this.setStyle('opacity', 1);
							if (this.getCellDataItem().label === $_('Channel')){
								var currentProgram = MAF.mediaplayer.getCurrentProgram();
								this.grid.owner.owner.elements.meta.setText($_('NowWatching') + currentProgram.title);
							} else {
								this.grid.owner.owner.elements.meta.setText(this.getCellDataItem().meta);
							}
							this.text.animate({
								scale: 1.3,
								duration: 0.2
							});
						},
						onBlur: function () {
							this.setStyle('opacity', 0.5);
							this.text.animate({
								scale: 1,
								duration: 0.2
							});
						}
					}
				});
				cell.text = new MAF.element.Text({
					styles: {
						fontSize: 50,
						color: 'white',
						fontWeight: 'bold',
						width: cell.width - 20,
						height: cell.height - 20,
						hOffset: 10,
						vOffset: 10,
						anchorStyle: 'center'
					}
				}).appendTo(cell);
				return cell;
			},
			cellUpdater: function (cell, data) {
				cell.text.setText(data.label);
			},
			styles: {
				width: this.width - 100,
				height: 100,
				hOffset: 50
			}
		}).appendTo(this.elements.menuBackground);

		this.controls.myApps = new MAF.element.Grid({
			guid: 'MyApps',
			rows: 1,
			columns: 9,
			carousel: true,
			dataset: MAF.messages.fetch('myApps') || [],
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: Object.merge(this.getCellDimensions(), {
						overflow: 'visible'
					}),
					events: {
						onSelect: function (event) {
							var id = this.getCellDataItem();
							ApplicationManager.load(id);
							ApplicationManager.open(id);
						},
						onFocus: function () {
							this.focusImg.visible = true;
							this.focusImg.animate({
								opacity: 1,
								duration: 0.2
							});
							this.animate({
								scale: 1.1,
								duration: 0.2,
								zOrder: Animator.ZORDER
							});
							var data = ApplicationManager.getMetadata(this.getCellDataItem());
							this.getView().elements.meta.setText(data.name + ' - ' + data.description);
						},
						onBlur: function () {
							this.focusImg.animate({
								opacity: 0,
								duration: 0.2
							});
							this.animate({
								scale: 1,
								duration: 0.2,
								zOrder: null
							});
							this.focusImg.visible = false;
						}
					}
				});

				cell.focusImg = new MAF.element.Image({
					src: 'Images/Icon-Focus.png',
					autoShow: false,
					styles: {
						visible: false,
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
				cell.icon.setSource('../../' + data + '/Contents/' + ApplicationManager.getMetadata(data).images.icon['200x200']);
			},
			styles: {
				overflow: 'visible',
				visible: false,
				width: 1800,
				height: 200,
				hOffset: (this.width - 1800) / 2,
				vOffset: 15,
				opacity: 0
			}
		}).appendTo(this.elements.menuBackground);

		this.controls.myEPG = new MAF.element.Grid({
			guid: 'MyApps',
			rows: 1,
			columns: 1,
			carousel: true,
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: this.getCellDimensions(),
					events: {
						onFocus: function () {
						},
						onBlur: function () {
						}
					}
				});

				cell.program = new MAF.element.Text({
					visibleLines: 1,
					styles: {
						width: cell.width,
						height: cell.height,
						fontSize: 35,
						fontWeight: 'bold',
						truncation: 'end'
					}
				}).appendTo(cell);
				
				cell.desc = new MAF.element.Text({
					visibleLines: 4,
					styles: {
						width: cell.width,
						height: cell.height,
						fontSize: 27,
						vOffset: cell.program.outerHeight + 8,
						wrap: true,
						truncation: 'end'
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function (cell, data) {
				cell.program.setText(data.title);
				cell.desc.setText(data.description);
				cell.grid.owner.owner.elements.meta.setText(MAF.mediaplayer.getCurrentChannel().name);
			},
			styles: {
				visible: false,
				width: 1800,
				height: 200,
				hOffset: (this.width - 1800) / 2,
				vOffset: 15,
				opacity: 0
			}
		}).appendTo(this.elements.menuBackground);
	},

	destroyView: function() {
		clearInterval(this.clockTimerId);
		delete this.clockTimerId;
	}
});
