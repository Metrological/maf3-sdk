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
 * @class MAF.control.TextEntryButton
 * @extends MAF.control.InputButton
 */
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
				layout: getSetting('keyboard') || 'alphanumeric'
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
				var value = this.getDisplayValue(event.payload.value || ''),
					target = this.valueDisplay;
				target.setText(value);
			}).subscribeTo(this, ['onValueInitialized','onValueChanged','onValueEdited'], this);

			this.valueDisplay.setText(this.getDisplayValue(this.getValue()));
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
			return output ? output.htmlEscape() : output;
		},
		destroyOverlay: function () {
			if (this._TextEntryOverlay) {
				this._TextEntryOverlay.suicide();
				delete this._TextEntryOverlay;
			}
			this.focus();
		},
		suicide: function () {
			if (this._TextEntryOverlay) {
				this._TextEntryOverlay.suicide();
				delete this._TextEntryOverlay;
			}
			this.parent();
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
