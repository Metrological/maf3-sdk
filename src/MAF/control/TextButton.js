define('MAF.control.TextButton', function () {
	return new MAF.Class({
		ClassName: 'ControlTextButton',

		Extends: MAF.control.Button,

		createContent: function () {
			this.content = new MAF.element.Text({
				ClassName: (this.config.ClassName || this.ClassName) + 'Text',
				label: this.config.label,
				styles: this.config.textStyles
			}).appendTo(this);
		},

		setText: function (text) {
			this.content.setText(text);
		}
	});
}, {
	ControlTextButton: 'ControlButton',
	ControlTextButtonText: {
		styles: {
			width: '100%',
			height: 'inherit',
			paddingLeft: 10,
			paddingRight: 10,
			anchorStyle: 'leftCenter',
			truncation: 'end'
		}
	}
});
