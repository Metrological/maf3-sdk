define('MAF.system.FullscreenView', function () {
	return new MAF.Class({
		ClassName: 'FullscreenView',

		Extends: MAF.system.WindowedView,

		viewType: 'FULLSCREEN',

		config: {
			showPassthroughVideo: false
		}/*,

		setTVViewportSize: function(x, y, width, height) {
			MAF.mediaplayer.setViewportBounds(x, y, width, height);
		},

		getTVViewportSize: function() {
			return MAF.mediaplayer.getViewportBounds();
		}*/
	});
}, {
	FullscreenView: {
		styles: {
			width: '1920px',
			height: '1080px'
		}
	}
});
