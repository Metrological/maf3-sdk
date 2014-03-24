var TestView10 = new MAF.Class({
	ClassName: 'TestView10',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		this.parent();
	},

	createView: function () {
		var back = new MAF.control.BackButton({
		}).appendTo(this);

		this.elements.carousel = new MAF.element.Carousel({
			rows: 1,
			columns: 2,
			carousel: true,
			dataSet: [
				{key:1,value:1},
				{key:2,value:2},
				{key:3,value:3},
				{key:4,value:4},
				{key:5,value:5},
				{key:6,value:6}
			],
			cellCreator: function () {
				var cell = new MAF.element.CarouselCell({
					styles: this.getCellDimensions(),
					events: {
						onFocus: function () {
							this.setStyle('backgroundColor', 'red');
						},
						onBlur: function () {
							this.setStyle('backgroundColor', null);
						}
					}
				});
				return cell;
			},
			cellUpdater: function (cell, data) {
			},
			styles: {
				width: this.width,
				height: this.height - back.height,
				vOffset: back.outerHeight
			}
		}).appendTo(this);
	}
});
