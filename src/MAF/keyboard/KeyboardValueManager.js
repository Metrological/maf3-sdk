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
define('MAF.keyboard.KeyboardValueManager', function (config) {
	var instances = {};
	return new MAF.Class({
		initialize: function () {
			instances[this._classID] = {
				value: '',
				cursorPosition: 0
			};

			getter(this, 'value', function () {
				return instances[this._classID].value || '';
			});
			setter(this, 'value', function (value) {
				if (value === null || value === undefined) {
					value = '';
				}
				var valueString = instances[this._classID].value;
				if (value !== valueString) {
					valueString = value;
					if (this.config.maxLength && valueString.length > this.config.maxLength) {
						valueString = valueString.substr(0, this.config.maxLength);
						this.fire('maxlengthexceeded');
					}
					instances[this._classID].value = valueString;
					this.fire('valuechanged', {value: valueString});
				}
				
				return valueString;
			});
			getter(this, 'cursorPosition', function () {
				return instances[this._classID].cursorPosition || 0;
			});
			setter(this, 'cursorPosition', function (position) {
				if (typeOf(position) === 'number') {
					var newPosition = Math.max(0, Math.min(parseInt(position, 10), this.value.length));

					if (this.cursorPosition !== newPosition) {
						instances[this._classID].cursorPosition = newPosition;
						this.fire('cursormoved', {cursorPosition: newPosition});
					}
				}
				
				return this.cursorPosition;
			});
		},
		deleteLeft: function (count) {
			count = parseInt(count, 10) || 1;
			var value = this.value;
			this.value = value.substr(0, Math.max(0, this.cursorPosition-count)) + value.substr(this.cursorPosition, value.length);
			this.moveCursorLeft(count);
			return this.value;
		},
		deleteRight: function (count) {
			count = parseInt(count, 10) || 1;
			var value = this.value;
			this.value = value.substr(0, this.cursorPosition) + value.substr(this.cursorPosition + count, value.length);
			this.moveCursorRight(count);
			return this.value;
		},
		handleExternalKeyInput: function (event) {
			if (DEBUG) {
				if (!event) {
					log('handleExternalKeyInput ... no event to process');
				}
			}
			var layout = event.payload && event.payload.layout || null;

			if (event.Event) {
				event = {
					payload: event.Event
				};
			}

			if (layout === 'pinentry') {
				if (!event.payload.isNumeric && ['tab', 'back', 'enter'].indexOf(event.payload.key) < 0) {
					return false;
				}
			}

			if (event.payload.update === true)
				this.deleteLeft();
			if (event.payload.isChar || event.payload.key === 'space') {
				var key = event.payload.key === 'space' ? ' ' : event.payload.key;
				return this.insertCharacters(key);
			} else {
				switch (event.payload.key) {
					case 'back':
						this.deleteLeft();
						break;
					case 'delete':
						this.deleteRight();
						break;
				}
			}
		},
		insertCharacters: function (characters) {
			if (characters === null || characters === undefined) {
				return this.value;
			}
			characters = String(characters);
			var value = this.value;

			this.value = value.substr(0, this.cursorPosition) + characters + value.substr(this.cursorPosition, value.length);
			this.moveCursorRight(characters.length);
			return value;
		},
		moveCursorLeft: function (count) {
			this.cursorPosition = this.cursorPosition - (count || 1);
			return this.cursorPosition;
		},
		moveCursorRight: function (count) {
			this.cursorPosition = this.cursorPosition + (count || 1);
			return this.cursorPosition;
		},
		setMaxLength: function (length) {
			if (isNumber(length)) {
				this.config.maxLength = length;
			}
		},
		suicide: function () {
			delete instances[this._classID];
		}
	});
});
