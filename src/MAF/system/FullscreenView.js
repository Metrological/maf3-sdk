define('MAF.system.FullscreenView', function () {
	return new MAF.Class({
		ClassName: 'FullscreenView',

		Extends: MAF.system.WindowedView,

		viewType: 'FULLSCREEN',

		Protected: {
			onHideView: function (event) {
				this.hide();
				this.backParams = {};
			},
			onUnselectView: function (event) {
				this.parent(event);
				if (this.fire("onHideView")) {
					this.hideView();
				}
			}
		},

		config: {
			showPassthroughVideo: false
		},

		initialize: function () {
			this.parent();
		},

		setTVViewportSize: function(x, y, width, height) {
			MAF.mediaplayer.setViewportBounds(x, y, width, height);
		},

		getTVViewportSize: function() {
			return MAF.mediaplayer.getViewportBounds();
		}
	});
}, {
	FullscreenView: {
		styles: {
			width: '1920px',
			height: '1080px'
		}
	}
});
