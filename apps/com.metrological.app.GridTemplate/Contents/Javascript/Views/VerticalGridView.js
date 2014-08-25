var VerticalGridView = new MAF.Class({
	ClassName: 'VerticalGridView',

	Extends: MAF.system.SidebarView,

	// Add array of items on constructor of the class
	initialize: function () {
		var view = this;
		view.parent();
		view.items = [
			{title: "Cell 1"},
			{title: "Cell 2"},
			{title: "Cell 3"},
			{title: "Cell 4"},
			{title: "Cell 5"},
			{title: "Cell 6"}
		];
	},

	createView: function () {
		var view = this;

		var backButton = new MAF.control.BackButton({
			label: $_('BACK')
		}).appendTo(view);

		var scroller = new MAF.control.ScrollIndicator({
			theme: false,
			styles: {
				width: 23,
				height: view.height - backButton.outerHeight,
				vOffset: backButton.outerHeight,
				hAlign: 'right'
			},
			events:{
				onFocus: function () {
					this.setStyle('backgroundColor', Theme.getStyles('BaseFocus', 'backgroundColor'));
				},
				onBlur: function () {
					this.setStyle('backgroundColor', null);
				}
			}
		}).appendTo(view);

		var verticalGrid = view.elements.verticalGrid = new MAF.element.Grid({
			rows: 2,
			columns: 1,
			orientation: 'vertical',
			styles: {
				width: view.width - scroller.width,
				height: view.height - backButton.outerHeight,
				vOffset: backButton.outerHeight
			},
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: this.getCellDimensions(),
					events:{
						onSelect: function () {
							log('onSelect GridCell', this.getCellIndex());
						},
						onFocus: function () {
							this.animate({
								backgroundColor: '#8101b1',
								duration: 0.3,
								scale: 1.2
							});
						},
						onBlur: function () {
							this.animate({
								backgroundColor: null,
								duration: 0.3,
								scale: 1.0
							});
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
				cell.title.setText(data.title);
			}
		}).appendTo(view);

		scroller.attachToSource(verticalGrid);
	},

	updateView: function () {
		var view = this;
		view.elements.verticalGrid.changeDataset(view.items);
	},

	// When closing the application make sure you unreference 
	// your objects and arrays from the view
	destroyView: function () {
		var view = this;
		delete view.items;
	}
});
