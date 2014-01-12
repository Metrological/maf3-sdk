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
 * @class MAF.control.Header
 * @extends MAF.element.Container
 */
define('MAF.control.Header', function () {
	var createContent = function () {
		var config = this.config,
			className = config.ClassName || this.ClassName,
			headerStyle = config.headerStyle && config.headerStyle.capitalize() || '';
		this.element.addClass(className + headerStyle);
		this.content = new MAF.element.Text({
			ClassName: className + 'Text' + headerStyle,
			label: config.label,
			styles: config.textStyles
		}).appendTo(this);
	};

	return new MAF.Class({
		ClassName: 'ControlHeader',

		Extends: MAF.element.Container,

		config: {
			headerStyle: 'large'
		},

		initialize: function () {
			delete this.config.focus;
			this.parent();
			createContent.call(this);
		},

		setText: function (text) {
			this.content.setText(text);
		}
	});
}, {
	ControlHeader: {
		styles: {
			backgroundColor: Theme.getStyles('BaseGlow', 'backgroundColor'),
			width: 'inherit'
		}
	},
	ControlHeaderSmall: {
		styles: {
			height: '32px'
		}
	},
	ControlHeaderLarge: {
		styles: {
			height: '48px'
		}
	},
	ControlHeaderTextSmall: {
		styles: {
			width: '100%',
			height: 'inherit',
			paddingLeft: 10,
			paddingRight: 10,
			fontSize: 18,
			anchorStyle: 'leftCenter',
			truncation: 'end'
		}
	},
	ControlHeaderTextLarge: {
		styles: {
			width: '100%',
			height: 'inherit',
			paddingLeft: 10,
			paddingRight: 10,
			fontSize: 24,
			anchorStyle: 'leftCenter',
			truncation: 'end'
		}
	}
});
