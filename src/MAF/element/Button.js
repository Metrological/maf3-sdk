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
 * @classdesc <p>This is a button component without styling.</p><p>This component extends from the MAF.element.Container and adds ability for securing the action behind onSelect.</p>
 * @class MAF.element.Button
 * @extends MAF.element.Container
 */
/**
 * @cfg {Boolean} focus Initializes the component with the ability to focus or not. Default is true (enabled focus).
 * @memberof MAF.element.Button
 */
/**
 * @cfg {Boolean} secure Indicates if the button is locked with an Admin PIN. Default is false.
 * @memberof MAF.element.Button
 */
/**
 * Fired when the component is secured and it fails to verify the security after a select.
 * @event MAF.element.Button#onSecureFailed
 */
define('MAF.element.Button', function () {
	function onSecureNeeded(event) {
		var config = this.config,
			method = 'verifySecure',
			callback = onSecureCallback.bindTo(this);
		callback.__event__ = event;
		if (config[method] && config[method].call) {
			config[method].call(this, callback);
		} else {
			this[method](callback);
		}
	}
	function onSecureCallback(result) {
		var event = arguments.callee.caller.__event__ || null;
		this.fire((Boolean(result) ? 'onSelect' : 'onSecureFailed'), null, event);
	}
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
		 * Gives a object containing values needed for keeping the state of this component between different views.
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
		 * Handle the state of this component for example when returning on the view it is on.
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
		 * Appends this component to a parent.
		 * @method MAF.element.Button#appendTo
		 * @return {Class} This component.
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
		 * <p>Change the disabled state of the component. A disabled component will not be able to recieve focus.</p><p>If not changed in extended component it will also set opacity to 05 when disabled.</p>
		 * @method MAF.element.Button#setDisabled
		 * @param {boolean} [disabled=false] True will disable the component, false will enable it. 
		 */
		setDisabled: function (disabled) {
			this.disabled = disabled === true;
			this.setStyle('opacity', this.disabled ? 0.5 : null);
			return this;
		},
		/**
		 * Toggle between the disable states of the component.
		 * @method MAF.element.Button#toggleDisabled
		 * @return {Class} This component.
		 */
		toggleDisabled: function () {
			this.setDisabled(!this.disabled);
			return this;
		},
		/**
		 * 
		 * @method MAF.element.Button#setSecure
		 * @param {boolean} secure
		 * @return {Class} This component.
		 */
		setSecure: function (secure) {
			secure = secure === true;
			this.secure = secure;
			this.fire('onChangeSecure', { secure: secure });
			return this;
		},
		/**
		 * Toggle between the secure states of the component.
		 * @method MAF.element.Button#toggleSecure
		 * @return {Class} This component.
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
