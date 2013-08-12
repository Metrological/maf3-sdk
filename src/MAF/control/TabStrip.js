define('MAF.control.TabStrip', function () {
	var getSafeIndex = function (idx, arr) {
		arr = arr || [];
		var i = Math.max(0, Math.min(idx, arr.length-1));
		return arr[i];
	};
	return new MAF.Class({
		ClassName: 'ControlTabStrip',

		Extends: MAF.element.Container,

		Protected: {
			onThemeNeeded: function (event) {
				switch (event.type) {
					case 'onAppend':
						this.initTabs(this.config.tabs, this.focusIndex);
						break;
				}
			},
			handleFocusEvent: function (event) {
				var index  = this.focusIndex || 0,
					active = parseInt(this.activeIndex, 10) > -1 ? this.activeIndex : -1;
				switch (event.type) {
					case 'onFocus':
						if (index === active) {
							index = active > 0 ? active - 1 : active < this.buttons.length - 1 ? active + 1 : index;
							this.focusIndex = index;
						}
						this.focusButton(index);
						break;
					case 'onBlur':
						this.blurButton(index);
						break;
				}
			},
			handleSelectEvent: function (event) {
				return this.activateButton(this.focusIndex);
			},
			handleNavEvent: function (event) {
				var index = this.focusIndex,
					active = this.activeIndex,
					target = false;
				switch (event.payload.direction) {
					case 'left':
						if (index) {
							target = index - 1;
						}
						if (target == active) {
							target = active ? active - 1 : false;
						}
						break;
					case 'right':
						if (index < this.buttons.length - 1) {
							target = index + 1;
						}
						if (target && target == active) {
							target = active < this.buttons.length - 1 ? active + 1 : false;
						}
						break;
				}
				if (target !== false) {
					event.preventDefault();
					this.focusIndex = target;
					this.focusButton(target);
					this.blurButton(index);
				}
			},
			focusButton: function (index) {
				var button = getSafeIndex(index, this.buttons);
				if (button) {
					var owner = this.body.owner;
					button.fire('onFocus');
					owner.scrollLeft = button.getStyle('left') + owner.scrollLeft - (1 + owner.element.getBounds().left);
				}
			},
			blurButton: function (index) {
				var button = getSafeIndex(index, this.buttons);
				if (button) {
					button.fire('onBlur');
				}
			},
			activateButton: function (index) {
				var activeButton = this.buttons[this.activeIndex] || false,
					active = this.buttons[index] || false;

				if (active && active.fire) {
					var conf = this.getButtonConfig(active);
					conf.index = index;
					this.activeIndex = index;
					
					active.fire('onActive');
					this.fire('onTabSelect', conf);
				}
				if (activeButton && activeButton.fire) {
					activeButton.fire('onInactive');
				}
			},
			generateButtons: function (count, noimages) {
				this.buttons = this.buttons || [];
				while (this.buttons.length > 0) {
					var button = this.buttons.pop();
					button.tabController = null;
					button.suicide();
				}
				this.buttons.length = 0;
				this.body.empty();
				count = parseInt(count, 10) > -1 ? count : 0;
				for (var j = 0; j < count; j++) {
					this.buttons[j] = this.createButton(noimages).hide().appendTo(this.body);
				}
				return this.buttons.length;
			},
			createButton: function (noimages) {
				var TabStripButton = MAF.control.TabStripButton,
					ButtonClass = this.config.buttonClass,
					button;
				if (ButtonClass && ButtonClass.inheritsFrom && ButtonClass.inheritsFrom(TabStripButton)) {
					button = new ButtonClass({
						noimages: noimages
					});
				} else {
					button = new TabStripButton({
						noimages: noimages
					});
				}
				button.tabController = this;
				return button;
			},
			inspectStatePacket: function (packet, focusOnly) {
				if (!this.config.guid) {
					return packet;
				}
				
				if (packet && !(this.config.guid in packet)) {
					return packet;
				}
				var data = packet && packet[this.config.guid],
					type = typeof data;
				
				if (type == 'null' || type == 'undefined') {
					return packet;
				}
				if (focusOnly) {
					if (data.focused) {
						this.focus();
					}
				} else if (type === 'object') {
					if ('activeIndex' in data) {
						this.activeIndex = data.activeIndex;
					}
					if ('focusIndex' in data) {
						this.focusIndex = data.focusIndex;
					}
				}
				return data;
			},
			generateStatePacket: function (packet) {
				return Object.merge({
					activeIndex: this.activeIndex,
					focusIndex:  this.focusIndex,
					focused:     this.element.hasFocus
				}, packet);
			}
		},

		config: {
			focus: true,
			defaultTab: null
		},

		initialize: function () {
			this.onThemeNeeded.subscribeTo(this, 'onAppend', this);
			this.handleFocusEvent.subscribeTo(this, ['onFocus', 'onBlur'], this);
			this.handleSelectEvent.subscribeTo(this, 'onSelect', this);
			this.handleNavEvent.subscribeTo(this, 'onNavigate', this);
			this.activeIndex = (this.config.defaultTab > 0) ? --this.config.defaultTab : -1;
			this.focusIndex = this.activeIndex + 1;
			this.parent();
			this.body = new MAF.element.Core({
				ClassName: (this.config.ClassName || this.ClassName) + 'Body',
				element: List
			}).appendTo(this);
		},

		initTabs: function (tabs, initialActiveTab) {
			initialActiveTab = initialActiveTab || (this.activeIndex + 1);
			if (tabs) {
				this.body.owner.scrollLeft = 0;
				this.activeIndex = (initialActiveTab > 0) ? --initialActiveTab : -1;
				this.focusIndex = (this.activeIndex < 1) ? 0 : this.activeIndex + 1;
				if (this.focusIndex === tabs.length) {
					this.focusIndex--;
				}
				this.config.tabs = tabs && tabs.length ? tabs : [];
				var active = this.activeIndex,
					w = 0,
					noimages = !this.config.tabs.filter(function (t) {
						return t.src || t.source;
					}).length;
				this.generateButtons(this.config.tabs.length, noimages);
				this.buttons.forEach(function (button, b) {
					button.setTabContent(this.config.tabs[b], noimages);
					button.show();
					var externalStyles = Theme.getStyles(button.ClassName),
						externalWidth = 0;
					['border', 'borderLeft', 'borderRight', 'marginLeft', 'marginRight'].forEach(function (type) {
						var value = (type === 'border') ? parseInt(externalStyles[type], 10) * 2 : parseInt(externalStyles[type], 10);
						externalWidth += value || 0;
					}, this);
					w += button.width + externalWidth;
					button.fire(b == this.activeIndex ? 'onActive' : 'onInactive');
				}, this);
				this.body.width = w || this.width;
				if (this.element.hasFocus) {
					var fidx = parseInt(this.focusIndex, 10) || 0;
					this.focusButton(fidx);
				}
			}
		},

		getActiveIndex: function () {
			return this.activeIndex;
		},

		getFocusIndex: function () {
			return this.focusIndex;
		},

		getButtonIndex: function (button) {
			return this.buttons.indexOf(button);
		},

		getButtonConfig: function (button) {
			var index = this.getButtonIndex(button);
			return index > -1 ? Object.clone(this.config.tabs[index]) : false;
		},

		suicide: function () {
			while(this.buttons.length) {
				this.buttons.pop().suicide();
			}
			delete this.buttons;
			this.body.suicide();
			delete this.body;
			this.parent();
		}
	});
}, {
	ControlTabStrip: {
		styles: {
			borderBottom: '2px solid grey',
			width: 'inherit',
			height: 51
		}
	},
	ControlTabStripBody: {
		styles: {
			height: 'inherit'
		}
	}
});
