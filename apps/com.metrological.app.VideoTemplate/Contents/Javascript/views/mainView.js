// Create a new View class and extended it from the MAF.system.SidebarView
var MainView = new MAF.Class( {
	Extends: MAF.system.SidebarView,

	ClassName: 'MainView',

	initView: function() {
		MAF.mediaplayer.init(); // Initialize mediaplayer
	},

	// Create your view template
	createView: function () {
		var directPlayButton = this.controls.directPlayButton = new MAF.control.TextButton( {
			label: $_( 'DirectPlay' ),
			guid: 'directPlayButton',
			styles: {
				height: 80,
				width: 400,
				hOffset: ( this.width - 400 ) / 2,
				vOffset: 150
			},
			textStyles: { anchorStyle: 'center' },
			events: {
				onSelect: function() {
					// If the player is playing, stop the video and change text on the button
					if ( MAF.mediaplayer.player.currentPlayerState === MAF.mediaplayer.constants.states.PLAY ) {

						MAF.mediaplayer.control.stop();
						this.setText( $_( 'DirectPlay' ) );
					} else {
						// If the player is not playing, start the video and change the text on the button
						// Add a new playlist with the video to the player
						MAF.mediaplayer.playlist.set(
							new MAF.media.Playlist().addEntryByURL( 'http://video.metrological.com/aquarium.mp4' )
						);

						// Start the video playback
						MAF.mediaplayer.playlist.start();

						this.setText( $_( 'DirectStop' ) );
					}
				}
			}
		} ).appendTo( this );

		this.controls.mediaTransportOverlayButton = new MAF.control.TextButton( {
			label: $_( 'MediaTransportOverlay' ),
			guid: 'mediaTransportOverlayButton',
			styles: {
				height: 80,
				width: 400,
				hOffset: ( this.width - 400 ) / 2,
				vOffset: directPlayButton.outerHeight + 50
			},
			textStyles: { anchorStyle: 'center' },
			events: {
				onSelect: function() {
					// Load the overlay view and start the playlist
					MAF.application.loadView( 'TransportOverlay' );
				}
			}
		} ).appendTo( this );
	},

	// When closing the application make sure you unreference your objects and arrays
	destroyView: function() {
		// If you do not stop, your video will keep playing when your App is closed
		MAF.mediaplayer.control.stop();
	}
} );
