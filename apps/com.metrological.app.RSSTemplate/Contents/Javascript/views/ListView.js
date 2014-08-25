// Create a class and extended it from the MAF.system.SidebarView
var ListView = new MAF.Class({
	Extends: MAF.system.SidebarView,

	ClassName: 'ListView',

	initialize: function () {
		var view = this;
		view.parent();
		// Register MAF messages listener to view.dataHasChanged
		view.registerMessageCenterListenerCallback(view.dataHasChanged);
	},

	// Create your dataHasChanged function
	dataHasChanged: function (event) {
		var view = this,
			controls = view.controls;
		if (event.payload.key === 'MyFeedData') {
			if (event.payload.value.length > 0) {
				controls.grid.changeDataset(event.payload.value, true);
				controls.grid.visible = true;
				controls.grid.focus();
			} else {
				controls.grid.visible = false;
			}
		}
	},

	// Create your view template
	createView: function () {
		// Reference to the current view
		var view = this;

		// Create a Grid, by adding it into the view.controls object and
		// setting guid focus will be remembered when returning to the view 
		var controlGrid = view.controls.grid = new MAF.control.Grid({
			rows: 6,
			columns: 1,
			guid: 'myControlGrid',
			orientation: 'vertical',
			styles: {
				width: view.width - 20,
				height: view.height,
				visible: false
			},
			cellCreator: function () {
				// Create cells for the grid
				var cell = new MAF.control.GridCell({
					styles: this.getCellDimensions(),
					events: {
						onSelect: function () {
							// Load the ItemView when a cell is selected
							MAF.application.loadView('view-ItemView', {
								item: this.getCellDataItem()
							});
						}
					}
				});

				cell.title = new MAF.element.Text({
					visibleLines: 2,
					styles: {
						fontSize: 24,
						width: cell.width - 20,
						hOffset: 10,
						vOffset: 40,
						wrap: true,
						truncation: 'end'
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function (cell, data) {
				// Update cell when change dataset has been called
				cell.title.setText(data.title);
			}
		}).appendTo(view);

		// Create a scrolling indicator next to the grid to
		// indicate the position of the grid and ake it possible
		// to quickly skip between the pages of the grid
		var scrollIndicator = new MAF.control.ScrollIndicator({
			styles: {
				height: controlGrid.height,
				width: 20,
				hOffset: view.width - 20
			}
		}).appendTo(view);

		// Attach the scrollIndicator to the grid with news items
		scrollIndicator.attachToSource(controlGrid);
	},

	// When view is created or returning to view the view is updated
	updateView: function () {
		var view = this;
		if (view.backParams.reset !== false && !MAF.messages.exists('MyFeedData'))
			getData();
	},

	// When closing the application make sure you unreference you're objects and arrays
	// and clean the messages that the app has stored
	destroyView: function () {
		MAF.messages.reset();
	}
});
