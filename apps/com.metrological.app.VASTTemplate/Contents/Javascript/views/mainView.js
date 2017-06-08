// Create a new View class and extended it from the MAF.system.SidebarView
var MainView = new MAF.Class( {
	Extends: MAF.system.SidebarView,

	buttons: {},
	baseUrl: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&correlator=&cust_params=',
	adEndpoints: {
		singleInlineLinear: 'deployment%3Ddevsite%26sample_ct%3Dlinear'
	, singleSkippableInline: 'deployment%3Ddevsite%26sample_ct%3Dskippablelinear'
	, singleRedirectLinear: 'deployment%3Ddevsite%26sample_ct%3Dredirectlinear'
	, singleRedirectError: 'deployment%3Ddevsite%26sample_ct%3Dredirecterror&nofb=1'
	, singleRedirectBrokenFallback: 'deployment%3Ddevsite%26sample_ct%3Dredirecterror'
	},
	adPlaying: false,

	VAST: new MAF.VAST( { wrapperLimit: 3 } ),

	initView: function() {
		MAF.mediaplayer.init(); // Initialize mediaplayer
	},

	// Create your view template
	createView: function() {
		var i = 0;

		Object.forEach( this.adEndpoints, function( k, v ) {
			this.buttons[ k ] = new MAF.control.TextButton( {
				label: $_( k ),
				styles: {
					height: 80,
					width: 400,
					hOffset: ( this.width - 400 ) / 2,
					vOffset: 150 * i
				},
				textStyles: { anchorStyle: 'center' },
				events: {
					onSelect: function() {
						if ( MAF.mediaplayer.player.currentPlayerState === MAF.mediaplayer.constants.states.PLAY ) {
							Object.forEach( this.owner.buttons, function( key, button ) {
								button.setDisabled( false );
							} );

							this.setText( $_( k ) );

							MAF.mediaplayer.control.stop();

							if ( this.tracker ) {
								this.tracker.close();
								this.tracker = null;
							}

							this.owner.adPlaying = false;

						} else {
							Object.forEach( this.owner.buttons, function( key, button ) {
								button.setDisabled( true );
							} );

							this.setDisabled( false );

							this.setText( $_( 'Stop' ) );

							this.type = k;
							this.adUri = this.owner.baseUrl + v;

							this.owner.getAd( this );
						}
					}
				}
			} ).appendTo( this );

			i++;
		}, this );

		this.buttons.skip = new MAF.control.TextButton( {
			label: $_( 'SKIP' ),
			styles: {
				height: 80,
				width: 400,
				hOffset: ( this.width - 400 ) / 2,
				vOffset: 750
			},
			textStyles: { anchorStyle: 'center' },
			events: {
				onSelect: function() {
					this.owner.adPlaying = false;

					MAF.mediaplayer.playlist.nextEntry();
				}
			}
		} ).appendTo( this ).hide();
	},

	getAd: function( button ) {
		var view = this;
		var advertisement = null;

		this.VAST.get( button.adUri, function( err, vast ) {

	    if ( !err && vast )
	      vast.ads.some( function( ad ) {
	        return ad.creatives.some( function( creative ) {
	          if ( creative.mediaFiles && creative.mediaFiles.length )
	            return creative.mediaFiles.some( function( mediaFile ) {
	              if ( mediaFile.width === 1280 && mediaFile.height === 720 ) {

	                advertisement = { type: button.type };
	                advertisement.url = mediaFile.fileURL;
	                advertisement.tracker = button.tracker = new view.VAST.Tracker( ad, creative );
	                advertisement.tracker.button = button;

	                if ( creative.skipDelay )
	                	advertisement.skip = creative.skipDelay;

	                return true;
	              }
	              return false;
	            } );
	          return false;
	        } );
	      } );

        view.play( advertisement );
		} );
	},

	play: function( ad ) {
		var playlist = new MAF.media.Playlist();

		if ( ad ) {
			this.setAdEvents( ad );

	    playlist.addEntry(
	      new MAF.media.PlaylistEntry( {
	        url: ad.url,
	        asset: new MAF.media.Asset( 'Advertisement' )
	      } )
	    );
	  }

		// Add a new playlist with the video to the player
		MAF.mediaplayer.playlist.set(
			playlist.addEntryByURL( 'http://video.metrological.com/aquarium.mp4' )
		);

		// Start the video playback
		MAF.mediaplayer.playlist.start();

		this.adPlaying = true;

	  if ( ad ) ad.tracker.load();
	},

	setAdEvents: function( ad ) {
		var tracker = ad.tracker;
		var skipped = false;
		var view = this;
  	var skip = view.buttons.skip;

	  var onNextEntry = function() {
	    if ( view.adPlaying ) tracker.complete();
	    else tracker.skip();

	    view.adPlaying = false;

	    skip.hide();
  		skip.setDisabled( true );

			tracker.button.setDisabled( false );
			tracker.button.focus();

	    onTimeIndex.unsubscribeFrom( MAF.mediaplayer, 'onTimeIndexChanged' );
	    onNextEntry.unsubscribeFrom( MAF.mediaplayer, 'onLoadNextPlaylistEntry' );
	    onBlock.unsubscribeFrom( MAF.application, 'onWidgetKeyPress' );
	  };

	  var onTimeIndex = function( evt ) {
	  	var timeIndex = evt.payload.timeIndex;

	    tracker.setProgress( timeIndex );

	  	if ( ad.skip && ad.skip <= timeIndex && !skipped ) {
	  		skip.show().focus();
  			Object.forEach( view.buttons, function( key, button ) {
					button.setDisabled( true );
				} );
	  		skip.setDisabled( false );
	  		onBlock.unsubscribeFrom( MAF.application, 'onWidgetKeyPress' );
	  		skipped = true;
	  	}
	  };

	  var onBlock = function( evt ) {
	  	var key = evt.payload.key;
	  	if ( !~[ 'playpause', 'pause', 'play', 'forward', 'rewind', 'stop' ].indexOf( key ) ) return;
	    evt.stop();
	    return false;
	  };

	  onNextEntry.subscribeTo( MAF.mediaplayer, 'onLoadNextPlaylistEntry' );
	  onTimeIndex.subscribeTo( MAF.mediaplayer, 'onTimeIndexChanged' );
	  onBlock.subscribeTo( MAF.application, 'onWidgetKeyPress' );
	},

	// When closing the application make sure you unreference your objects and arrays
	destroyView: function() {
		this.VAST.suicide();

		this.VAST = null;
		this.adEndpoints = null;

		Object.forEach( this.buttons, function( k, button ) {
			if ( button.tracker ) button.tracker.suicide();
		} );

		this.buttons = null;

		// If you do not stop, your video will keep playing when your App is closed
		MAF.mediaplayer.control.stop();
	}
} );
