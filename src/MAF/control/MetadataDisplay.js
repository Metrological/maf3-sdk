define('MAF.control.MetadataDisplay', function () {
	return new MAF.Class({
		ClassName: 'ControlMetadataDisplay',

		Extends: MAF.control.Button,

		Protected: {
			createContent: function () {
				this.content = new MAF.element.Text({
					ClassName: this.ClassName + 'Text',
					styles: this.config.textStyles || {}
				}).appendTo(this);
			},
			updateContent: function (state) {
				var start   = state && parseInt(state.startIndex, 10) > -1 ? state.startIndex : this.source.getStartIndex(),
					focused = state && parseInt(state.focusIndex, 10) > -1 ? state.focusIndex : this.source.getFocusIndex(),
					index   = parseInt(start, 10) > -1 && parseInt(focused, 10) > -1 ? start + focused : false,
					item    = index !== false && this.getSourceDataItem(index);
				if (item) {
					var updater = this.config.updateMethod || this.updateMethod;
					if (updater && updater.call) {
						updater.call(this, item);
					}
				}
			},
			updateMethod: function (item) {
				var text = '';
				switch (typeOf(item)) {
					case 'string':
						text = item;
						break;
					case 'object':
						var map = this.config.metadataMap;
						if (map) {
							var key = map.label || map.text;
							text = item[key];
						} else if ('label' in item) {
							text = item.label;
						} else if ('text' in item) {
							text = item.text;
						}
						break;
				}
				this.setText(text);
			},
			onSourceUpdated: function (event) {
				switch (event.type) {
					case 'onStateUpdated':
						return this.updateContent(event.payload);
					case 'onFocus':
						this.fire('onFocus');
						this.content.thaw();
						break;
					case 'onBlur':
						this.fire('onBlur');
						this.content.freeze();
						break;
				}
			}
		},

		config: {
			focus: false
		},

		initialize: function () {
			this.parent();
			var source = this.config.sourceElement || this.config.source;
			if (source) {
				this.attachToSource(source);
			}
			this.config.source = null;
			delete this.config.source;
			this.config.sourceElement = null;
			delete this.config.sourceElement;
		},

		attachToSource: function (source) {
			if (source === this.source) {
				return this.update();
			}
			this.source = source;
			this.onSourceUpdated.subscribeTo(this.source, ['onStateUpdated', 'onFocus', 'onBlur'], this);
			return this.updateContent();
		},

		getSourceStartIndex: function () {
			return this.source && this.source.getStartIndex();
		},

		getSourceFocusIndex: function () {
			return this.source && this.source.getFocusIndex();
		},

		getSourceDataItem: function (index) {
			return this.source && this.source.getDataItem(index);
		},

		setText: function (text) {
			this.content.setText(text || '');
		},

		suicide: function () {
			delete this.source;
			this.parent();
		}
	});
}, {
	ControlMetadataDisplay: {
		styles: {
			width: 'inherit',
			height: 40
		}
	},
	ControlMetadataDisplayText: {
		styles: {
			width: '100%',
			height: 'inherit',
			paddingLeft: 5,
			paddingRight: 5,
			anchorStyle: 'center',
			truncation: 'end'
		}
	}
});
