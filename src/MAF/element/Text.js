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
 * @class MAF.element.Text
 * @extends MAF.element.Core
 */
define('MAF.element.Text', function () {
	return new MAF.Class({
		ClassName: 'BaseText',

		Extends: MAF.element.Core,

		Protected: {
			dispatchEvents: function (event, payload) {
				this.parent(event, payload);
				switch(event.type) {
					case 'change':
						this.fire('onChange', payload, event);
						break;
					case 'layoutchange':
						this.fire('onLayoutChange', payload, event);
						break;
				}
			},
			proxyProperties: function (propnames) {
				this.parent([
					'data',
					'text',
					'size',
					'scrolling',
					'truncation',
					'wrap',
					'font',
					'lineHeight',
					'totalLines',
					'maxVisibleLindex',
					'visibleLines',
					'firstLine',
					'anchorStyle',
					'color',
					'textWidth',
					'textHeight'
				].concat(propnames || []));
			}
		},

		config: {
			element: Text
		},

		initialize: function () {
			this.config.anchorStyle = this.config.styles && this.config.styles.anchorStyle || this.config.anchorStyle;
			if (this.config.styles) {
				delete this.config.styles.anchorStyle;
			}
			if ('wrap' in this.config || 'truncation' in this.config) {
				if (!this.config.styles) {
					this.config.styles = {};
				}
				this.config.styles.wrap = 'wrap' in this.config.styles ? this.config.styles.wrap : this.config.wrap;
				this.config.styles.truncation = 'truncation' in this.config.styles ? this.config.styles.truncation : this.config.truncation;
				delete this.config.wrap;
				delete this.config.truncation;
			}

			this.parent();
			if (this.config.anchorStyle) {
				this.anchorStyle = this.config.anchorStyle;
			}
			if (this.config.visibleLines) {
				this.visibleLines = this.config.visibleLines;
			}
			this.setText(this.config.data || this.config.text || this.config.label);
		},

		setText: function (text) {
			this.element.data = text;
		}
	});
});
