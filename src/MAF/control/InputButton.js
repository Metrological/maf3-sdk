define('MAF.control.InputButton', function () {
	var onValueNeeded = function (event) {
		var conf = this.config,
			methodName = 'changeValue',
			callback = onValueCallback.bindTo(this),
			value = this.getValue();
		callback.__event__ = event;
		if (conf[methodName] && conf[methodName].apply) {
			conf[methodName].apply(this, [change_callback, value]);
		} else {
			this[methodName](callback, value);
		}
	};
	var onValueCallback = function (value) {
		this.setValue(value);
		var nodeEvent = arguments.callee.caller.__event__ || null;
		this.fire('onSelect', null, nodeEvent);
	};
	var createValueDisplay = function () {
		var dispval = this.getDisplayValue();
		if (this.config.valueOnSubline) {
			this.valueDisplay = new MAF.element.Text({
				ClassName: 'ControlValueContainerSubline',
				label: dispval
			}).appendTo(this);
			/*@TODO: not required? this.valueDisplay._updateContent = */(function () {
				this.valueDisplay.data = this.getDisplayValue();
			}).subscribeTo(this, ['onValueInitialized', 'onValueChanged'], this);
		} else {
			this.valueDisplay = new MAF.control.ValueDisplay({
				source: this,
				styles: {
					height: 'inherit'
				}
			}).appendTo(this);
		}
	};

	return new MAF.Class({
		ClassName: 'ControlInputButton',

		Extends: MAF.control.TextButton,

		config: {
			options: [],
			value: null,
			valueOnSubline: false
		},

		Protected: {
			dispatcher: function (nodeEvent, payload) {
				if (nodeEvent.type === 'select') {
					if (DEBUG) {
						log('dispatcher', nodeEvent, payload, this);
					}
					return onValueNeeded.call(this);
				}
				this.parent(nodeEvent, payload);
			},
			onThemeNeeded: function (event) {
				this.parent(event);
				switch (event.type) {
					case 'onAppend':
						if (!this.config.valueOnSubline && this.ClassName !== 'ImageToggleButton' && this.valueDisplay && !event.payload.skip) {
							this.valueDisplay.setStyle('width', this.width);
							//@TODO: Still required?
							/*if (this.valueDisplay.adjustContent) {
								this.valueDisplay.adjustContent();
							}*/
						}
						break;
				}
			}
		},

		initialize: function () {
			this.ClassName += this.config.valueOnSubline ? 'Subline' : '';
			this.parent();

			if (this.config.options) {
				this.setOptions(this.config.options);
				delete this.config.options;
			}

			this.setValue(this.config.value || '');
			delete this.config.value;
		},

		adjustAccessories: function () {
			var max_right = this.width;
			if (this.secureIndicator && this.secure) {
				max_right = this.secureIndicator.hOffset - this.secureIndicator.width;
			}
			if (this.valueDisplay && this.valueDisplay.config && this.valueDisplay.config.styles && (this.valueDisplay.config.styles.hAlign === 'right')) {
				this.valueDisplay.setStyles({
					hOffset: max_right
				});
			}
		},

		createContent: function () {
			var dispval = this.getDisplayValue(),
				subline = this.config.valueOnSubline,
				textkey = subline ? 'ControlValueContainerMainline' : 'ControlTextButtonText',
				textsts = Object.clone(this.config.textStyles || Theme.getStyles(textkey) || {});
			
			delete textsts.width;

			this.content = new MAF.element.Text({
				ClassName: textkey,
				label:  this.config.label,
				styles: textsts
			}).appendTo(this);
			
			createValueDisplay.call(this);
		},

		getValue: function () {
			return String(this.retrieve('value')||'');
		},

		setValue: function (value) {
			var firstblush = this.retrieve('value') === null,
				stringvalue = value === null ? '' : String(value);

			if ((this.retrieve('value') || '') === stringvalue) {
				return '';
			}

			this.store('value', stringvalue);
			this.fire( firstblush ? 'onValueInitialized' : 'onValueChanged', { value: stringvalue } );
			return this.getValue();
		},

		changeValue: function (callback, value) {
			callback(value);
		},

		getDisplayValue: function (value) {
			value = value || this.getValue();
			var label = value;
			this.getOptions().forEach(function(option){
				if (option.value == value) {
					label = option.label;
				}
			});
			return label;
		},

		setOptions: function (values, labels) {
			values = (values instanceof Array) ? values : [values];
			var options = values.map(function(value, v){
				var o = typeof value == 'object',
					l = labels && labels.length || 0;
				return value ? {
					value: o && 'value' in value ? value.value : value,
					label: l > v ? labels[v] : o && 'label' in value ? value.label : value
				} : value;
			});
			this.store('options', options);
			this.fire('onOptionsChanged', { options: this.getOptions() });
		},

		getOptions: function () {
			return this.retrieve('options') || [];
		},

		getOptionValues: function () {
			return this.getOptions().map(function(option) {
				return option.value;
			});
		},

		getOptionLabels: function () {
			return this.getOptions().map(function(option) {
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
		styles: {
			width: 'inherit',
			height: '91px'
		}
	}
});
