define('MAF.dialogs.TextEntry', function () {
	return new MAF.Class({
		ClassName: 'TextEntryDialog',

		Extends: MAF.dialogs.BaseDialogImplementation,

		config: {
			title: '',
			message: '',
			callback: null,
			cancelCallback: null,
			maxLength: 99
		},
		
		initialize: function () {
			this.parent();
		},
		
		getDialogConfig: function() {
			return { type: 'textentry', conf: { maxLength: this.config.maxLength, 'ignoreBackKey': this.config.isModal, key: this.retrieve('key'), title: this.config.title, message: this.config.message } };
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
