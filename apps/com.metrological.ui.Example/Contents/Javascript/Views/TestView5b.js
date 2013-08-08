var TestView5b = new MAF.Class({
	ClassName: 'TestView5b',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
		this.parent();
		this.setStyle('backgroundColor', 'rgba(0,0,0,.5)');
	},

	createView: function () {
		this.controls.pwPhotosGrid5b = new MAF.element.Grid({
			guid: 'pwPhotosGrid5b',
			rows: 1,
			columns: 15,
			carousel: true,
//			manageWaitIndicator: true,
			pager: photopgr,
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: this.getCellDimensions(),
					events: {
						onFocus: function () {
							this.setStyle('backgroundColor', Theme.getStyles('BaseFocus', 'backgroundColor'));
						},
						onBlur: function () {
							this.setStyle('backgroundColor', null);
						},
						onSelect: function () {
							log('toe slideshow, starting with this image');
						}
					}
				});

				cell.thumb = new MAF.element.Image({
					hideWhileLoading: true,
					missingSrc: 'Images/NoImage.png',
					aspect: 'auto',
					styles: {
						width: cell.width - 10,
						height: cell.height - 10,
						hAlign: 'center',
						vAlign: 'center'
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function (cell, data) {
				if (data && data['media$group']) {
					if (data['media$group']['media$thumbnail'])
						cell.thumb.setSource(data['media$group']['media$thumbnail'][1].url);
					else
						cell.thumb.setSource(data['media$group']['media$content'][0].url);
				}
			},
			styles: {
				vAlign: 'bottom',
				width: this.width,
				height: 100
			}
		}).appendTo(this);
	},

	updateView: function () {
		this.controls.pwPhotosGrid5b.changePage(this.persist.page || 0);
	},

	focusView: function () {
		this.controls.pwPhotosGrid5b.focusCell(this.persist.photo || 0);
	}
});
