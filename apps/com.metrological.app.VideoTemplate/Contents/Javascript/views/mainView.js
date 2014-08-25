// Create a class and extended it from the MAF.system.SidebarView
var mainView = new MAF.Class({
	Extends: MAF.system.SidebarView,

	ClassName: 'mainView',

	initialize: function () {
		// Reference to the current view
		var view = this;
		view.parent(); // Call super class constructor
		MAF.mediaplayer.init(); // Initialize mediaplayer
	},

	// Create your view template
	createView: function () {
		// Reference to the current view
		var view = this;

		var directPlayButton = view.controls.directPlayButton = new MAF.control.TextButton({
			label: 'Direct Play',
			guid: 'directPlayButton',
			styles: {
				height: 80,
				width: 400,
				hOffset: (view.width - 400) / 2,
				vOffset: 150
			},
			textStyles: {
				anchorStyle: 'center'
			},
			events: {
				onSelect: function () {
					// If the player is not playing, start the video and change the text on the button
					if (MAF.mediaplayer.player.currentPlayerState !== MAF.mediaplayer.constants.states.PLAY){
						// Add a new playlist with the video to the player
						MAF.mediaplayer.playlist.set(new MAF.media.Playlist().addEntryByURL('http://video.metrological.com/aquarium.mp4'));
						// Start the video playback
						MAF.mediaplayer.playlist.start();
						this.setText('Direct Stop');
					} else {
						// If the player is playing, stop the video and change text on the button
						MAF.mediaplayer.control.stop();
						this.setText('Direct Play');
					}
				}
			}
		}).appendTo(view);

		var mediaTransportOverlayButton = view.controls.mediaTransportOverlayButton = new MAF.control.TextButton({
			label: 'Media Transport Overlay',
			guid: 'mediaTransportOverlayButton',
			styles: {
				height: 80,
				width: 400,
				hOffset: (view.width - 400) / 2,
				vOffset: directPlayButton.outerHeight + 50
			},
			textStyles: {
				anchorStyle: 'center'
			},
			events: {
				onSelect: function () {
					// Load the overlay view and start the playlist
					MAF.application.loadView('view-transportOverlay');
				}
			}
		}).appendTo(view);
	},

	// When closing the application make sure you unreference your objects and arrays
	destroyView: function () {
		MAF.mediaplayer.control.stop();
	}
});
