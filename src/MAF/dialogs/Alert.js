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
			this._callbacks = {};
			this._buttons   = [];
			this._configs = {};
			
			var self = this;
			if (this.config.buttons && this.config.buttons instanceof Array) {
				[].concat(this.config.buttons).forEach(function(button) {
					var value = md5(button.label + '100');//animator.milliseconds.toString());
					if (button.callback && button.callback.call) {
						self._callbacks[value] = button.callback;
					}
					self._buttons.push({ value: value, label: button.label });
					self._configs[value] = button;
				});
			} else {
				throw new Error("Can't create an alert without any buttons");
			}
		},
		
		getDialogConfig: function() {
			return { 'type': 'alert', 'conf': { 'ignoreBackKey': this.config.isModal, 'key': this._key, 'title': this.config.title, 'message': this.config.message, 'buttons': this._buttons } };
		},
		
		handleCallback: function (response) {
			var selectedValue = response.selectedValue,
				callback = this._callbacks[selectedValue],
				config = this._configs[selectedValue],
				packet = { selected: config };

			if (response.cancelled) {
				if (this.config.cancelCallback && this.config.cancelCallback.call) {
					this.config.cancelCallback(packet);
				}
			} else {
				if (callback && callback.call) {
					callback(packet);
				}
			}
		}
	});
});
