define('MAF.control.BackButton', function () {
	return new MAF.Class({
		ClassName: 'ControlBackButton',

		Extends: MAF.control.Button,

		Protected: {
			dispatcher: function (nodeEvent, payload) {
				switch(nodeEvent.type) {
					case 'select':
						if (this.fire('onSelect', payload, nodeEvent)) {
							MAF.application.previousView();
						}
						break;
					default:
						this.parent(nodeEvent, payload);
						break;
				}
			}
		},

		createContent: function () {
			this.content = [
				new MAF.element.Text({
					ClassName: (this.config.ClassName || this.ClassName) + 'Icon',
					label: '&#x21A9;'
				}).appendTo(this),
				new MAF.element.Text({
					ClassName: (this.config.ClassName || this.ClassName) + 'Text',
					label: this.config.label || widget.getLocalizedString('BACK'),
					styles: this.config.textStyles
				}).appendTo(this)
			];
		},

		setText: function (text) {
			this.content[1].setText(text);
		}
	});
}, {
	ControlBackButton: 'ControlButton',
	ControlBackButtonIcon: {
		styles: {
			width: 60,
			height: 'inherit',
			fontSize: 24,
			paddingTop: 3,
			anchorStyle: 'center'
		}
	},
	ControlBackButtonText: {
		styles: {
			width: 'inherit',
			height: 'inherit',
			paddingLeft: 60,
			fontSize: 24,
			anchorStyle: 'leftCenter',
			truncation: 'end'
		}
	}
});
