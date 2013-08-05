define('MAF.control.MetadataDisplay', function () {
	return new MAF.Class({
		ClassName: 'ControlMetadataDisplay',

		Extends: MAF.control.Button,

		Protected: {
			createContent: function () {
				this.content = new MAF.element.Text({
					ClassName: this.ClassName+'Text',
					styles: this.config.textStyles || {}
				}).appendTo(this);
			},
			updateContent: function (state) {
				var start     = state && parseInt(state.startIndex, 10) > -1 ? state.startIndex : this.source.getStartIndex(),
					focused   = state && parseInt(state.focusIndex, 10) > -1 ? state.focusIndex : this.source.getFocusIndex(),
					dataindex = parseInt(start, 10) > -1 && parseInt(focused, 10) > -1 ? start + focused : false,
					dataitem  = dataindex !== false && this.getSourceDataItem( dataindex );
				if (dataitem) {
					var updater = this.config.updateMethod || this.updateMethod;
					if (updater && typeOf(updater) === 'function') {
						updater.call(this, dataitem);
					}
				}
			},
			updateMethod: function (dataitem) {
				var text = "";
				switch (typeof dataitem) {
					case 'string':
						text = dataitem;
						break;
					case 'object':
						var map = this.config.metadataMap;
						if (map) {
							var key = map.label || map.text;
							text = dataitem[key];
						} else if ('label' in dataitem) {
							text = dataitem.label;
						} else if ('text' in dataitem) {
							text = dataitem.text;
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
						this.content.show();
						break;
					case 'onBlur':
						this.fire('onBlur');
						this.content.hide();
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
			this.onSourceUpdated.subscribeTo(this.source, ['onStateUpdated','onFocus','onBlur'], this);
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
			this.content.data = text || "";
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
			width: 'calc(100% - 10px)',
			height: 'inherit',
			hOffset: 5,
			anchorStyle: 'center',
			truncation: 'end'
		}
	}
});
