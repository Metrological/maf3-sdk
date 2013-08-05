define('MAF.control.FixedTab', function () {
	return new MAF.Class({
		ClassName: 'ControlFixedTab',
		Extends: MAF.control.SingleTab,

		Protected: {
			createContent: function () {
				this.parent();

				this.right = new MAF.element.Text({
					anchorStyle: 'leftCenter',
					styles: {
						height: this.height,
						opacity: 0.7
					}
				}).appendTo(this);
			},

			alignArrows: function (curpage, pagecount) {
				var ts = this.text.element.getTextBounds(),
					options = this.getOptions();

				this.arrows.left.hOffset = this.config.arrowPadding;

				this.text.setStyles({
					width: ts.width,
					hOffset: this.arrows.left.hOffset + 10 + this.config.arrowPadding
				});
				this.arrows.right.hOffset = this.text.outerWidth + this.config.arrowPadding;
				this.right.setStyles({
					width: this.width - ((this.arrows.right.outerWidth || (this.arrows.right.hOffset + 32)) + this.config.arrowPadding),
					hOffset: (this.arrows.right.outerWidth + 10 || (this.arrows.right.hOffset + 32)) + this.config.arrowPadding
				});

				var label = '';
				if (options) {
					options.forEach(function(option, index) {
						if (index > curpage)
							label += option.label + this.textPadding;
					}, this);
					options.forEach(function(option, index) {
						if (index < curpage)
							label += option.label + this.textPadding;
					}, this);
				}
				this.right.setText(label);
			}
		},

		config: {
			optionsPadding: '    '
		},

		initialize: function () {
			this.parent();

			this.textPadding = this.config.optionsPadding.replace(/(?:(?:^ | $)|( ) )/gm, '&nbsp;');
		},

		suicide: function () {
			this.textPadding = null;

			this.right.suicide();
			delete this.right;

			this.parent();
		}
	});
}, {
	ControlFixedTab: 'ControlPageIndicator'
});
