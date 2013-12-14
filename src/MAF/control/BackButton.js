/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2013  Metrological
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
define('MAF.control.BackButton', function () {
	return new MAF.Class({
		ClassName: 'ControlBackButton',

		Extends: MAF.control.Button,

		Protected: {
			dispatchEvents: function (event, payload) {
				switch(event.type) {
					case 'select':
						if (this.fire('onSelect', payload, event)) {
							MAF.application.previousView(this.config.backParams || {});
						}
						break;
					default:
						this.parent(event, payload);
						break;
				}
			}
		},

		config: {
			backParams: false
		},

		createContent: function () {
			this.content = [
				new MAF.element.Text({
					ClassName: 'ControlBackButtonIcon',
					label: FontAwesome.get('undo')
				}).appendTo(this),
				new MAF.element.Text({
					ClassName: 'ControlBackButtonText',
					label: this.config.label || widget.getLocalizedString('BACK'),
					styles: this.config.textStyles
				}).appendTo(this)
			];
		},

		setText: function (text) {
			this.content[1].setText(text);
		}
	});
}, {
	ControlBackButton: 'ControlButton',
	ControlBackButtonIcon: {
		styles: {
			width: 60,
			height: 'inherit',
			fontSize: 24,
			paddingTop: 3,
			anchorStyle: 'center'
		}
	},
	ControlBackButtonText: {
		styles: {
			width: 'inherit',
			height: 'inherit',
			paddingLeft: 60,
			fontSize: 24,
			anchorStyle: 'leftCenter',
			truncation: 'end'
		}
	}
});
