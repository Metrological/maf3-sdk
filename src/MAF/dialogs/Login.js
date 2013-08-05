define('MAF.dialogs.Login', function () {
	return new MAF.Class({
		ClassName: 'LoginDialog',
		
		Extends: MAF.dialogs.BaseDialogImplementation,

		config: {
			title: '',
			message: '',
			callback: null,
			cancelCallback: null
		},
		
		initialize: function () {
			this.parent();
		},
		
		getDialogConfig: function() {
			return { type: 'login', conf: { 'ignoreBackKey': this.config.isModal, key: this._key, title: this.config.title, message: this.config.message } };
		},

		handleCallback: function (response) {
			if (response.cancelled) {
				if (this.config.cancelCallback && this.config.cancelCallback.call) {
					this.config.cancelCallback(response);
				}
			} else {
				if (this.config.callback && this.config.callback.call) {
					this.config.callback(response);
				}
			}
		}
	});
});
