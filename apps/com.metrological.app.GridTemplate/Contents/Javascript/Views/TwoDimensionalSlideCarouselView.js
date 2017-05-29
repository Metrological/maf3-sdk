var TwoDimensionalSlideCarouselView = new MAF.Class( {
	ClassName: 'TwoDimensionalSlideCarouselView',

	// Extend a FullscreenView instead of SidebarView
	Extends: MAF.system.FullscreenView,

	initView: function() {
		var i = 1;
		var inner = [];

		this.dummyData = [];

		// Set background color of the view on initialize of the view
		this.setStyle( 'backgroundColor', 'rgba( 0, 0, 0, 0.8 )' );

		for (; i<= 48; i++ ) {
			inner.push( { title: $_( 'Cell' + i ) } );

			if ( i % 6 === 0 ) {
				this.dummyData.push( inner );
				inner = [];
			}
		}
	},

	createView: function() {
		this.elements.backButton = new MAF.control.BackButton().appendTo( this );

		this.elements.parentSlider = new MAF.element.SlideCarousel( {
			visibleCells: 4,
			focusIndex: 1,
			slideDuration: 0.3,
			dynamicFocus: true,
			orientation: 'vertical',
			styles: {
				width: this.width,
				height: this.height - this.elements.backButton.height,
				vOffset: this.elements.backButton.outerHeight
			},
			cellCreator: function() {
				var cell = new MAF.element.SlideCarouselCell( {
					styles: this.getCellDimensions(),
					events:{
						onFocus: function() {
							setTimeout( function() { cell.subSlider.focus(); }, 0 );
						}
					}
				} );

				cell.subSlider = new MAF.element.SlideCarousel( {
					visibleCells: 4,
					focusIndex: 1,
					slideDuration: 0.3,
					dynamicFocus: true,
					styles:{
						width: cell.width,
						height: cell.height
					},
					cellCreator: function() {
						var subCell = new MAF.element.SlideCarouselCell( {
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

						subCell.title = new MAF.element.Text( {
							styles:{
								width: subCell.width,
								height: subCell.height,
								anchorStyle: 'center'
							}
						} ).appendTo( subCell );

						return subCell;
					},
					cellUpdater: function( subCell, data ) {
						subCell.title.setText( data.title );
					}
				} ).appendTo( cell );

				return cell;
			},
			cellUpdater: function( cell, data ) {
				cell.subSlider.changeDataset( data );
			},
			events: {
				onDatasetChanged: function() {
					this.getCurrentCell().focus();
				}
			}
		} ).appendTo( this );
	},

	updateView: function() {
		this.elements.parentSlider.changeDataset( this.dummyData, true );
	},

	destroyView: function() {
		this.dummyData = null;
	}
} );
