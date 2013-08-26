define('MAF.control.SingleTab', function () {
	return new MAF.Class({
		ClassName: 'ControlSingleTab',

		Extends: MAF.control.Button,

		Protected: {
			dispatchEvents: function (event, payload) {
				switch(event.type) {
					case 'navigate':
						if (event.detail && event.detail.direction) {
							switch (event.detail.direction) {
								case 'left':
								case 'right':
									event.preventDefault();
									this.shiftSource(event.detail.direction);
									break;
								default:
									break;
							}
						}
						break;
				}
				this.parent(event, payload);
			},
			createContent: function () {
				this.content = new MAF.element.Text({
					ClassName: (this.config.ClassName || this.ClassName) + 'Text',
					label: FontAwesome.get('caret-left') + ' ' + this.config.label +  ' ' + FontAwesome.get('caret-right'),
					styles: Object.merge({
						width: this.width - 80,
						height: this.height,
						hOffset: 40,
						anchorStyle: 'center',
						truncation: (this.ClassName === 'SingleTab') ? 'end' : null
					},this.config.textStyles || {})
				}).appendTo(this);
				var options = this.getOptions();
				this.setValue(this.config.value || (options && options.length > 0) ? options[0].value : '');
				delete this.config.value;
			}
		},

		config: {
			carousel: false
		},

		initialize: function () {
			this.parent();
			if (this.config.options) {
				this.setOptions(this.config.options);
				delete this.config.options;
			}
		},

		getValue: function () {
			return String(this.retrieve('value') || '');
		},

		setValue: function (value) {
			var firstBlush = this.retrieve('value') === undefined,
				stringValue = value === undefined ? '' : String(value);
			if ((this.retrieve('value') || '') === stringValue && !firstBlush) {
				return '';
			}
			this.store('value', stringValue);
			this.fire(firstBlush ? 'onTabInitialized' : 'onTabChanged', {
				value: stringValue,
				index: this.getActiveIndex()
			});
			this.update();
			return this.getValue();
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

		initTabs: function (values, labels, reset) {
			this.setOptions(values, labels, reset);
			if (this.getValue().length === 0 || reset) {
				this.setValue(this.config.value || this.getOptions()[0].value);
			}
		},

		setOptions: function (values, labels, reset) {
			values = [].concat(values);
			var options = values.map(function (value, v) {
				var o = typeOf(value) == 'object',
					l = labels && labels.length || 0;
				return value ? {
					value: o && 'value' in value ? String(value.value) : String(value),
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
			return this.getOptions().map(function (option) {
				return option.value;
			});
		},

		getOptionLabels: function () {
			return this.getOptions().map(function (option) {
				return option.label;
			});
		},

		getActiveIndex: function () {
			var options = this.getOptions(),
				value = this.getValue();
			var index = options.map(function (o) {
				return o.value;
			}).indexOf(value);
			return (index < 0) ? 0 : index;
		},

		shiftSource: function (direction) {
			var options = this.getOptions(),
				carousel = (this.config.carousel === true),
				index = this.getActiveIndex();
			if (options.length < 2) {
				return;
			}
			switch (direction) {
				case 'left':
					index = index === 0 ? (carousel ? options.length - 1 : index) : index - 1;
					break;
				case 'right':
					index = index === options.length - 1 ? (carousel ? 0 : index) : index + 1;
					break;
			}
			this.setValue(options[index].value);
		},

		update: function (reset) {
			var options = this.getOptions();
			if (reset === true) {
				this.setValue(options[0].value);
			}
			var dispval = this.getDisplayValue();
			this.content.setText(FontAwesome.get('caret-left') + ' ' + dispval +  ' ' + FontAwesome.get('caret-right'));
		}
	});
}, {
	ControlSingleTab: 'ControlPageIndicator'
});
