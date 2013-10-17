define('MAF.control.TextEntryButton', function () {
	var buildOverlay = function (current_value) {
		this._TextEntryOverlay = new MAF.control.TextEntryOverlay({
			creator: this
		}).appendTo(this.getView());
	};

	return new MAF.Class({
		ClassName: 'ControlTextEntryButton',

		Extends: MAF.control.InputButton,

		Protected: {
			valueDisplayWidth: function (event) {
				event.payload.skip = true;
				this.parent(event);
			}
		},

		config: {
			showCursor: true,
			cursorCharacter: '_',
			bulletCharacter: '\u2022',
			secureMask: false,
			secureMaskType: 'mask-submitted',
			keyboard: {
				layout: 'alphanumeric'
			},
			animate: false,//MAF.config.animationEnabled,
			animation: {
	//			duration: 400,
	//			fade: false,
	//			slide: true
			},
			overlayBackgroundColor: 'rgba(0,0,0,.7)',
			formBackgroundColor:    'black'
		},
		createContent: function () {
			this.content = new MAF.element.Text({
				ClassName: 'ControlTextEntryButtonLabel',
				label: this.config.label
			}).appendTo(this);

			this.valueDisplay = new MAF.element.Text({
				ClassName: 'ControlTextEntryButtonValue',
				styles: {
					width: this.width - (Theme.getStyles('ControlTextEntryButtonValue', 'margin') * 2)
				}
			}).appendTo(this);

			if (this.config.theme !== false) {
				this.valueDisplay.element.addClass('ControlTextEntryButtonValueTheme');
			}

			this.valueDisplay._updateContent = (function (event) {
				var value = event.payload.value,
					target = this.valueDisplay;
				target.setText(this.getDisplayValue(value));
			}).subscribeTo(this, ['onValueInitialized','onValueChanged','onValueEdited'], this);

			this.valueDisplay._updateContent({payload:{value:this.getValue()}});
		},

		getDisplayValue: function (value, editing) {
			var cursor = this.config.cursorCharacter,
				bullet = this.config.bulletCharacter,
				masktype = this.config.secureMask,
				value = editing ? value : value || this.getValue();

			if (masktype && value.length) {
				var masked = bullet.repeat(value.length),
					output;
				switch (masktype) {
					case 'mask-character':
						output = editing ? bullet.repeat(value.length-1) + value.charAt(value.length-1) + cursor : masked;
						break;
					case 'mask-submitted':
						output = editing ? value + cursor : masked;
						break;
					case 'mask-all':
						output = masked;
						break;
					default:
						output = masked;
						break;
				}
			} else if (value.length) {
				output = editing ? value + cursor : value;
			} else {
				output = editing ? cursor : '';
			}
			return output;
		},
		destroyOverlay: function () {
			this._TextEntryOverlay.suicide();
			delete this._TextEntryOverlay;
			this.focus();
		},
		changeValue: function (change_callback, current_value) {
			buildOverlay.call(this, current_value);
		}
	});
}, {
	ControlTextEntryButton: {
		renderSkin: function (state, w, h, args, theme) {
			var ff = new Frame();
			theme.applyLayer('BaseGlow', ff);
			if (state === 'focused') {
				theme.applyLayer('BaseFocus', ff);
			}
			theme.applyLayer('BaseHighlight', ff);
			return ff;
		},
		styles: {
			width: 'inherit',
			height: 102
		}
	},
	ControlTextEntryButtonSubline: 'ControlTextEntryButton',
	ControlTextEntryButtonLabel: {
		styles: {
			fontSize: 20,
			hOffset: 10,
			vOffset: 62
		}
	},
	ControlTextEntryButtonValue: {
		styles: {
			display: 'block',
			margin: 10,
			minHeight: '42px',
			height: '1.9em',
			padding: '3px',
			truncation: 'end'
		}
	},
	ControlTextEntryButtonValueTheme: {
		styles: {
			border: '2px solid white',
			borderRadius: '10px',
			backgroundColor: 'rgba(150,150,150,.5)',
			opacity: 0.9
		}
	}
});
