define('MAF.element.Button', function () {
	var onSecureNeeded = function (nodeEvent) {
		var config = this.config,
			method = 'verifySecure',
			callback = onSecureCallback.bindTo(this);
		callback.__event__ = nodeEvent;
		if (config[method] && config[method].call) {
			config[method].call(this, callback);
		} else {
			this[method](callback);
		}
	};

	var onSecureCallback = function (result) {
		var nodeEvent = arguments.callee.caller.__event__ || null;
		this.fire((Boolean(result) ? 'onSelect' : 'onSecureFailed'), null, nodeEvent);
	};

	return new MAF.Class({
		ClassName: 'BaseButton',

		Extends: MAF.element.Container,

		Protected: {
			dispatcher: function (nodeEvent, payload) {
				switch(nodeEvent.type) {
					case 'select':
						if (this.secure) {
							return onSecureNeeded.call(this, nodeEvent);
						}
						break;
				}
				this.parent(nodeEvent, payload);
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

		generateStatePacket: function (packet) {
			return Object.merge({
				focused: this.element.hasFocus,
				disabled: this.disabled,
				secure: this.secure
			}, packet || {});
		},

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

		appendTo: function (parent) {
			var appended = this.parent(parent);
			if (appended && this.getSubscriberCount('onBroadcast')) {
				var view = this.getViewController();
				if (view) {
					view.registerMessageCenterListenerControl(this);
				}
			}
			return this;
		},

		setDisabled: function (value) {
			if (value === true && this.disabled !== true) {
				this.disabled = true;
				this.setStyle('opacity', 0.5);
				this.fire('onDisable');
				this.fire('onChangeDisabled', {disabled: true});
			} else if (value === false && this.disabled !== false) {
				this.disabled = false;
				this.setStyle('opacity', null);
				this.fire('onEnable');
				this.fire('onChangeDisabled', {disabled: false});
			}
			if (this.disabled === this.element.wantsFocus && this.config.focus) {
				this.element.wantsFocus = !this.disabled;
			}
			return this;
		},

		toggleDisabled: function () {
			this.setDisabled(!this.disabled);
			return this;
		},

		setSecure: function (secure) {
			secure = secure === true;
			this.secure = secure;
			this.fire('onChangeSecure', { secure: secure });
			return this;
		},

		toggleSecure: function () {
			return this.setSecure(!this.secure);
		},

		verifySecure: function (verify) {
			var result = true;
			verify(result);
		}
	});
});
