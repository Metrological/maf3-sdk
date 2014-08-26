var SlideCarouselView = new MAF.Class({
	ClassName: 'SlideCarouselView',

	// Extend a FullscreenView instead of SidebarView
	Extends: MAF.system.FullscreenView,

	// Set background color of the view on initialize of the class
	initialize: function () {
		var view = this;
		view.parent(); // Call the super class, in this case the FullscreenView
		view.setStyle('backgroundColor', 'rgba(0, 0, 0, 0.8)');
	},

	createView: function () {
		var view = this;

		var backButton = new MAF.control.BackButton({
			label: $_('BACK'),
			styles: {
				vOffset: 50,
				paddingLeft: 50
			}
		}).appendTo(view);

		var slider = view.elements.slider = new MAF.element.SlideCarousel({
			visibleCells: 4,
			focusIndex: 1,
			slideDuration: 0.2,
			styles:{
				width: view.width + 80,
				height: 300,
				hOffset: 49,
				vOffset: view.height - 400
			},
			cellCreator: function () {
				var cell = new MAF.element.SlideCarouselCell({
					styles: this.getCellDimensions(),
					events: {
						onFocus: function () {
							this.title.animate({
								duration: 0.2,
								backgroundColor: Theme.getStyles('BaseFocus', 'backgroundColor')
							});
						},
						onBlur: function(){
							this.title.animate({
								duration: 0.2,
								backgroundColor: 'black'
							});
						}
					}
				});

				cell.title = new MAF.element.Text({
					styles: {
						width: cell.width,
						height: 300,
						hOffset: 20,
						vOffset: 20,
						color: '#f1f1f1',
						fontSize: 32,
						backgroundColor: 'black',
						paddingTop: 20,
						paddingLeft: 20
					}
				}).appendTo(cell);

				return cell;
			},
			cellUpdater: function(cell, data){
				cell.title.setText(data.title);
			},
			events: {
				onDatasetChanged: function(){
					this.getCurrentCell().focus();
					this.animate({
						opacity: 1,
						duration: 0.2
					});
				}
			}
		}).appendTo(view);
	},

	// After the update view the focus view is called
	focusView: function () {
		var view = this;
		view.elements.slider.changeDataset([
			{ title: $_('Cell1') },
			{ title: $_('Cell2') },
			{ title: $_('Cell3') },
			{ title: $_('Cell4') },
			{ title: $_('Cell5') },
			{ title: $_('Cell6') }
		], true);
	}
});
