define('MAF.control.Keyboard', function () {
	var appendHandler = function (event) {
		if (this.config.embedded) {
			var view = this.getView();
			if (view && view.owner) {
				handleKeyboardInputHide.subscribeTo(this, 'onHideView', this);
				handleKeyboardInputUpdate.subscribeTo(this, 'onUpdateView', this);
			}
		}
	};
	var handleKeyboardInputHide = function () {
		KeyboardInput.setRemoteKeyboard(false);
	};
	var handleKeyboardInputUpdate = function () {
		KeyboardInput.setRemoteKeyboard(true);
	};
	var createKeyboard = function () {
		this._repeaters = {
			valueChanged: (function(){
				this.fire('onValueChanged',{ value: this.getValue() });
			}).bindTo(this),
			maxLengthExceeded: (function(){
				this.fire('onMaxLengthExceeded');
			}).bindTo(this),
			keyDown: (function(evt){
				this.fire('onKeyDown', evt, evt.type ? evt : null);
			}).bindTo(this)
		};

		// @TODO replace container with the keyboard
		this.__keyboard = new MAF.keyboard.ReuseKeyboard({
			focus:            this.config.focus,
			autoAdjust:       true,
			allowSpace:       this.config.allowSpace,
			maxLength:        this.config.maxLength,
			controlSize:      this.config.controlSize,
			startShifted:     this.config.startShifted,
			startExtended:    this.config.startExtended,
			startFocused:     this.config.startFocused,
			layout:           this.config.layout,
			availableLayouts: this.config.availableLayouts,
			wrapNavigation:   this.config.wrapNavigation
		});

		this.__keyboard.element.hAlign = 'center';
		this.__keyboard.element.owner = this;
		this.__keyboard.appendTo(this.element);
		this.setStyle('height', this.__keyboard.element.height);

		this.__keyboard.onValueChanged = this._repeaters.valueChanged;
		this.__keyboard.onMaxLengthExceeded = this._repeaters.maxLengthExceeded;
		this.__keyboard.onKeyDown = this._repeaters.keyDown;
	};

	return new MAF.Class({
		ClassName: 'ControlKeyboard',
		Extends: MAF.element.Container,

		config: {
			embedded: true,
			focus: true,
			controlSize: 'standard',
			autoAdjust: true,
			allowSpace: true,
			maxLength: 99,
			startShifted: false,
			wrapNavigation: true
		},

		Protected: {
			dispatcher: function (nodeEvent, payload) {
				switch(nodeEvent.type) {
					case 'focus':
						if (this.config.embedded) {
							//KeyboardInput.setRemoteKeyboard(true);
						}
						//this.element.wantsFocus = false;
						//this.toggleShift();
						this.focus();

						break;
					case 'blur':
						if (this.config.embedded) {
							//KeyboardInput.setRemoteKeyboard(false);
						}
						break;
				}
			},
			generateStatePacket: function (packet) {
				return Object.merge({ value: this.getValue(), focused: this.__keyboard.element.hasFocus }, packet);
			},
			inspectStatePacket: function (packet, focusOnly) {
				if (!this.config.guid) {
					return packet;
				}
				
				if (packet && !(this.config.guid in packet)) {
					return packet;
				}

				var data = packet && packet[this.config.guid],
					type = typeof data;
				
				if (type == 'null' || type == 'undefined') {
					return packet;
				}
				
				if (focusOnly) {
					if (data.focused) {
						this.focus();
					}
				} else {
					switch (type) {
						case 'boolean':
						case 'string':
							return this.setValue(data);
						case 'object':
							for (var item in data) {
								switch (item) {
									case 'value':
										if (data[item]) {
											this.setValue(data[item]);
										}
										break;
								}
							}
							break;
					}
				}
				
				return data;
			}
		},

		initialize: function () {
			if (this.config.autoAdjust && this.config.styles) {
				delete this.config.styles.height;
			}

			this.parent();

			this.element.wantsFocus = false;

			createKeyboard.call(this);

			if (this.config.value) {
				this.setValue(this.config.value);
			}
			delete this.config.value;

			if (this.config.autoAdjust) {
				this.setStyle('height', this.__keyboard.element.height);
			}

			appendHandler.subscribeTo(this, 'onAppend', this);
		},

		getValue: function () {
			return this.__keyboard.getValue();
		},

		setValue: function (value) {
			return this.__keyboard.setValue(value);
		},

		appendToValue: function (characters) {
			return this.__keyboard.appendToValue(characters);
		},

		deleteFromValue: function (count) {
			return this.__keyboard.deleteFromValue(count);
		},

		clearValue: function () {
			return this.__keyboard.clearValue();
		},

		loadLayout: function (layout, options) {
			return this.__keyboard.loadLayout(layout, options);
		},

		focus: function () {
			return this.__keyboard.focus();
		},

		resetFocus: function () {
			return this.__keyboard.resetFocus();
		},

		reset: function () {
			return this.__keyboard.reset();
		},

		getShiftState: function () {
			return this.__keyboard.getShiftState();
		},

		setShiftState: function (state) {
			return this.__keyboard.setShiftState(state);
		},

		toggleShift: function () {
			return this.__keyboard.toggleShift();
		},

		getExtendedState: function () {
			return this.__keyboard.getExtendedState();
		},

		setExtendedState: function (state) {
			return this.__keyboard.setExtendedState(state);
		},

		toggleExtendedState: function () {
			return this.__keyboard.toggleExtended();
		},

		toggleKey: function (key) {
			this.__keyboard.toggleKey(key);
		},

		suicide: function () {
			this.__keyboard.suicide();
			delete this.__keyboard;
			delete this._repeaters;
			this.parent();
		}
	});
}, {
	ControlKeyboard: {
		styles: {
			width: 'inherit'
		}
	}
});
