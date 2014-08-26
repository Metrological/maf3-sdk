// Create a class and extended it from the MAF.system.SidebarView
var ControlGridView = new MAF.Class({
	ClassName: 'ControlGridView',

	Extends: MAF.system.SidebarView,

	// Create the view template
	createView: function () {
		var view = this;

		var backButton = new MAF.control.BackButton({
			label: $_('BACK')
		}).appendTo(view);

		// Create a Grid, by adding it into the view.controls object and
		// setting guid focus will be remembered when returning to the view 
		var controlGrid = view.controls.controlGrid = new MAF.control.Grid({
			guid: 'myControlGrid',
			rows: 2,
			columns: 2,
			styles: {
				width: view.width,
				height: view.height - backButton.outerHeight,
				vOffset: backButton.outerHeight
			},
			cellCreator: function () {
				// Create cells for the grid
				var cell = new MAF.control.GridCell({
					styles: this.getCellDimensions(),
					events:{
						onSelect: function () {
							log('onSelect function GridCell', this.getCellIndex());
						}
					}
				});

				cell.title = new MAF.element.Text({
					styles: {
						width: cell.width,
						height: cell.height,
						color: 'white',
						fontSize: 30,
						anchorStyle: 'center',
						wrap: true
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function (cell, data) {
				// Update cell when change dataset has been called
				cell.title.setText(data.title);
			}
		}).appendTo(view);
	},

	// When view is created or returning to view the view is updated
	updateView: function () {
		var view = this;
		if (!view.firstTime) {
			view.firstTime = true;
			// Update grid with an example dataset
			view.controls.controlGrid.changeDataset([
				{ title: $_('Cell1') },
				{ title: $_('Cell2') },
				{ title: $_('Cell3') },
				{ title: $_('Cell4') }
			], true);
		}
	},

	// The destroy view is called when the application is closed
	destroyView: function () {
		var view = this;
		// As an example unreference firstTime attribute from the view
		delete view.firstTime;
	}
});
