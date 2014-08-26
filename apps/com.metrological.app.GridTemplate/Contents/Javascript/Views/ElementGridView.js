var ElementGridView = new MAF.Class({
	ClassName: 'ElementGridView',

	Extends: MAF.system.SidebarView,

	createView: function () {
		var view = this;

		var backButton = new MAF.control.BackButton({
			label: $_('BACK')
		}).appendTo(view);

		// In the ControlGridView.js example their is a guid, when guid is not needed
		// but the element needs to be accessed outside the create view function
		// you can reference elements in the view.elements object
		var elementGrid = view.elements.elementGrid = new MAF.element.Grid({
			rows: 2,
			columns: 2,
			styles: {
				width: view.width,
				height: view.height - backButton.outerHeight,
				vOffset: backButton.outerHeight
			},
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: this.getCellDimensions(),
					events:{
						onSelect: function () {
							log('onSelect function GridCell', this.getCellIndex());
						},
						onFocus: function () {
							if (this.getCellIndex() === 1 || this.getCellIndex() === 2) {
								this.animate({
									backgroundImage: 'Images/focus.png',
									backgroundRepeat: 'repeat-x',
									duration: 0.3,
									scale: 1.2
								});
							} else {
								this.animate({
									backgroundColor: 'white',
									duration: 0.3,
									scale: 1.2
								});
								this.title.animate({
									duration: 0.3,
									color: 'black'
								});
							}
						},
						onBlur: function () {
							if (this.getCellIndex() === 1 || this.getCellIndex() === 2) {
								this.animate({
									backgroundImage: null,
									duration: 0.3,
									scale: 1.0
								});
							} else {
								this.animate({
									backgroundColor: null,
									duration: 0.3,
									scale: 1.0
								});
								this.title.animate({
									duration: 0.3,
									color: 'white'
								});
							}
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
	},

	updateView: function () {
		var view = this;
		view.elements.elementGrid.changeDataset([
			{ title: $_('Cell1') },
			{ title: $_('Cell2') },
			{ title: $_('Cell3') },
			{ title: $_('Cell4') }
		], true);
	}
});
