define('MAF.control.TextEntryOverlay', function () {
	var ValueManagers = {},
		hideOverlay = function () {
			this.config.creator.destroyOverlay();
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
					ValueManager = ValueManagers[this._classId];
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
					ValueManager = ValueManagers[this._classId] = new MAF.keyboard.KeyboardValueManager({
						maxLength: maxlength
					});
					this.onValueManagerEvent.subscribeTo(ValueManager, ['cursormoved', 'valuechanged'], this);
				}
			},
			handleExternalCancel: function (event) {
				var cancelType = event.type;
				if (cancelType === 'onHideView' && this.getView().config.viewId === event.payload.viewId) {
					hideOverlay.call(this);
				}
				event.preventDefault();
				var defaultActionCallback = function () {
					if (event.payload && event.payload.defaultActionCallback && event.payload.defaultActionCallback.call) {
						event.payload.defaultActionCallback();
					}
				};
				var cancelCallback = (function () {
					hideOverlay.call(this);
				}).bindTo(this);
				if (this.config.creator.fire('onCancel', { 
					event: event, 
					value: this.getValue(), 
					cancelCallback: cancelCallback, 
					defaultActionCallback: defaultActionCallback
				})){
					cancelCallback();
					defaultActionCallback();
				}
			},
			onValueManagerEvent: function (event) {
				var el = this._keyOutput.element || false,
					ValueManager = ValueManagers[this._classId],
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
				var displayValue = this.maskValue(value);
				if (!nativeCursor) {
					cursor = this.config.creator.config.cursorCharacter;
					displayValue = displayValue.substr(0, cursorPosition) + cursor + displayValue.substr(cursorPosition, displayValue.length);
					this._keyOutput.setText(displayValue);
				} else {
					if (event.type === 'valuechanged') {
						this._keyOutput.setText(displayValue);
					}
				}
				if (event.type === 'valuechanged') {
					var curLine = this.retrieve('line') || 1;
					if (curLine && curLine !== el.totalLines) {
						var lineHeight = this._keyOutput.lineHeight;
						if (curLine > el.totalLines) {
							this.formContainer.height = this.formContainer.height - ((curLine-Math.max(1, el.totalLines))*lineHeight);
						} else {
							this.formContainer.height = this.formContainer.height + ((el.totalLines-Math.max(1, curLine))*lineHeight);
						}
					}
					this.store('line', el.totalLines);
				}
				if (nativeCursor && isNumber(el.cursor) && event.type === 'cursormoved') {
					el.cursor = cursorPosition || 0;
				}
			},

			onClearButtonSelect: function () {
				ValueManagers[this._classId].value = '';
			},

			maskValue: function (value) {
				var bullet   = this.config.creator.config.bulletCharacter || this.config.bulletCharacter,
					domask   = this.config.creator.config.secureMask || this.config.secureMask,
					masktype = domask && this.config.creator.config.secureMaskType || this.config.secureMaskType;
				
				var masked = bullet.repeat(value.length);
				
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
			},
			createContent: function () {
				var view = this.config.creator.getView(),
					ValueManager = ValueManagers[this._classId];

				var bound = {
					cancel: (function () {
						var value = this.getValue();
						var callback = hideOverlay.bindTo(this);
						var packet = {
							value: value,
							cancelCallback: callback
						};
						if (this.config.creator.fire('onCancel', packet)) {
							hideOverlay.call(this);
						}
					}).bindTo(this),
					edit: (function (event) {
						this.fire('onValueEdited', {value:event.payload.value});
					}).bindTo(this)
				};
				this.overlay = new MAF.element.Core({
					frozen: true,
					styles: {
						backgroundColor: this.config.creator.config.overlayBackgroundColor,
						width: view.width,
						height: view.height
					}
				}).appendTo(this);

				view.element.allowNavigation = false;

				var textButtonStyles = Theme.getStyles('ControlButton'),
					labelStyles = Theme.getStyles('ControlTextEntryButtonLabel'),
					bpad = Theme.storage.get('ControlTextEntryButton').submitButtonPadding || 0,
					buttonStyles = Theme.getStyles('ControlTextEntryTextButtonText'),
					submitText = this.config.creator.config.submitButtonLabel || 'OK',
					cancelText = this.config.creator.config.cancelButtonLabel || 'Cancel';

				this.formContainer = new MAF.element.Container({
					element: View,
					styles: {
						width: view.width,
						vAlign: 'center',
						backgroundColor: this.config.creator.config.formBackgroundColor
					}
				}).appendTo(this.overlay);

				var clearStyles = Theme.storage.get('ControlTextEntryOverlayClearButton') || {};

				this._clearButton = new MAF.element.Button({
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
						onSelect: this.onClearButtonSelect
					}
				}).appendTo(this.formContainer);

				this._keyOutput = new MAF.element.TextField({
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
							var ValueManager = ValueManagers[this._classId];
							if (event.payload.direction === 'right' && ValueManager.cursorPosition === ValueManager.value.length) {
								event.preventDefault();
								this._clearButton.focus();
							}
						}.bindTo(this),
						onKeyDown: function (event) {
							var ValueManager = ValueManagers[this._classId];
							if (['left', 'right', 'up', 'down'].indexOf(event.payload.key) < 0) {
								event.payload.layout = this._keycaps.config.layout;
								event.preventDefault();
								event.stopPropagation();
								ValueManager.handleExternalKeyInput(event);
								this._keycaps.toggleKey(event.payload.key);
							}
						}.bindTo(this)
					}
				}).appendTo(this.formContainer);

				var cancelBtn = new MAF.control.TextButton({
					label: cancelText,
					styles: {
						vAlign: 'bottom'
					},
					textStyles: buttonStyles,
					events: {
						onSelect: bound.cancel
					}
				}).appendTo(this.formContainer);

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
							var ValueManager = ValueManagers[this._classId],
								payload = {
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
				}).appendTo(this.formContainer);

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
							var ValueManager = ValueManagers[this._classId];
							event.preventDefault();
							event.stopPropagation();
							event.payload.layout = this._keycaps.config.layout;
							ValueManager.handleExternalKeyInput(event);
						}.bindTo(this)
					}
				});

				this._keycaps = new MAF.control.Keyboard(keyconfig).appendTo(this.formContainer);

				var outputLabel = new MAF.element.Text({
					label: this.config.creator.config.label,
					styles: {
						fontSize: 20,
						hOffset: 10,
						vAlign: 'bottom',
						vOffset: (buttonHeight*2) + (bpad*3) + this._keycaps.height
					}
				}).appendTo(this.formContainer);

				this.formContainer.height = (buttonHeight*2) + outputLabel.vOffset - (bpad*3);
			},

			registerHandler: function () {
				this._boundHandler = this.handleExternalCancel.subscribeTo(MAF.application, ['onActivateBackButton','onActivateSettingsButton', 'onHideView'], this);
			},

			unregisterHandler: function () {
				this._boundHandler.unsubscribeFrom(MAF.application, ['onActivateBackButton','onActivateSettingsButton', 'onHideView']);
				this._boundHandler = null;
			}
		},

		config: {
			maxLength: 99,
			element: Frame,
			creator: null
		},

		initialize: function () {
			this.parent();

			this.onThemeNeeded.subscribeTo(this, 'onAppend' , this);

			this.createContent();
			this.initValueManager();

			var ValueManager = ValueManagers[this._classId];
			ValueManager.value = this.config.creator.getValue();
			if (ValueManager.value.length) {
				ValueManager.cursorPosition = ValueManager.value.length;
			}
		},

		getValue: function () {
			return ValueManagers[this._classId].value;
		},

		setValue: function (value) {
			ValueManagers[this._classId].value = value;
		},

		show: function () {
			this.registerHandler();
			this.overlay.thaw();
			this._keycaps.focus();
			return this;
		},

		suicide: function () {
			this.unregisterHandler();
			var view = this.config.creator.getView();
			delete this.config.creator;
			view.element.allowNavigation = true;
			ValueManagers[this._classId].suicide();
			delete ValueManagers[this._classId];
			this._clearButton.suicide();
			this._keyOutput.suicide();
			this._keycaps.suicide();
			this.formContainer.suicide();
			this.overlay.suicide();
			delete this._clearButton;
			delete this._keyOutput;
			delete this._keycaps;
			delete this.formContainer;
			delete this.overlay;
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
