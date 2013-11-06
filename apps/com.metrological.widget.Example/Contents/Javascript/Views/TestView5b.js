var TestView5b = new MAF.Class({
	ClassName: 'TestView5b',

	Extends: MAF.system.FullscreenView,

	initialize: function () {
		this.parent();
		this.setStyle('backgroundColor', 'rgba(0,0,0,.5)');
	},

	viewBackParams: {
		photo: 0,
		page: 0
	},

	createView: function () {
		this.elements.photo = new MAF.element.Image({
			aspect: 'auto',
			hideWhileLoading: true,
			loadingSrc: 'Images/1920x1080/LoadingImage.png',
			missingSrc: 'Images/1920x1080/NoImage.png',
			styles: {
				width: this.width - 200,
				height: this.height - 200,
				hAlign: 'center',
				vAlign: 'center',
				vOffset: -50
			}
		}).appendTo(this);

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
							var grid = this.grid,
								photo = grid.owner.elements.photo,
								idx = this.getCellDataIndex(),
								data = this.getCellDataItem();
							(function (i) {
								var current = grid ? (grid.getCurrentPage() * grid.getCellCount()) + grid.getFocusIndex() : -1;
								if (current === i && data && data['media$group'] && photo) {
									photo.setSource(data['media$group']['media$content'][0].url);
								}
							}).delay(500, null, [idx]);
							this.setStyle('backgroundColor', Theme.getStyles('BaseFocus', 'backgroundColor'));
						},
						onBlur: function () {
							this.setStyle('backgroundColor', null);
						},
						onSelect: function () {
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
				var thumbs = data && data['media$group'] && data['media$group']['media$thumbnail'] && data['media$group']['media$thumbnail'];
				if (thumbs) {
					cell.thumb.setSource(thumbs[1].url);
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

	hideView: function () {
		this.elements.photo.src = null;
		this.viewBackParams.photo = this.controls.pwPhotosGrid5b.getFocusIndex();
		this.viewBackParams.page = this.controls.pwPhotosGrid5b.getCurrentPage();
	},

	focusView: function () {
		this.controls.pwPhotosGrid5b.focusCell(this.persist.photo || 0);
	}
});
