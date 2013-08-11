define('MAF.control.PhotoGridCell', function () {
	var fitPhoto = function () {
		var cw = this.width,
			ch = this.height,
			sz = Math.min(cw, ch) - (this.config.cellPadding || 0) * 2;
		this.photo.aspectSizeMax(sz);
		this.photo.show();
	};

	return new MAF.Class({
		ClassName: 'ControlPhotoGridCell',

		Extends: MAF.control.GridCell,

		config: {
			cellPadding: 16
		},

		initialize: function () {
			this.parent();

			this.photo = new MAF.element.Image({
				ClassName: 'ControlPhotoHolderImage',
				hideWhileLoading: true,
				autoShow: false,
				styles: {
					hAlign: 'center',
					vAlign: 'center'
				}
			}).appendTo(this);

			fitPhoto.subscribeTo(this.photo, 'onLoaded', this);
			this.photo.setSources(this.config);
		},

		setSources: function (sources) {
			return this.photo.setSources(sources);
		},

		setSource: function (source) {
			return this.photo.setSource(source);
		}
	});
}, {
	ControlPhotoGridCell: 'ControlGridCell',
	ControlPhotoHolderImage: {
		styles: {
			border: '2px solid white'
		}
	}
});
