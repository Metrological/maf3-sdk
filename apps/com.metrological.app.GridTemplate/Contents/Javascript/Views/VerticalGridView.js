var VerticalGridView = new MAF.Class( {
	ClassName: 'VerticalGridView',

	Extends: MAF.system.SidebarView,

	items: [
		{ title: $_( 'Cell1' ) },
		{ title: $_( 'Cell2' ) },
		{ title: $_( 'Cell3' ) },
		{ title: $_( 'Cell4' ) },
		{ title: $_( 'Cell5' ) },
		{ title: $_( 'Cell6' ) }
	],

	createView: function() {
		var backButton = new MAF.control.BackButton( {
			label: $_( 'BACK' )
		} ).appendTo( this );

		var scroller = new MAF.control.ScrollIndicator( {
			theme: false,
			styles: {
				width: 23,
				height: this.height - backButton.outerHeight,
				vOffset: backButton.outerHeight,
				hAlign: 'right'
			},
			events: {
				onFocus: function() {
					this.setStyle( 'backgroundColor', Theme.getStyles( 'BaseFocus', 'backgroundColor' ) );
				},
				onBlur: function() {
					this.setStyle( 'backgroundColor', null );
				}
			}
		} ).appendTo( this );

		var verticalGrid = this.elements.verticalGrid = new MAF.element.Grid( {
			rows: 2,
			columns: 1,
			orientation: 'vertical',
			styles: {
				width: this.width - scroller.width,
				height: this.height - backButton.outerHeight,
				vOffset: backButton.outerHeight
			},
			cellCreator: function() {
				var cell = new MAF.element.GridCell( {
					styles: this.getCellDimensions(),
					events: {
						onSelect: function() {
							log( 'onSelect GridCell', this.getCellIndex() );
						},
						onFocus: function() {
							this.title.animate( {
								duration: 0.3,
								scale: 3
							} );
							this.setStyle( 'backgroundColor', Theme.getStyles( 'BaseFocus', 'backgroundColor' ) );
						},
						onBlur: function() {
							this.title.animate( {
								duration: 0.3,
								scale: 1.0
							} );
							this.setStyle( 'backgroundColor', null );
						}
					}
				} );

				cell.title = new MAF.element.Text( {
					styles: {
						width: cell.width,
						height: cell.height,
						color: '#F1F1F1',
						fontSize: 30,
						anchorStyle: 'center',
						wrap: true
					}
				} ).appendTo( cell );

				return cell;
			},
			cellUpdater: function( cell, data ) {
				cell.title.setText( data.title );
			}
		} ).appendTo( this );

		scroller.attachToSource( verticalGrid );
	},

	updateView: function() {
		this.elements.verticalGrid.changeDataset( this.items, true );
	},

	// When closing the application make sure you unreference
	// your objects and arrays from the view
	destroyView: function() {
		this.items = null;
	}
} );
