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
define('MAF.control.InputButton', function () {
	var onValueNeeded = function (event) {
		var config = this.config,
			method = 'changeValue',
			callback = onValueCallback.bindTo(this),
			value = this.getValue();
		callback.__event__ = event;
		if (config[method] && config[method].apply) {
			config[method].apply(this, [callback, value]);
		} else {
			this[method](callback, value);
		}
	};
	var onValueCallback = function (value) {
		var event = arguments.callee.caller.__event__ || null;
		this.setValue(value);
		this.fire('onSelect', null, event);
	};
	var createValueDisplay = function () {
		var dispayValue = this.getDisplayValue();
		if (this.config.valueOnSubline) {
			this.valueDisplay = new MAF.element.Text({
				ClassName: 'ControlValueContainerSubline',
				label: dispayValue
			}).appendTo(this);
			(function () {
				this.valueDisplay.data = this.getDisplayValue();
			}).subscribeTo(this, ['onValueInitialized', 'onValueChanged'], this);
		} else if (this.ClassName !== 'ImageToggleButton') {
			this.valueDisplay = new MAF.control.ValueDisplay({
				source: this,
				styles: {
					height: 'inherit'
				}
			}).appendTo(this);
		} else {
			this.valueDisplay = new MAF.element.Image({
				src: dispayValue.src,
				styles: Object.merge({
					hAlign: 'right',
					vAlign: 'center'
				}, this.config.toggleStyles || {})
			}).appendTo(this);
			(function () {
				this.valueDisplay.setSource(this.getDisplayValue().src);
			}).subscribeTo(this, ['onValueInitialized', 'onValueChanged'], this);
		}
	};
	return new MAF.Class({
		ClassName: 'ControlInputButton',

		Extends: MAF.control.TextButton,

		Protected: {
			valueDisplayWidth: function (event) {
				if (!this.config.valueOnSubline && this.ClassName !== 'ImageToggleButton' && this.valueDisplay && !event.payload.skip) {
					this.valueDisplay.width = this.width;
				}
			},
			dispatchEvents: function (event, payload) {
				if (event.type === 'select') {
					event.stopPropagation();
					event.preventDefault();
					return onValueNeeded.call(this);
				}
				this.parent(event, payload);
			}
		},

		config: {
			options: [],
			value: null,
			valueOnSubline: false
		},

		initialize: function () {
			this.ClassName += this.config.valueOnSubline ? 'Subline' : '';
			this.parent();

			this.valueDisplayWidth.subscribeTo(this, 'onAppend' , this);

			if (this.config.options) {
				this.setOptions(this.config.options);
				delete this.config.options;
			}

			this.setValue(this.config.value || '');
			delete this.config.value;
		},

		adjustAccessories: function () {
			var maxRight = this.width;
			if (this.secureIndicator && this.secure) {
				maxRight = this.secureIndicator.hOffset - this.secureIndicator.width;
			}
			if (this.valueDisplay && this.valueDisplay.config && this.valueDisplay.config.styles && (this.valueDisplay.config.styles.hAlign === 'right')) {
				this.valueDisplay.setStyles({
					hOffset: maxRight
				});
			}
		},

		createContent: function () {
			var dispayValue = this.getDisplayValue(),
				config = this.config,
				onSubline = config.valueOnSubline || false,
				textKey = onSubline ? 'ControlValueContainerMainline' : 'ControlTextButtonText',
				textStyles = Object.clone(config.textStyles || Theme.getStyles(textKey) || {});

			delete textStyles.width;

			this.content = new MAF.element.Text({
				ClassName: textKey,
				label:  config.label,
				styles: textStyles
			}).appendTo(this);

			createValueDisplay.call(this);
		},

		getValue: function () {
			return String(this.retrieve('value') || '');
		},

		setValue: function (value) {
			var firstBlush = isEmpty(this.retrieve('value')),
				stringValue = value === null ? '' : String(value);

			if ((this.retrieve('value') || '') === stringValue) {
				return '';
			}

			this.store('value', stringValue);
			this.fire(firstBlush ? 'onValueInitialized' : 'onValueChanged', {
				value: stringValue
			});
			return this.getValue();
		},

		changeValue: function (callback, value) {
			callback(value);
		},

		getDisplayValue: function (value) {
			value = value || this.getValue();
			var label = value;
			this.getOptions().forEach(function (option) {
				if (option.value == value) {
					label = option.label;
				}
			});
			return label;
		},

		setOptions: function (values, labels) {
			values = [].concat(values);
			var options = values.map(function (value, v) {
				var o = typeOf(value) === 'object',
					l = labels && labels.length || 0;
				return value ? {
					value: o && 'value' in value ? value.value : value,
					label: l > v ? labels[v] : o && 'label' in value ? value.label : value
				} : value;
			});
			this.store('options', options);
			this.fire('onOptionsChanged', {
				options: this.getOptions()
			});
		},

		getOptions: function () {
			return this.retrieve('options') || [];
		},

		getOptionValues: function () {
			return this.getOptions().map(function (option) {
				return option.value;
			});
		},

		getOptionLabels: function () {
			return this.getOptions().map(function (option) {
				return option.label;
			});
		},

		generateStatePacket: function (packet) {
			packet = packet || {};
			return this.parent(Object.merge({
				value: this.getValue()
			}, packet));
		},

		inspectStatePacket: function (packet, focusOnly) {
			var data = this.parent(packet, focusOnly),
				type = typeOf(data);
			if (focusOnly) {
				return;
			}
			if (data === packet) {
				return packet;
			}
			switch(type) {
				case 'boolean':
				case 'string':
					return this.setValue(data);
			}
			for (var item in data) {
				switch (item) {
					case 'optionCancelled':
						if (data[item]) {
							this.fire('onOptionCancelled', data);
							data[item] = null;
							return data;
						}
						break;
					case 'optionSelected':
						if (data[item] && 'option' in data) {
							this.fire('onOptionSelected',data.option);
							data[item] = null;
							continue;
						} else if (data[item]===false) {
							this.fire('onOptionCancelled', data);
							data[item] = null;
							return data;
						}
						break;
					case 'option':
						this.setValue(data[item].value);
						break;
					case 'value':
						this.setValue(data[item]);
						break;
				}
			}
			return data;
		},

		suicide: function () {
			this.valueDisplay.suicide();
			delete this.valueDisplay;
			this.parent();
		}
	});
}, {
	ControlInputButton: 'ControlButton',
	ControlInputButtonSubline: {
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
			height: '91px'
		}
	},
	ControlValueContainerMainline: {
		styles: {
			width: '100%',
			height: 'inherit',
			vOffset: 6,
			fontSize: 28,
			paddingLeft: 10,
			paddingRight: 10,
			anchorStyle: 'leftTop',
			truncation: 'end'
		}
	},
	ControlValueContainerSubline: {
		styles: {
			width: '100%',
			height: 'inherit',
			truncation: 'end',
			paddingLeft: 10,
			anchorStyle: 'leftBottom',
			fontSize: 23,
			paddingBottom: 4,
			color: 'rgba(255,255,255,.7)'
		}
	}
});
