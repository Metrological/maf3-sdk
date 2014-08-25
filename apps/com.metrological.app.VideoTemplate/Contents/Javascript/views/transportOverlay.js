// Create a class and extended it from the MAF.system.FullscreenView
var transportOverlay = new MAF.Class({
	Extends: MAF.system.FullscreenView,

	ClassName: 'transportOverlay',

	// Add back params when going to the previous view
	viewBackParams: {
		reset: false
	},

	// Create your view template
	createView: function () {
		// Reference to the current view
		var view = this,
			// Create the Media Transport Overlay 
			mediaTransportOverlay = new MAF.control.MediaTransportOverlay({
				theme: false,
				buttonOrder: ['rewindButton', 'playButton', 'stopButton', 'forwardButton'], // Set the order of the buttons
				buttonOffset: 20, // Set the default space before and after the buttons
				buttonSpacing: 20, // Set the space between the buttons
				fadeTimeout: 6, // Set the fader of the overlay to start after 6 seconds
				playButton: true, // Enable the "play" button
				stopButton: false, // Disable the "stop" button
				rewindButton: true, // Enable the "rewind" button
				forwardButton: true // Enable the "fast forward" button
			}).appendTo(view);
	},

	gotKeyPress: function (event) {
		if (event.payload.key === 'stop')
			MAF.application.previousView();
	},

	// The channelChanged function is called when you change the channel of your TV 
	onChannelChanged: function () {
		MAF.application.previousView();
	},

	// When view is created or returning to view the view is updated
	updateView: function () {
		// Reference to the current view
		var view = this;
		view.channelChanged = view.onChannelChanged.subscribeTo(MAF.mediaplayer, 'onChannelChange', view);
		view.subcribedFunctionStop = view.gotKeyPress.subscribeTo(MAF.application, 'onWidgetKeyPress');

		// Add a new playlist with the video to the player
		var entry = new MAF.media.PlaylistEntry({
			url: 'http://video.metrological.com/aquarium.mp4',
			asset: new MAF.media.Asset('Aquarium')
		});
		MAF.mediaplayer.playlist.set(new MAF.media.Playlist().addEntry(entry));
		// Start the video playback
		MAF.mediaplayer.playlist.start();
	},

	// The hideView is called when you're leaving this view
	hideView: function () {
		// Reference to the current view
		var view = this;
		view.channelChanged.unsubscribeFrom(MAF.mediaplayer, 'onChannelChange');
		delete view.channelChanged;
		view.subcribedFunctionStop.unsubscribeFrom(MAF.application, 'onWidgetKeyPress');
		delete view.subcribedFunctionStop;
	}
});
