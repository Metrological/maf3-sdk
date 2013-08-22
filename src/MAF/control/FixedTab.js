define('MAF.control.FixedTab', function () {
	return new MAF.Class({
		ClassName: 'ControlFixedTab',

		Extends: MAF.control.SingleTab,

		Protected: {
			createContent: function () {
				this.right = new MAF.element.Text({
					anchorStyle: 'leftCenter',
					styles: Object.merge({
						height: this.height,
						opacity: 0.7
					}, this.config.textStyles || {})
				}).appendTo(this);
				this.parent();
			},

			alignArrows: function (curpage, pagecount) {
				var ts = this.text.element.getTextBounds(),
					options = this.getOptions(),
					padding = this.config.arrowPadding,
					arrows = this.arrows;
				arrows.left.hOffset = padding;
				this.text.setStyles({
					width: ts.width,
					hOffset: arrows.left.outerWidth + 10 + padding
				});
				arrows.right.hAlign = null;
				arrows.right.hOffset = this.text.outerWidth + padding;
				var rightOffset = arrows.right.outerWidth + 10 + padding;
				this.right.setStyles({
					width: this.width - rightOffset,
					hOffset: rightOffset
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
			delete this.textPadding;
			this.right.suicide();
			delete this.right;
			this.parent();
		}
	});
}, {
	ControlFixedTab: 'ControlPageIndicator'
});
