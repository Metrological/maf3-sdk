var HorizontalGridView = new MAF.Class( {
	ClassName: 'HorizontalGridView',

	Extends: MAF.system.SidebarView,

	createView: function() {
		var backButton = new MAF.control.BackButton( {
			label: $_( 'BACK' )
		} ).appendTo( this );

		// Create a PageIndicator
		var pageindicator = new MAF.control.PageIndicator( {
			styles: {
				height: 50,
				width: this.width,
				vAlign: 'bottom'
			}
		} ).appendTo( this );

		var horizontalGrid = this.elements.horizontalGrid = new MAF.element.Grid( {
			rows: 1,
			columns: 2,
			carousel: true,
			styles: {
				width: this.width,
				height: this.height - backButton.outerHeight - pageindicator.height,
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

							this.setStyle(
								'backgroundColor',
								Theme.getStyles( 'BaseFocus', 'backgroundColor' )
							);
						},
						onBlur: function() {
							this.title.animate( {
								duration: 0.3,
								scale: 1
							} );

							this.setStyle( 'backgroundColor', '#000000' );
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

		pageindicator.attachToSource( horizontalGrid );
	},

	updateView: function() {
		this.elements.horizontalGrid.changeDataset( [
			{ title: $_( 'Cell1' ) },
			{ title: $_( 'Cell2' ) },
			{ title: $_( 'Cell3' ) },
			{ title: $_( 'Cell4' ) },
			{ title: $_( 'Cell5' ) },
			{ title: $_( 'Cell6' ) }
		], true );
	}
} );
