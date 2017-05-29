// Create a new View class and extend it from the MAF.system.FullscreenView
var VideoView = new MAF.Class( {
	Extends: MAF.system.FullscreenView,

	ClassName: 'VideoItem',

	viewBackParams: { reset: false },

	initView: function() {
		this.stateChange = this.onStateChange.subscribeTo( MAF.mediaplayer, 'onStateChange', this );
	},

	// Fired each time media gets into a new state.
	onStateChange: function( event ) {
		var state = event.payload.newState;
		// You can match the states in the payload against MAF.mediaplayer.constants.states
		var states = MAF.mediaplayer.constants.states;

		if ( state === undefined ) state = states.INIT;

		if ( state === states.ERROR || state === states.EOF )
			this.nextVideo();
	},

	// Create your view template
	createView: function() {
		var transportOverlay = new MAF.control.MediaTransportOverlay( {
			ClassName: 'YTOverlay',
			theme: false,
			buttonOrder: [
				'backwardseekButton',
				'rewindButton',
				'playButton',
				'forwardButton',
				'forwardseekButton'
			],
			buttonOffset: 300,
			buttonSpacing: 100,
			fadeTimeout: 6,
			playButton: true,
			stopButton: false,
			rewindButton: true,
			forwardButton: true,
			forwardseekButton: true,
			backwardseekButton: true,
			styles: { vOffset: 100 },
			events: {
				onTransportOverlayHide: function() {
					this.owner.elements.metaContainer.animate( {
						opacity: 0,
						duration: 0.6,
						origin: 'center'
					} );
				},
				onTransportOverlayShow: function() {
					this.owner.elements.metaContainer.animate( {
						opacity: 1,
						duration: 0.2,
						origin: 'center'
					} );
				},
				onTransportButtonPress: function( event ) {
					if ( event.payload.button === 'forwardseek' )
						this.owner.nextVideo();
					if ( event.payload.button === 'backwardseek' )
						this.owner.prevVideo();
				}
			}
		} ).appendTo( this );

		transportOverlay.progressBar.setStyle( 'height', 5 );
		transportOverlay.controls.troth.setStyle( 'height', 5 );
		transportOverlay.controls.intervalText.setStyles( { hOffset: 0, vOffset: 0 } );
		transportOverlay.controls.durationText.setStyles( { hOffset: 0, vOffset: 0 } );

		var metaContainer = this.elements.metaContainer = new MAF.element.Container( {
			styles: {
				width: this.width,
				height: 200,
				backgroundColor: 'rgba(0,0,0,.5)'
			}
		} ).appendTo( this );

		new MAF.element.Image( {
			src: 'Images/logo_white.png',
			styles: {
				opacity: 0.45,
				width: 92,
				height: 57,
				hOffset: 1781,
				vOffset: 50
			}
		} ).appendTo( metaContainer );

		this.elements.image = new MAF.element.Image( {
			missingSrc: 'Images/missing.png',
			hideWhileLoading: true,
			aspect: 'crop',
			styles: {
				backgroundPosition: 2,
				width: 200,
				height: 120,
				hOffset: 100,
				vOffset: 40
			}
		} ).appendTo( metaContainer );

		var title = this.elements.title = new MAF.element.Text( {
			styles: {
				fontSize: 40,
				width: this.width - 660,
				hOffset: 320,
				vOffset: 50,
				truncation: 'end'
			}
		} ).appendTo( metaContainer );

		this.elements.info = new MAF.element.Text( {
			styles: {
				fontSize: 25,
				width: title.width,
				height: 80,
				hOffset: title.hOffset,
				vOffset: title.outerHeight + 20,
				truncation: 'end'
			}
		} ).appendTo( metaContainer );
	},

	startVideo: function() {
		YouTube.get( YT.current.item.id, function( video ) {
			if ( video ) {
				MAF.mediaplayer.playlist.set(
	        new MAF.media.Playlist().addEntry(
	          new MAF.media.PlaylistEntry( video )
	        )
	      );

	      MAF.mediaplayer.playlist.start();
			} else {

				new MAF.dialogs.Alert( {
					title: $_( 'ERROR' ),
					message: $_( 'PLAYBACK_ERROR' ),
					isModal: true,
					buttons: [ {
	          label: $_( 'CLOSE' ),
	          callback: function() {
	            MAF.application.previousView( this.viewBackParams );
	          }
	        } ]
				} ).show();
			}
		}, this );
	},

	nextVideo: function() {
		YT.next();
		this.startVideo();
	},

	prevVideo: function() {
		YT.prev();
		this.startVideo();
	},

	onWidgetKeyPress: function( event ) {
		if ( event.payload.key !== 'stop' ) return;
		MAF.application.previousView( this.viewBackParams );
	},

	// When view is created or returning to view the view is updated
	updateView: function() {
		this.keyPress = this.onWidgetKeyPress.subscribeTo( MAF.application, 'onWidgetKeyPress', this );

		if ( MAF.mediaplayer.currentAsset.id !== YT.current.item.id )
			this.startVideo();
	},

	// The hideView is called when you're leaving this view
	hideView: function() {
		this.keyPress.unsubscribeFrom( MAF.application, 'onWidgetKeyPress' );
		this.stateChange.unsubscribeFrom( MAF.mediaplayer, 'onStateChange' );
	},

	// When closing the application make sure you unreference your objects and arrays
	destroyView: function() {
		this.hideView();
		delete this.stateChange;
	}
} );
