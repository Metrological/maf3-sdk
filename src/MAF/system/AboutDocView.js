define('MAF.system.AboutDocView', function () {
	return new MAF.Class({
		ClassName: 'AboutDocView',
		Extends: MAF.system.SidebarView,

		config: {
			data: {
				backLabel: 'Back'
			}
		},

		createView: function () {
			this.controls.backButton = new MAF.control.BackButton({
				guid: this._classId + '.BackButton',
				label: this.config.data.backLabel
			}).appendTo(this);

			this.controls.pageIndicator = new MAF.control.PageIndicator({
				guid: this._classId + '.PageIndicator',
				styles: {
					width: this.width,
					vAlign: 'bottom'
				}
			}).appendTo(this);

			this.elements.textGrid = new MAF.element.TextGrid({
				ClassName: 'AboutDocViewTextGrid',
				styles: {
					width: this.width - 10,
					height: this.height - (this.controls.pageIndicator.height + this.controls.backButton.height) - 10,
					vOffset: this.controls.backButton.outerHeight,
					anchorStyle: 'justify'
				}
			}).appendTo(this).attachAccessories(this.controls.pageIndicator);
		},

		updateView: function () {
			this.elements.textGrid.setText(this.config.data.value);
		}
	});
}, {
	'AboutDocViewTextGrid': {
		styles: {
			fontSize: 22,
			color: '#FFFFFF',
			padding: 5,
			wrap: true
		}
	}
});
