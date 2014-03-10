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
 * @class MAF.control.Button
 * @extends MAF.element.Button
 * @classdesc Basic button with default styling.
 */
define('MAF.control.Button', function () {
	var updateSecureIndicator = function (event) {
		if (!this.secureIndicator && this.secure) {
			this.secureIndicator = new MAF.element.Text({
				ClassName: 'SecureButtonIndicator',
				label: FontAwesome.get('lock')
			}).appendTo(this);
		}
		this.adjustAccessories();
	};

	return new MAF.Class({
		ClassName: 'ControlButton',

		Extends: MAF.element.Button,

		Protected: {
			onThemeNeeded: function (event) {
				if (event.defaultPrevented) {
					return;
				}
				switch(event.type) {
					case 'onFocus':
						this.renderSkin('focused');
						break;
					case 'onBlur':
						this.renderSkin('normal');
						break;
					case 'onAppend':
						this.renderSkin('normal');
						this.createContent();
						break;
				}
			}
		},

		initialize: function () {
			if (this.config.theme !== false) {
				this.onThemeNeeded.subscribeTo(this, ['onFocus', 'onBlur', 'onAppend'] , this);
			} else {
				this.createContent.subscribeTo(this, 'onAppend' , this);
			}
			updateSecureIndicator.subscribeTo(this, 'onChangedSecure', this);
			this.parent();
			updateSecureIndicator.call(this);
		},

		/**
		 * After the component has appended to the view this method can be used to create some more content to be added to this component. This can be implemented (or overridden) by objects that inherit the member. 
		 * @method MAF.control.Button#createContent
		 * @abstract
		 */
		createContent: emptyFn,
		adjustAccessories: emptyFn,

		suicide: function () {
			if (this.secureIndicator) {
				this.secureIndicator.suicide();
				delete this.secureIndicator;
			}
			this.parent();
		}
	});
}, {
	ControlButton: {
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
			height: 51
		}
	},
	SecureButtonIndicator: {
		styles: {
			hAlign: 'right',
			vAlign: 'bottom',
			hOffset: 10,
			vOffset: 7
		}
	}
});
