var SlideCarouselView = new MAF.Class( {
	ClassName: 'SlideCarouselView',

	// Extend a FullscreenView instead of SidebarView
	Extends: MAF.system.FullscreenView,

	// Set background color of the view on initialize of the class
	initView: function() {
		this.setStyle( 'backgroundColor', 'rgba( 0, 0, 0, 0.8 )' );
	},

	createView: function() {
		new MAF.control.BackButton( {
			label: $_( 'BACK' ),
			styles: {
				vOffset: 50,
				paddingLeft: 50
			}
		} ).appendTo( this );

		this.elements.slider = new MAF.element.SlideCarousel( {
			visibleCells: 4,
			subCells: 2,
			focusIndex: 1,
			slideDuration: 0.3,
			styles: {
				width: this.width + 80,
				height: 600,
				hOffset: 49,
				vAlign: 'bottom',
				vOffset: 100
			},
			cellCreator: function() {
				var cell = new MAF.element.SlideCarouselCell( {
					styles: Object.merge(
						{ backgroundColor: '#000000' },
						this.getCellDimensions()
					),
					events: {
						onFocus: function() {
							this.title.animate( {
								scale: 3,
								duration: 0.3
							} );

							this.setStyle(
								'backgroundColor',
								Theme.getStyles( 'BaseFocus', 'backgroundColor' )
							);
						},
						onBlur: function() {
							this.title.animate( {
								scale: 1,
								duration: 0.3
							} );

							this.setStyle( 'backgroundColor', '#000000' );
						}
					}
				} );

				cell.title = new MAF.element.Text( {
					styles: {
						width: cell.width,
						textAlign: 'center',
						vAlign: 'center',
						color: '#F1F1F1',
						fontSize: 32
					}
				} ).appendTo( cell );

				return cell;
			},
			cellUpdater: function( cell, data ) {
				cell.title.setText( data.title );
			},
			events: {
				onDatasetChanged: function() {
					this.getCurrentCell().focus();
				}
			}
		} ).appendTo( this );
	},

	// After the update view the focus view is called
	focusView: function() {
		this.elements.slider.changeDataset( [
			{ title: $_( 'Cell1' ) },
			{ title: $_( 'Cell2' ) },
			{ title: $_( 'Cell3' ) },
			{ title: $_( 'Cell4' ) },
			{ title: $_( 'Cell5' ) },
			{ title: $_( 'Cell6' ) },
			{ title: $_( 'Cell7' ) },
			{ title: $_( 'Cell8' ) },
			{ title: $_( 'Cell9' ) },
			{ title: $_( 'Cell10' ) }
		], true );
	}
} );
