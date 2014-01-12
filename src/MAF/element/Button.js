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
 * @class MAF.element.Button
 * @extends MAF.element.Container
 */
/**
 * Fired when the component is secured and it fails to verify the security after a select.
 * @event MAF.element.Button#onSecureFailed
 */
define('MAF.element.Button', function () {
	var onSecureNeeded = function (event) {
		var config = this.config,
			method = 'verifySecure',
			callback = onSecureCallback.bindTo(this);
		callback.__event__ = event;
		if (config[method] && config[method].call) {
			config[method].call(this, callback);
		} else {
			this[method](callback);
		}
	};

	var onSecureCallback = function (result) {
		var event = arguments.callee.caller.__event__ || null;
		this.fire((Boolean(result) ? 'onSelect' : 'onSecureFailed'), null, event);
	};

	return new MAF.Class({
		ClassName: 'BaseButton',

		Extends: MAF.element.Container,

		Protected: {
			dispatchEvents: function (event, payload) {
				switch(event.type) {
					case 'select':
						if (this.secure) {
							return onSecureNeeded.call(this, event);
						}
						break;
				}
				this.parent(event, payload);
			}
		},

		config: {
			focus: true,
			secure: false
		},

		initialize: function () {
			this.parent();

			this.setDisabled(this.config.enabled === false || this.config.disabled === true);
			delete this.config.enabled;
			delete this.config.disabled;

			this.setSecure(this.config.secure);
			delete this.config.secure;
		},
		/**
		 * 
		 * @method MAF.element.Button#generateStatePacket
		 * @private
		 */
		generateStatePacket: function (packet) {
			return Object.merge({
				focused: this.element.hasFocus,
				disabled: this.disabled,
				secure: this.secure
			}, packet || {});
		},
		/**
		 * 
		 * @method MAF.element.Button#inspectStatePacket
		 */
		inspectStatePacket: function (packet, focusOnly) {
			if (!this.config.guid) {
				return packet;
			}
			if (packet && !(this.config.guid in packet)) {
				return packet;
			}
			var data = packet && packet[this.config.guid],
				type = typeOf(data);
			if (type === 'object') {
				if (focusOnly) {
					if (data.focused) {
						this.focus();
					}
				} else if (data) {
					Object.forEach(data, function (item) {
						switch (item) {
							case 'disabled':
								if (data[item]) {
									this.setDisabled(true);
								}
								break;
							case 'secure':
								if (data[item]) {
									this.setSecure(true);
								}
								break;
							case 'label':
								if (this.setText && data[item]) {
									this.setText(data[item]);
								}
								break;
						}
					}, this);
				}
			}
			return data;
		},
		/**
		 * 
		 * @method MAF.element.Button#appendTo
		 */
		appendTo: function (parent) {
			var appended = this.parent(parent);
			if (appended && this.getSubscriberCount('onBroadcast')) {
				var view = this.getView();
				if (view) {
					view.registerMessageCenterListenerControl(this);
				}
			}
			return this;
		},
		/**
		 * 
		 * @method MAF.element.Button#setDisabled
		 */
		setDisabled: function (disabled) {
			this.disabled = disabled === true;
			this.setStyle('opacity', this.disabled ? 0.5 : null);
			return this;
		},
		/**
		 * 
		 * @method MAF.element.Button#toggleDisabled
		 */
		toggleDisabled: function () {
			this.setDisabled(!this.disabled);
			return this;
		},
		/**
		 * 
		 * @method MAF.element.Button#setSecure
		 * @param {boolean} secure
		 */
		setSecure: function (secure) {
			secure = secure === true;
			this.secure = secure;
			this.fire('onChangeSecure', { secure: secure });
			return this;
		},
		/**
		 * 
		 * @method MAF.element.Button#toggleSecure
		 */
		toggleSecure: function () {
			return this.setSecure(!this.secure);
		},
		/**
		 * 
		 * @method MAF.element.Button#verifySecure
		 */
		verifySecure: function (verify) {
			var result = true;
			verify(result);
		}
	});
});
