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
 * @class MAF.control.PromptButton
 * @extends MAF.control.InputButton
 */
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
	ControlPromptButton: 'ControlButton',
	ControlPromptButtonSubline: 'ControlInputButtonSubline'
});
