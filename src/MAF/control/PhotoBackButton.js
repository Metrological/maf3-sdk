define('MAF.control.PhotoBackButton', function () {
	var fitPhoto = function () {
		this.aspectSizeMax(Math.min(this.width, this.height));
	};

	return new MAF.Class({
		ClassName: 'ControlPhotoBackButton',

		Extends: MAF.control.BackButton,

		createContent: function () {
			this.parent();
			this.photo = new MAF.element.Image({
				ClassName: (this.config.ClassName || this.ClassName) + 'Image'
			}).appendTo(this);

			fitPhoto.subscribeTo(this.photo, 'onLoaded', this.photo);

			this.photo.setSources(this.config);
		},

		setSource: function (source) {
			return this.photo.setSource(source);
		},

		setSources: function (sources) {
			return this.photo.setSources(sources);
		}
	});
}, {
	ControlPhotoBackButton: 'ControlButton',
	ControlPhotoBackButtonImage: {
		styles: {
			vAlign: 'center',
			hOffset: 100,
			width: 40,
			height: 40
		}
	}
});
