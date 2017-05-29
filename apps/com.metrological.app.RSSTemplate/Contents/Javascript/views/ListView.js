// Create a new View class and extended it from the MAF.system.SidebarView
var ListView = new MAF.Class( {
	Extends: MAF.system.SidebarView,

	ClassName: 'ListView',

	initView: function() {
		// Register MAF messages listener to view.dataHasChanged
		this.registerMessageCenterListenerCallback( this.dataHasChanged );
	},

	// Create your dataHasChanged function
	dataHasChanged: function( event ) {
		var controls = this.controls;

		if ( event.payload.key !== 'MyFeedData' ) return;

		if ( event.payload.value.length > 0 ) {
			controls.grid.changeDataset( event.payload.value, true );
			controls.grid.visible = true;
			return controls.grid.focus();
		}

		controls.grid.visible = false;
	},

	// Create your view template
	createView: function() {
		// Create a Grid, by adding it into the view.controls object and
		// setting guid focus will be remembered when returning to the view
		var controlGrid = this.controls.grid = new MAF.control.Grid( {
			rows: 6,
			columns: 1,
			guid: 'myControlGrid',
			orientation: 'vertical',
			styles: {
				width: this.width - 20,
				height: this.height,
				visible: false
			},
			cellCreator: function() {
				// Create cells for the grid
				var cell = new MAF.control.GridCell( {
					styles: this.getCellDimensions(),
					events: {
						onSelect: function() {
							// Load the ItemView when a cell is selected
							MAF.application.loadView( 'Item', {
								item: this.getCellDataItem()
							} );
						}
					}
				} );

				cell.title = new MAF.element.Text( {
					visibleLines: 2,
					styles: {
						fontSize: 24,
						width: cell.width - 20,
						hOffset: 10,
						vOffset: 40,
						wrap: true,
						truncation: 'end'
					}
				} ).appendTo( cell );

				return cell;
			},
			cellUpdater: function( cell, data ) {
				// Update cell when change dataset has been called
				cell.title.setText( data.title );
			}
		} ).appendTo( this );

		// Create a scrolling indicator next to the grid to
		// indicate the position of the grid and ake it possible
		// to quickly skip between the pages of the grid
		var scrollIndicator = new MAF.control.ScrollIndicator( {
			styles: {
				height: controlGrid.height,
				width: 20,
				hOffset: this.width - 20
			}
		} ).appendTo( this );

		// Attach the scrollIndicator to the grid with news items
		scrollIndicator.attachToSource( controlGrid );
	},

	// When view is created or returning to view the view is updated
	updateView: function() {
		if ( this.backParams.reset !== false && !MAF.messages.exists( 'MyFeedData' ) )
			getData();
	},

	// When closing the application make sure you unreference your objects and arrays
	// and clean the messages that the app has stored
	destroyView: function() {
		MAF.messages.reset();
	}
});
