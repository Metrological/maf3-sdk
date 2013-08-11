define('MAF.control.PromptButton', function () {
	return new MAF.Class({
		ClassName: 'ControlPromptButton',

		Extends: MAF.control.InputButton,

		config: {
			title: '',
			message: 'Please select an option:'
		},

		changeValue: function (callback, value) {
			var changer = function (result) {
					callback(result.selected.value);
				},
				buttons = this.getOptions().slice(0,2).map(function (b) {
					b.callback = changer;
					return b;
				});
			new MAF.dialogs.Alert({
				title: this.config.title || this.config.label,
				message: this.config.message,
				buttons: buttons,
				focusOnCompletion: this
			}).show();
		}
	});
}, {
	ControlPromptButton: 'ControlButton'
});
