define('MAF.control.BackButton', function () {
	return new MAF.Class({
		ClassName: 'ControlBackButton',

		Extends: MAF.control.Button,

		Protected: {
			dispatchEvents: function (event, payload) {
				switch(event.type) {
					case 'select':
						if (this.fire('onSelect', payload, event)) {
							MAF.application.previousView(this.config.backParams || {});
						}
						break;
					default:
						this.parent(event, payload);
						break;
				}
			}
		},

		createContent: function () {
			this.content = [
				new MAF.element.Text({
					ClassName: 'ControlBackButtonIcon',
					label: FontAwesome.get('undo')
				}).appendTo(this),
				new MAF.element.Text({
					ClassName: 'ControlBackButtonText',
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
