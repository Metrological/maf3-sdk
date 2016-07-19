/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2014  Metrological
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
/**
 * @class MAF.dialogs.Alert
 * @extends MAF.dialogs.BaseDialogImplementation
 */
/**
 * @cfg {String} title Title of the dialog.
 * @memberof MAF.dialogs.Alert
 */
 /**
 * @cfg {String} message Message to be displayed inside the dialog.
 * @memberof MAF.dialogs.Alert
 */
 /**
 * @cfg {Array} buttons Array of Objects with label and callback keys. Where label is a string and callback a function to execute.
 * @memberof MAF.dialogs.Alert
 */
 /**
 * @cfg {Function} cancelCallback Function to call on cancelation of dialog.
 * @memberof MAF.dialogs.Alert
 */
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
