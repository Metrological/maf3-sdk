define('MAF.dialogs.VerifyPin', function () {
	return new MAF.Class({
		ClassName: 'VerifyPinDialog',

		Extends: MAF.dialogs.BaseDialogImplementation,

		config: {
			title: '',
			message: '',
			errorMessage: '',
			type: 'adult', // adult, master, youth, purchase, passport
			profileId: null,
			forgotPinCallback: null,
			callback: null,
			cancelCallback: null
		},

		initialize: function () {
			this.parent();
		},

		getDialogConfig: function() {
			return {
				type: 'pin',
				conf: {
					key: this.retrieve('key'),
					title: this.config.title,
					message: this.config.message,
					errorMessage: this.config.errorMessage,
					type: this.config.type,
					profileId: this.config.profileId,
					ignoreBackKey: this.config.isModal
				}
			};
		},

		handleCallback: function(response) {
			if (response.cancelled) {
				if (this.config.cancelCallback && this.config.cancelCallback.call) {
					this.config.cancelCallback(response);
				}
			} else if (response.forgot) {
				if (this.config.forgotPinCallback && this.config.forgotPinCallback.call) {
					this.config.forgotPinCallback(response);
				}
			} else {
				if (this.config.callback && this.config.callback.call) {
					this.config.callback(response);
				}
			}
		}
	});
});
