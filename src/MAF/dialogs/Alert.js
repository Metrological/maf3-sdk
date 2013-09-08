define('MAF.dialogs.Alert', function () {
	return new MAF.Class({
		ClassName: 'AlertDialog',

		Extends: MAF.dialogs.BaseDialogImplementation,

		config: {
			title:   '',
			message: '',
			buttons: [],
			cancelCallback: null
		},

		initialize: function () {
			this.parent();
			var buttons = [],
				configs = {};
			if (this.config.buttons && this.config.buttons instanceof Array) {
				[].concat(this.config.buttons).forEach(function(button) {
					var value = md5(button.label + Date.now());
					if (button.callback && button.callback.call) {
						this.store(value, button.callback);
					}
					buttons.push({ value: value, label: button.label });
					configs[value] = button;
				}, this);
				this.store('configs', configs);
				this.store('buttons', buttons);
			} else {
				throw new Error("Can't create an alert without any buttons");
			}
			delete this.config.buttons;
		},

		getDialogConfig: function() {
			return { 'type': 'alert', 'conf': { 'ignoreBackKey': this.config.isModal, 'key': this.retrieve('key'), 'title': this.config.title, 'message': this.config.message, 'buttons': this.retrieve('buttons') } };
		},

		handleCallback: function (response) {
			var selectedValue = response.selectedValue,
				callback = this.retrieve(selectedValue),
				config = this.retrieve('configs'),
				packet = { selected: config[selectedValue] || {} };
			if (response.cancelled) {
				if (this.config.cancelCallback && this.config.cancelCallback.call) {
					this.config.cancelCallback.call(this, packet);
				}
			} else {
				if (callback && callback.call) {
					callback.call(this, packet);
				}
			}
		}
	});
});
