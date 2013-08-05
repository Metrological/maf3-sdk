define('MAF.control.PromptButton', function () {
	return new MAF.Class({
		ClassName: 'ControlPromptButton',
		Extends: MAF.control.InputButton,
		
		config: {
			title: '',
			message: 'Please select an option:'
		},

		changeValue: function (change_callback, current_value) {
			var changer = function(result){
					change_callback(result.selected.value);
				},
				buttons = this.getOptions().slice(0,2).map(function(b){
					b.callback = changer;
					return b;
				});
			
			log('Dialogs not implemented yet');
			new MAF.dialogs.Alert({
				title: this.config.title || this.config.label,
				message: this.config.message,
				buttons: buttons
			}).show();
		}
	});
}, {
	ControlPromptButton: 'ControlButton'
});
