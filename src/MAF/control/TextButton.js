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
			width: 'calc(100% - 20px)',
			height: 'inherit',
			hOffset: 10,
			anchorStyle: 'leftCenter',
			truncation: 'end'
		}
	}
});
