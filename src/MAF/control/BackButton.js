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
 * @class MAF.control.BackButton
 * @extends MAF.control.Button
 * @example
 * new MAF.control.BackButton({
 *    label: 'Back'
 * }).appendTo(this);
 */
/**
 * @cfg {Object} backParams Object of data you want to send to the previous view when selected by a user.
 * @memberof MAF.control.BackButton
 */
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

		/**
		 * After the component has appended to the view this method can be used to create some more content to be added to this component. 
		 * Default this will add 2 MAF.element.Text components to the content array of this component. The first has a Fontawesome glyph.
		 * @method MAF.control.BackButton#createContent
		 */
		createContent: function () {
			this.content = [
				new MAF.element.Text({
					ClassName: 'ControlBackButtonIcon',
					label: FontAwesome.get((MAE.labels && MAE.labels.back) || 'undo')
				}).appendTo(this),
				new MAF.element.Text({
					ClassName: 'ControlBackButtonText',
					label: this.config.label || widget.getLocalizedString('BACK'),
					styles: this.config.textStyles
				}).appendTo(this)
			];
		},

		/**
		 * Set the text for the back button label.
		 * @method MAF.control.BackButton#setText
		 * @param {String} text What to display on the back button label.
		 */
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
