define('MAF.control.SingleTab', function () {
	return new MAF.Class({
		ClassName: 'ControlSingleTab',
		Extends: MAF.control.Button,

		Protected: {
			dispatcher: function (nodeEvent, payload) {
				switch(nodeEvent.type) {
					case 'focus':
					case 'blur':
						if (this.arrows && this.config.focusArrows === true) {
							this.arrows.left.visible = this.arrows.right.visible = (nodeEvent.type === 'focus') ? true : false;
						}
						break;
					case 'navigate':
						if (nodeEvent.detail && nodeEvent.detail.direction) {
							switch (nodeEvent.detail.direction) {
								case 'left':
								case 'right':
									nodeEvent.preventDefault();
									this.shiftSource(nodeEvent.detail.direction);
									break;
								default:
									break;
							}
						}
						break;
				}
				this.parent(nodeEvent, payload);
			},
			createContent: function () {
				var arrowClass = 'ControlPageIndicator',
					ss = this.config.imageSources || Theme.storage.get(this.ClassName, 'sources');

				this.text = new MAF.element.Text({
					ClassName: (this.config.ClassName || this.ClassName) + 'Text',
					label: this.config.label,
					styles: Object.merge({
						width: this.width - 80,
						height: this.height,
						hOffset: 40,
						anchorStyle: 'center',
						truncation: (this.ClassName === 'SingleTab') ? 'end' : null
					},this.config.textStyles || {})
				}).appendTo(this);

				this.arrows = {
					left: new MAF.element.Image({
						ClassName: 'ControlSingleTabArrowleft',
						autoShow: !this.config.focusArrows,
						src: ss['<'],
						styles: {
							left: this.config.arrowPadding,
							height: 1,
							vAlign: 'center',
							vOffset: -8,
							visible: !this.config.focusArrows
						}
					}).appendTo(this),
					
					right: new MAF.element.Image({
						ClassName: 'ControlSingleTabArrowright',
						autoShow: !this.config.focusArrows,
						src: ss['>'],
						styles: {
							hAlign: 'right',
							hOffset: this.config.arrowPadding,
							height: 1,
							vAlign: 'center',
							vOffset: -8,
							visible: !this.config.focusArrows
						}
					}).appendTo(this)
				};
				var options = this.getOptions();

				this.setValue(this.config.value || (options && options.length > 0) ? options[0].value : '');
				delete this.config.value;
			},

			updateArrows: function (curpage, pagecount) {
				var on  = {opacity: null},
					off = {opacity: 0.3},
					carousel = this.config.carousel,
					left  = this.arrows.left,
					right = this.arrows.right;

				if (pagecount === 1) {
					left.setStyles(off);
					right.setStyles(off);
				} else if (carousel) {
					left.setStyles(on);
					right.setStyles(on);
				} else {
					left.setStyles( curpage ? on : off );
					right.setStyles( curpage + 1 < pagecount ? on : off );
				}
				this.alignArrows(curpage, pagecount);
			},

			alignArrows: emptyFn
		},

		config: {
			background: false,
			arrowPadding: 8,
			focusArrows: false,
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
			var firstblush = this.retrieve('value') === undefined,
				stringvalue = value === undefined ? '' : String(value);

			if ((this.retrieve('value') || '') === stringvalue && !firstblush) {
				return '';
			}

			this.store('value', stringvalue);

			this.fire( firstblush ? 'onTabInitialized' : 'onTabChanged', { value: stringvalue, index: this.getActiveIndex() } );
			this.update();
			return this.getValue();
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

		initTabs: function (values, labels, reset) {
			this.setOptions(values, labels, reset);
			if (this.getValue().length === 0 || reset) {
				this.setValue(this.config.value || this.getOptions()[0].value);
			}
		},

		setOptions: function (values, labels, reset) {
			values = (values instanceof Array) ? values : [values];
			var options = values.map(function(value, v){
				var o = typeof value == 'object',
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
			return this.getOptions().map(function(option) {
				return option.value;
			});
		},

		getOptionLabels: function () {
			return this.getOptions().map(function(option) {
				return option.label;
			});
		},

		getActiveIndex: function () {
			var options = this.getOptions(),
				value = this.getValue();

			var index = options.map(function(o) {
				return o.value;
			}).indexOf(value);

			return (index < 0) ? 0 : index;
		},

		shiftSource: function (direction) {
			var options = this.getOptions(),
				carousel = (this.config.carousel === true),
				index = this.getActiveIndex();

			if (options.length < 2) return;

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

			if (reset === true)
				this.setValue(options[0].value);

			var curpage = options.map(function(o) {
					return o.value;
				}).indexOf(this.getValue()),
				pagecount = options.length,
				dispval = this.getDisplayValue();

			this.text.setText(dispval);

			curpage = curpage < 0 ? 0 : curpage;
			this.updateArrows(curpage, pagecount);
		},

		suicide: function () {
			this.text.suicide();
			delete this.text;
			Object.forEach(this.arrows, function (key, obj) {
				delete this.arrows[key];
				if (obj && obj.suicide) {
					try {
						obj.suicide();
					} catch(err) {
						error(obj, err);
					}
				}
			}, this);
			delete this.arrows;
			this.parent();
		}
	});
}, {
	ControlSingleTab: 'ControlPageIndicator',
	ControlSingleTabArrowleft: {
		styles: {
			borderTop: '8px solid transparent',
			borderBottom: '8px solid transparent',
			borderRight: '8px solid white'
		}
	},
	ControlSingleTabArrowright: {
		styles: {
			borderTop: '8px solid transparent',
			borderBottom: '8px solid transparent',
			borderLeft: '8px solid white'
		}
	}
});
