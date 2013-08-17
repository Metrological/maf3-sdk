define('MAF.control.TextEntryOverlay', function () {
	var ValueManagers = {};
	var hideOverlay = function () {
		this.config.creator.destroyOverlay();
	};
	var handleExternalCancel = function (event) {
		var cancelType = event.type,
			defaultActionCallback = function () {
				if (event.payload && event.payload.defaultActionCallback && event.payload.defaultActionCallback.call) {
					event.payload.defaultActionCallback();
				}
			};
		//@TODO this can be removed is already handled later on
		//if (cancelType === 'onHideView' && this.getView().config.viewId === event.payload.viewId) {
		//	hideOverlay.call(this);
		//}
		event.preventDefault();
		if (this.config.creator.fire('onCancel', { 
			event: event, 
			value: this.getValue(), 
			cancelCallback: hideOverlay.bindTo(this), 
			defaultActionCallback: defaultActionCallback
		})){
			hideOverlay.call(this);
			defaultActionCallback();
		}
	};
	var maskValue = function (value) {
		var config   = this.config,
			creator  = config.creator,
			bullet   = creator.config.bulletCharacter || config.bulletCharacter,
			domask   = creator.config.secureMask || config.secureMask,
			masktype = domask && creator.config.secureMaskType || config.secureMaskType,
			masked   = bullet.repeat(value.length);
		if (masktype && masked.length) {
			switch (masktype) {
				case 'mask-character':
					masked = bullet.repeat(value.length - 1) + value.charAt(value.length - 1); // mask all but last character
					break;
				case 'mask-submitted':
					masked = value; // expose full value on overlay
					break;
				case 'mask-all':
					// keep value on overlay fully masked
					break;
				default:
					masked = value; // no masking
					break;
			}
		} else {
			masked = value;
		}
		return masked;
	};
	var onValueManagerEvent = function (event) {
		var el = this.inputField.element || false,
			ValueManager = ValueManagers[this._classID],
			nativeCursor = el && el.editable || false,
			cursor = false,
			value, 
			cursorPosition;
		switch (event.type) {
			case 'cursormoved':
				value = ValueManager.value;
				cursorPosition = event.payload.cursorPosition || ValueManager.cursorPosition;
				break;
			case 'valuechanged':
				value = event.payload.value || ValueManager.value;
				cursorPosition = ValueManager.cursorPosition;
				break;
		}
		var displayValue = maskValue.call(this, value);
		if (!nativeCursor) {
			cursor = this.config.creator.config.cursorCharacter;
			displayValue = displayValue.substr(0, cursorPosition) + cursor + displayValue.substr(cursorPosition, displayValue.length);
			this.inputField.setText(displayValue);
		} else {
			if (event.type === 'valuechanged') {
				this.inputField.setText(displayValue);
			}
		}
		if (event.type === 'valuechanged') {
			var curLine = this.retrieve('line') || 1;
			if (curLine && curLine !== el.totalLines) {
				var lineHeight = this.inputField.lineHeight;
				if (curLine > el.totalLines) {
					this.form.height = this.form.height - ((curLine-Math.max(1, el.totalLines))*lineHeight);
				} else {
					this.form.height = this.form.height + ((el.totalLines-Math.max(1, curLine))*lineHeight);
				}
			}
			this.store('line', el.totalLines);
		}
		if (nativeCursor && isNumber(el.cursor) && event.type === 'cursormoved') {
			el.cursor = cursorPosition || 0;
		}
	};
	return new MAF.Class({
		ClassName: 'ControlTextEntryOverlay',

		Extends: MAF.element.Container,

		Protected: {
			onThemeNeeded: function (event) {
				switch(event.type) {
					case 'onAppend':
						this.show();
						break;
				}
			},
			initValueManager: function () {
				var maxlength,
					ValueManager = ValueManagers[this._classID];
				if (!ValueManager) {
					if (this.config.creator) {
						if (this.config.creator.config && this.config.creator.config.keyboard) {
							maxlength = this.config.creator.config.keyboard.maxLength;
						}
					}
					if (this.config.keyboard) {
						maxlength = this.config.keyboard.maxLength;
					}
					if (!maxlength) {
						maxlength = this.config.maxLength;
					}
					ValueManager = ValueManagers[this._classID] = new MAF.keyboard.KeyboardValueManager({
						maxLength: maxlength
					});
					onValueManagerEvent.subscribeTo(ValueManager, ['cursormoved', 'valuechanged'], this);
				}
			},
			createContent: function () {
				var view = this.config.creator.getView(),
					ValueManager = ValueManagers[this._classID];

				this.setStyle('backgroundColor', this.config.creator.config.overlayBackgroundColor);

				view.element.allowNavigation = false;

				var textButtonStyles = Theme.getStyles('ControlButton'),
					labelStyles = Theme.getStyles('ControlTextEntryButtonLabel'),
					bpad = Theme.storage.get('ControlTextEntryButton').submitButtonPadding || 0,
					buttonStyles = Theme.getStyles('ControlTextEntryTextButtonText'),
					submitText = this.config.creator.config.submitButtonLabel || 'OK',
					cancelText = this.config.creator.config.cancelButtonLabel || 'Cancel';

				this.form = new MAF.element.Container({
					styles: {
						width: view.width,
						vAlign: 'center',
						backgroundColor: this.config.creator.config.formBackgroundColor
					}
				}).appendTo(this);

				var clearStyles = Theme.storage.get('ControlTextEntryOverlayClearButton') || {};
				var clearButton = new MAF.element.Button({
					ClassName: 'ControlTextEntryOverlayClearButton',
					content: new MAF.element.Text({
						label: '&#8999;',
						styles: {
							width: 'inherit',
							height: 'inherit',
							anchorStyle: 'center'
						}
					}),
					styles: clearStyles.styling || {},
					events: {
						onSelect: function () {
							ValueManager.value = '';
						}
					}
				}).appendTo(this.form);

				this.inputField = new MAF.element.TextField({
					ClassName: 'ControlTextEntryButtonValue',
					label: '',
					styles: {
						width: view.width - 80,
						height: 'auto',
						wrap: true
					},
					events: {
						onCursor: function (event) {
							ValueManager.cursorPosition = event.payload.caret || 0;
						},
						onNavigate: function (event) {
							if (event.payload.direction === 'right' && ValueManager.cursorPosition === ValueManager.value.length) {
								event.preventDefault();
								clearButton.focus();
							}
						}.bindTo(this),
						onKeyDown: function (event) {
							if (['left', 'right', 'up', 'down'].indexOf(event.payload.key) < 0) {
								event.payload.layout = this.keyboard.config.layout;
								event.preventDefault();
								event.stopPropagation();
								ValueManager.handleExternalKeyInput(event);
								this.keyboard.toggleKey(event.payload.key);
							}
						}.bindTo(this)
					}
				}).appendTo(this.form);

				var cancelBtn = new MAF.control.TextButton({
					label: cancelText,
					styles: {
						vAlign: 'bottom'
					},
					textStyles: buttonStyles,
					events: {
						onSelect: function () {
							var value = this.getValue();
							var callback = hideOverlay.bindTo(this);
							var packet = {
								value: value,
								cancelCallback: callback
							};
							if (this.config.creator.fire('onCancel', packet)) {
								hideOverlay.call(this);
							}
						}.bindTo(this)
					}
				}).appendTo(this.form);

				var buttonHeight = textButtonStyles.height;
				var submitBtn = new MAF.control.TextButton({
					label: submitText,
					styles: {
						vAlign: 'bottom',
						vOffset: buttonHeight + bpad
					},
					textStyles: buttonStyles,
					events: {
						onSelect: function (event) {
							var payload = {
								value: ValueManager.value,
								cursorPosition: ValueManager.cursorPosition,
								submitCallback: (function() {
									if (this.config.creator.setValue) {
										this.config.creator.setValue(payload.value);
									}
									hideOverlay.call(this);
								}).bindTo(this)
							};
							if (this.config.creator.fire('onSubmit', payload)) {
								payload.submitCallback();
							}
						}.bindTo(this)
					}
				}).appendTo(this.form);

				var keyconfig = Object.merge(this.config.creator.config.keyboard, {
					embedded: false,
					styles: {
						vAlign: 'bottom',
						width: view.width,
						vOffset: (buttonHeight*2) + (bpad*2),
						controlSize: 'standard'
					},
					events: {
						onKeyDown: function (event) {
							event.preventDefault();
							event.stopPropagation();
							event.payload.layout = this.keyboard.config.layout;
							ValueManager.handleExternalKeyInput(event);
						}.bindTo(this)
					}
				});

				this.keyboard = new MAF.control.Keyboard(keyconfig).appendTo(this.form);

				var outputLabel = new MAF.element.Text({
					label: this.config.creator.config.label,
					styles: {
						fontSize: 20,
						hOffset: 10,
						vAlign: 'bottom',
						vOffset: (buttonHeight*2) + (bpad*3) + this.keyboard.height
					}
				}).appendTo(this.form);

				this.form.height = (buttonHeight*2) + outputLabel.vOffset - (bpad*3);
			},

			registerHandler: function () {
				this.boundHandler = handleExternalCancel.subscribeTo(MAF.application, ['onActivateBackButton','onActivateSettingsButton', 'onHideView'], this);
			},

			unregisterHandler: function () {
				this.boundHandler.unsubscribeFrom(MAF.application, ['onActivateBackButton','onActivateSettingsButton', 'onHideView']);
				delete this.boundHandler;
			}
		},

		config: {
			maxLength: 255,
			element: View,
			creator: null
		},

		initialize: function () {
			this.parent();
			this.onThemeNeeded.subscribeTo(this, 'onAppend' , this);
			this.initValueManager();
			this.createContent();
			var ValueManager = ValueManagers[this._classID];
			ValueManager.value = this.config.creator.getValue();
			if (ValueManager.value.length) {
				ValueManager.cursorPosition = ValueManager.value.length;
			}
		},

		getValue: function () {
			return ValueManagers[this._classID].value;
		},

		setValue: function (value) {
			ValueManagers[this._classID].value = value;
		},

		show: function () {
			this.registerHandler();
			this.keyboard.focus();
			return this;
		},

		suicide: function () {
			this.unregisterHandler();
			var view = this.config.creator.getView();
			delete this.config.creator;
			view.element.allowNavigation = true;
			ValueManagers[this._classID].suicide();
			delete ValueManagers[this._classID];
			this.inputField.suicide();
			this.keyboard.suicide();
			this.form.suicide();
			delete this.inputField;
			delete this.keyboard;
			delete this.form;
			this.parent();
		}
	});
}, {
	ControlTextEntryOverlay: {
		styles: {
			width: 'inherit',
			height: 'inherit'
		}
	},
	ControlTextEntryOverlayClearButton: {
		styling: {
			border: '2px solid white',
			borderRadius: '10px',
			width: 64,
			height: 44,
			hAlign: 'right',
			hOffset: 2,
			vOffset: 9
		},
		normal: {
			styles: {
				backgroundColor: Theme.getStyles('BaseGlow', 'backgroundColor')
			}
		},
		focused: {
			styles: {
				backgroundColor: Theme.getStyles('BaseFocus', 'backgroundColor')
			}
		}
	}
});
