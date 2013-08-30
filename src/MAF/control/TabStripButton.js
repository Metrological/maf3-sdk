define('MAF.control.TabStripButton', function () {
	var createContent = function () {
		if (!this.config.noimages) {
			this.image = new MAF.element.Image({
				ClassName: this.ClassName + 'Image'
			}).appendTo(this);
		}
		this.content = new MAF.element.Text({
			ClassName: this.ClassName + 'Text'
		}).appendTo(this);
	};

	return new MAF.Class({
		ClassName: 'ControlTabStripButton',

		Extends: MAF.element.Container,

		config: {
			element: Item
		},

		Protected: {
			onThemeNeeded: function (event) {
				if (event.defaultPrevented) {
					return;
				}
				var el = this.element;
				switch (event.type) {
					case 'onFocus':
						el.addClass('focused');
						break;
					case 'onBlur':
						el.removeClass('focused');
						break;
					case 'onActive':
						el.addClass('selected');
						break;
					case 'onInactive':
						el.removeClass('selected');
						break;
				}
			},
			getTabController: function () {
				return this.tabController;
			}
		},

		initialize: function () {
			this.onThemeNeeded.subscribeTo(this, ['onAppend', 'onFocus', 'onBlur', 'onActive', 'onInactive'], this);
			this.parent();
			createContent.call(this);
		},

		getButtonIndex: function () {
			return this.getTabController().getButtonIndex(this);
		},

		setTabContent: function (tabconfig, noimages) {
			this.content.setText(tabconfig.label);
			if (this.image && (tabconfig.src || tabconfig.source)) {
				var margin = Theme.getStyles(this.ClassName + 'Image', 'marginTop') * 2,
					padding = Theme.getStyles(this.ClassName + 'Text', 'paddingLeft'),
					imageSize = this.height - margin;
				this.image.width = this.image.height = imageSize;
				this.image.setSources(tabconfig);
				this.content.setStyle('paddingLeft', padding + imageSize + (padding/2));
			}
		},

		// Deprecated. Not needed but a public function.
		adjustTabContent: emptyFn,

		suicide: function () {
			delete this.tabController;
			if (this.image) {
				this.image.suicide();
				delete this.image;
			}
			this.parent();
		}
	});
}, {
	ControlTabStripButton: {
		normal: {
			styles: {
				backgroundColor: Theme.getStyles('BaseGlow', 'backgroundColor'),
				borderTop: '2px solid white',
				borderLeft: '2px solid white',
				borderRight: '2px solid white',
				borderTopLeftRadius: '10px',
				borderTopRightRadius: '10px',
				marginLeft: 1,
				height: 'inherit',
				marginRight: 1
			}
		},
		selected: {
			styles: {
				backgroundColor: Theme.getStyles('BaseActive', 'backgroundColor')
			}
		},
		focused: {
			styles: {
				backgroundColor: Theme.getStyles('BaseFocus', 'backgroundColor')
			}
		}
	},
	ControlTabStripButtonText: {
		styles: {
			position: 'relative',
			fontSize: 20,
			fontWeight: 'bold',
			paddingLeft: 12,
			paddingRight: 12,
			height: 'inherit',
			anchorStyle: 'center'
		}
	},
	ControlTabStripButtonImage: {
		styles: {
			marginLeft: 12,
			marginTop: 4
		}
	}
});
