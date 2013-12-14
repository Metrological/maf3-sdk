/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2013  Metrological
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/
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
