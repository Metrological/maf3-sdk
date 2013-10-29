var AppsView = new MAF.Class({
	ClassName: 'AppsView',

	Extends: MAF.system.FullscreenView,

	transition: {
		updateView: {
			backgroundColor: 'rgba(0,0,0,.4)',
			delay: 1,
			duration: 1
		},
		hideView: {
			backgroundColor: 'transparent',
			delay: 3,
			duration: 1
		}
	},

	initialize: function () {
		this.parent();
		this.registerMessageCenterListenerCallback(this.dataHasChanged);
	},

	dataHasChanged: function (event) {
		if (event.payload.value && event.payload.key === 'myApps') {
			this.controls.myApps.changeDataset(event.payload.value, true);
			this.controls.myApps.focus();
		}
	},

	createView: function () {
		this.controls.myApps = new MAF.element.Grid({
			guid: 'MyApps',
			rows: 2,
			columns: 6,
			carousel: true,
			dataset: MAF.messages.fetch('myApps') || [],
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
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
							this.focusImg.visible = true;
							this.focusImg.animate({
								opacity: 1,
								duration: 0.2
							});
							this.animate({
								scale: 1.2,
								duration: 0.2
							});
							var data = ApplicationManager.getMetadata(this.getCellDataItem());
						},
						onBlur: function () {
							this.focusImg.animate({
								opacity: 0,
								duration: 0.2
							});
							this.animate({
								scale: 1,
								duration: 0.2
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
				//transform: 'translateZ(0)',
				width: 300 * 6,
				height: 300 * 2,
				hOffset: (this.width - 1800) / 2,
				vOffset: (this.height - 600) / 2
			}
		}).appendTo(this);

		this.controls.myApps.body.setStyles({
			transform: 'translateZ(0)',
			opacity: 0
		});
	},

	selectView: function () {
		this.controls.myApps.body.setStyle('opacity', null);
	},

	unselectView: function () {
		this.controls.myApps.animate({
			scale: 0.3,
			opacity: 0,
			delay: 0.1,
			duration: 0.3,
			events: {
				onAnimationEnded: function (animator) {
					animator.reset();
					this.body.setStyle('opacity', 0);
					this.setStyles({
						opacity: null,
						transform: null
					});
				}
			}
		});
	},

	destroyView: function () {
		clearInterval(this.clockTimerId);
		delete this.clockTimerId;
	}
});
