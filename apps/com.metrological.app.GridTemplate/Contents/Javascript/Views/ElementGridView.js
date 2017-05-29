var ElementGridView = new MAF.Class( {
	ClassName: 'ElementGridView',

	Extends: MAF.system.SidebarView,

	createView: function() {
		var backButton = new MAF.control.BackButton( {
			label: $_( 'BACK' )
		} ).appendTo( this );

		// In the ControlGridView.js example their is a guid, when guid is not needed
		// but the element needs to be accessed outside the create view function
		// you can reference elements in the view.elements object
		this.elements.elementGrid = new MAF.element.Grid( {
			rows: 2,
			columns: 2,
			styles: {
				width: this.width,
				height: this.height - backButton.outerHeight,
				vOffset: backButton.outerHeight
			},
			cellCreator: function() {
				var cell = new MAF.element.GridCell( {
					styles: this.getCellDimensions(),
					events: {
						onSelect: function() {
							log( 'onSelect function GridCell', this.getCellIndex() );
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
	},

	updateView: function() {
		this.elements.elementGrid.changeDataset( [
			{ title: $_( 'Cell1' ) },
			{ title: $_( 'Cell2' ) },
			{ title: $_( 'Cell3' ) },
			{ title: $_( 'Cell4' ) }
		], true );
	}
});
