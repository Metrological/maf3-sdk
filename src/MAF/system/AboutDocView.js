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
				guid: this._classID + '.BackButton',
				label: this.config.data.backLabel
			}).appendTo(this);

			this.controls.pageIndicator = new MAF.control.PageIndicator({
				guid: this._classID + '.PageIndicator',
				styles: {
					width: this.width,
					vAlign: 'bottom'
				}
			}).appendTo(this);

			var margin = Theme.getStyles('AboutDocViewTextGrid', 'margin');
			this.elements.textGrid = new MAF.element.TextGrid({
				ClassName: 'AboutDocViewTextGrid',
				styles: {
					width: this.width - (margin * 2),
					height: this.height - (this.controls.pageIndicator.height + this.controls.backButton.height) - (margin * 2),
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
	AboutDocViewTextGrid: {
		styles: {
			fontSize: 22,
			color: '#FFFFFF',
			margin: 7,
			wrap: true
		}
	}
});
