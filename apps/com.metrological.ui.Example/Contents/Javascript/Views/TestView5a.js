var TestView5a = new MAF.Class({
	ClassName: 'TestView5a',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		this.parent();
		this.registerMessageCenterListenerCallback(this.dataHasChanged);
	},

	dataHasChanged: function (event) {
		if (event.payload.key === 'pwPhotos') {
			var data = event.payload.value;
			if (data.startIndex === 1) {
				photopgr.initItems(data.Photos, (data.total <= 1900) ? data.total : 1900);
				this.controls.pwPhotosGrid.changePage(0);
				this.controls.pwPhotosGrid.focus();
			} else {
				photopgr.onGotPage(data.fetchParams, data.Photos, (data.total <= 1900) ? data.total : 1900);
			}
		}
	},

	createView: function () {
		if (!photopgr) {
			photopgr = new MAF.utility.Pager(15, 15, function (fetchParams) {
				getPicasaPhotos(fetchParams);
			}, this, 1);
		}

		var pageindicator = new MAF.control.PageIndicator({
			styles: {
				vAlign: 'bottom'
			}
		}).appendTo(this);

		this.controls.pwPhotosGrid = new MAF.element.Grid({
			guid: 'pwPhotosGrid',
			rows: 5,
			columns: 3,
//			carousel: true,
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
						onSelect: function (event) {
							MAF.application.loadView('view-TestView5b', {photo: event.payload.cellIndex, page: this.grid.getCurrentPage()});
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
				width: this.width,
				height: this.height - pageindicator.height
			}
		}).appendTo(this).attachAccessory(pageindicator);
	}
});
