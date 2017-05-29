// Create a new View class and extend it from the MAF.system.FullscreenView
var MainView = new MAF.Class( {
	Extends: MAF.system.FullscreenView,

	ClassName: 'Fullscreen',

	defaultData: [ {
		snippet: {
			id: 'info',
			publishedAt: $_( 'Home_empty_result1' ),
			description: $_( 'Home_empty_result2' ),
			thumbnails: { high: 'Images/missing.png' }
		}
	} ],

	initView: function() {
		this.setStyles( {
			backgroundSize: '100% 100%',
			backgroundImage: 'Images/background.png'
		} );

		MAF.mediaplayer.init(); // Initialize mediaplayer

		// Register MAF messages listener to dataHasChanged
		this.registerMessageCenterListenerCallback( this.dataHasChanged );
	},

	// Create your dataHasChanged function
	dataHasChanged: function( event ) {
		if ( this.backFromSearch || event.payload.key !== 'YoutubeFeed' ) return;

		var data = event.payload.value;

		if ( !data || data.length === 0 ) data = this.defaultData;

		MAF.messages.store( 'YoutubePlaylist', data );

		this.elements.videos.animate( {
			opacity: 0,
			duration: 0.3,
			events: {
				onAnimationEnded: function() { this.changeDataset( data ); }
			}
		} );
	},

	// Create your view template
	createView: function() {
		this.elements.loader = new MAF.element.Text( {
			anchorStyle: 'center',
			label: FontAwesome.get( [ 'circle-o-notch', 'spin' ] ),
			styles: {
				width: 400,
				height: 500,
				hOffset: 49,
				vOffset: 540,
				fontSize: 150,
				opacity: 0
			},
			methods: {
				hide: function() {
					this.animate( {
						opacity: 0,
						duration: 0.3,
						events: {
							onAnimationEnded: function() { this.visible = false; }
						}
					} );
				},
				show: function() {
					this.animate( {
						visible: true,
						events: {
							onAnimationEnded: function() {
								this.animate( {
									opacity: 1,
									duration: 0.3
								} );
							}
						}
					} );
				}
			}
		} ).appendTo( this );

		this.elements.videos = new MAF.element.SlideCarousel( {
			visibleCells: 4,
			focusIndex: 1,
			slideDuration: 0.3,
			cellCreator: function() {
				// Create cells for the grid
				var cell = new MAF.element.SlideCarouselCell( {
					styles: this.getCellDimensions(),
					events: {
						onSelect: function() {
							var video = this.getCellDataItem();

							if ( video.id !== 'info' ) {

								YT.current = {
	                item: video,
	                index: this.getCellDataIndex()
	              };

								MAF.application.loadView( 'Video' );
							}
						},
						onFocus: function() {
							this.back.setStyle( 'backgroundColor', '#F1F1F1' );
							this.title.setStyle( 'color', 'black' );
							this.desc.setStyles( 'color', '#999999' );
						},
						onBlur: function(){
							this.back.setStyle( 'backgroundColor', 'black' );
							this.title.setStyle( 'color', '#F1F1F1' );
							this.desc.setStyle( 'color', '#F1F1F1' );
						}
					}
				} );

				var image = cell.image = new MAF.element.Image( {
					missingSrc: 'Images/missing.png',
					hideWhileLoading: true,
					aspect: 'crop',
					styles: {
						backgroundColor: 'black',
						width: cell.width - 20,
						height: 270
					}
				} ).appendTo( cell );

				cell.back = new MAF.element.Container( {
					styles: {
						backgroundColor: 'black',
						width: cell.width - 20,
						height: 250,
						vOffset: 270
					}
				} ).appendTo( cell );

				var title = cell.title = new MAF.element.Text( {
					visibleLines: 2,
					styles: {
						color: '#F1F1F1',
						fontSize: 32,
						width: cell.width - 50,
						height: 73,
						hOffset: 20,
						vOffset: image.outerHeight + 15,
						wrap: true,
						truncation: 'end'
					}
				} ).appendTo( cell );

				var date = cell.date = new MAF.element.Text( {
					styles: {
						fontSize: 25,
						color: '#E52D27',
						width: title.width,
						hOffset: title.hOffset,
						vOffset: title.outerHeight + 10
					}
				} ).appendTo( cell );

				cell.desc = new MAF.element.Text( {
					visibleLines: 2,
					styles: {
						fontSize: 25,
						color: '#F1F1F1',
						width: date.width,
						hOffset: date.hOffset,
						vOffset: date.outerHeight + 5,
						wrap: true,
						truncation: 'end'
					}
				} ).appendTo( cell );

				return cell;
			},
			// Update cells when changeDataset is called
			cellUpdater: function( cell, data ) {
				if ( data.img )
					cell.image.setSource( data.img );
				else
					cell.image.setSource( 'Images/missing.png' );

				cell.title.setText( data.title );
				cell.desc.setText( data.description );
				cell.date.setText(
					data.id === 'info' ?
					$_( 'Home_empty_result1' ) :
					data.date
				);
			},
			styles:{
				width: this.width + 80,
				height: 500,
				hOffset: 49,
				vOffset: 540
			},
			events: {
				onDatasetChanged: function() {
					this.getCurrentCell().focus();

					this.owner.elements.loader.hide();

					this.animate( {
						opacity: 1,
						duration: 0.3
					} );
				}
			}
		} ).appendTo( this );
	},

	// When view is created or returning to view the view is updated
	updateView: function() {
		if ( this.backParams && this.backParams.reset === false ) return;

		this.elements.loader.show();

		YT.getVideos(
      function() {
        MAF.messages.store( 'YoutubeFeed', [] );
      },
      function( videos ) {
      	MAF.messages.store( 'YoutubeFeed', videos );
     	}
    );
	},

	// When closing the application make sure you unreference your objects and arrays
	destroyView: function() {
		MAF.mediaplayer.control.stop();
		MAF.messages.reset();
		delete this.defaultData;
	}
} );
