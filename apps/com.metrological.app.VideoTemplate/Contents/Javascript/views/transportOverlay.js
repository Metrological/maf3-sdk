// Create a new View class and extended it from the MAF.system.FullscreenView
var TransportOverlayView = new MAF.Class( {
	Extends: MAF.system.FullscreenView,

	ClassName: 'transportOverlay',

	// Add back params when going to the previous view
	viewBackParams: { reset: false },

	// Create your view template
	createView: function() {
		// Create the Media Transport Overlay
		new MAF.control.MediaTransportOverlay( {
			// Set the order of the buttons
			buttonOrder: [
				'backwardseekButton',
				'rewindButton',
				'playButton',
				'stopButton',
				'forwardButton',
				'forwardseekButton'
			],
			buttonOffset: 20, // Set the default space before and after the buttons
			buttonSpacing: 20, // Set the space between the buttons
			fadeTimeout: 6, // Set the fader of the overlay to start after 6 seconds
			playButton: true, // Enable the "play" button
			stopButton: true, // Disable the "stop" button
			rewindButton: true, // Enable the "rewind" button
			forwardButton: true, // Enable the "fast forward" button
			forwardseekButton: true,
			backwardseekButton: true,
			events: {
				onTransportButtonPress: function( event ) {
					if ( event.payload.button === 'forwardseek' )
						MAF.mediaplayer.playlist.nextEntry();
					else if ( event.payload.button === 'backwardseek' )
						MAF.mediaplayer.playlist.previousEntry();
				}
			}
		} ).appendTo( this );
	},

	gotKeyPress: function( event ) {
		if ( event.payload.key === 'stop' )
			MAF.application.previousView();
	},

	// The channelChanged function is called when you change the channel of your TV
	onChannelChanged: function() {
		MAF.application.previousView();
	},

	// When view is created or returning to view the view is updated
	updateView: function() {
		this.onChannelChanged.subscribeTo( MAF.mediaplayer, 'onChannelChange' );
		this.gotKeyPress.subscribeTo( MAF.application, 'onWidgetKeyPress' );

		// Add a new playlist with the video to the player
		var playlist = new MAF.media.Playlist();

		var entry1 = new MAF.media.PlaylistEntry( {
			url: 'http://video.metrological.com/aquarium.mp4',
			asset: new MAF.media.Asset( 'Aquarium' )
		} );

		var entry2 = new MAF.media.PlaylistEntry( {
			url: 'http://video.metrological.com/sunset.mp4',
			asset: new MAF.media.Asset( 'Sunset' )
		} );

		var entry3 = new MAF.media.PlaylistEntry( {
			url: 'http://video.metrological.com/sea.mp4',
			asset: new MAF.media.Asset( 'Sunrise' )
		} );

		playlist.addEntry( entry1 );
		playlist.addEntry( entry2 );
		playlist.addEntry( entry3 );

		MAF.mediaplayer.playlist.set( playlist );

		// Start the video playback
		MAF.mediaplayer.playlist.start();
	},

	// The hideView is called when you're leaving this view
	hideView: function() {
		this.onChannelChanged.unsubscribeFrom( MAF.mediaplayer, 'onChannelChange' );
		this.gotKeyPress.unsubscribeFrom( MAF.application, 'onWidgetKeyPress' );
	}
});
