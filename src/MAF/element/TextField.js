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
define('MAF.element.TextField', function () {
	return new MAF.Class({
		ClassName: 'BaseTextField',

		Extends: MAF.element.Text,

		Protected: {
			dispatchEvents: function (event, payload) {
				this.parent(event, payload);
				var type = event.type;
				switch(type) {
					case 'navigate':
						this.fire('onNavigate', event.detail, event);
						return;
					case 'keydown':
						this.fire('onKeyDown', {keyCode: event.keyCode, key: event.key, eventPhase: event.eventPhase, type: event.type}, event);
						return;
					case 'cursor':
						this.fire('onCursor', event.detail, event);
						return;
					default:
						break;
				}
				this.fire('on' + type.capitalize(), payload, event);
			},
			registerEvents: function (eventTypes) {
				this.parent(['focus', 'blur', 'keydown', 'navigate', 'cursor'].concat(eventTypes || []));
			},
			proxyProperties: function (propnames) {
				this.parent(['editable'].concat(propnames || []));
			}
		},

		config: {
			editable: false
		},

		initialize: function () {
			this.parent();
			this.editable = this.config.editable;
		}
	});
});
