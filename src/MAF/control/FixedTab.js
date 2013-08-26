define('MAF.control.FixedTab', function () {
	return new MAF.Class({
		ClassName: 'ControlFixedTab',

		Extends: MAF.control.SingleTab,

		Protected: {
			createContent: function () {
				this.right = new MAF.element.Text({
					styles: Object.merge({
						height: this.height,
						anchorStyle: 'leftCenter',
						opacity: 0.7
					}, this.config.textStyles || {})
				}).appendTo(this);
				this.parent();
			}
		},

		config: {
			optionsPadding: '    '
		},

		initialize: function () {
			this.parent();
			this.textPadding = this.config.optionsPadding.replace(/(?:(?:^ | $)|( ) )/gm, '&nbsp;');
		},

		update: function (state) {
			this.parent(state);
			var ts = this.content.element.getTextBounds(),
				options = this.getOptions(),
				curpage = options.map(function (o) {
					return o.value;
				}).indexOf(this.getValue());
			this.content.setStyles({
				width: ts.width,
				hOffset: 10
			});
			var offset = this.content.outerWidth + 10;
			this.right.setStyles({
				width: this.width - offset - 10,
				hOffset: offset
			});
			var label = '';
			if (options) {
				options.forEach(function (option, index) {
					if (index > curpage)
						label += option.label + this.textPadding;
				}, this);
				options.forEach(function (option, index) {
					if (index < curpage)
						label += option.label + this.textPadding;
				}, this);
			}
			this.right.setText(label);
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
