// Create a class and extended it from the MAF.system.SidebarView
var ControlGridView = new MAF.Class( {
	ClassName: 'ControlGridView',

	Extends: MAF.system.SidebarView,

	// Create the view template
	createView: function() {
		var backButton = new MAF.control.BackButton().appendTo( this );

		// Create a Grid, by adding it into the view.controls object and
		// setting guid focus will be remembered when returning to the view
		this.controls.controlGrid = new MAF.control.Grid( {
			guid: 'myControlGrid',
			rows: 2,
			columns: 2,
			styles: {
				width: this.width,
				height: this.height - backButton.outerHeight,
				vOffset: backButton.outerHeight
			},
			cellCreator: function() {
				// Create cells for the grid
				var cell = new MAF.control.GridCell( {
					styles: this.getCellDimensions(),
					events: {
						onSelect: function () {
							log( 'onSelect function GridCell', this.getCellIndex() );
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
				// Update cell when change dataset has been called
				cell.title.setText( data.title );
			}
		} ).appendTo( this );
	},

	// When view is created or returning to view the view is updated
	updateView: function() {
		if ( !this.firstTime ) {
			this.firstTime = true;

			// Update grid with an example dataset
			this.controls.controlGrid.changeDataset( [
				{ title: $_( 'Cell1' ) },
				{ title: $_( 'Cell2' ) },
				{ title: $_( 'Cell3' ) },
				{ title: $_( 'Cell4' ) }
			], true );
		}
	}
} );
