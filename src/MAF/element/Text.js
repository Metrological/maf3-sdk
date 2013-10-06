define('MAF.element.Text', function () {
	return new MAF.Class({
		ClassName: 'BaseText',

		Extends: MAF.element.Core,

		Protected: {
			dispatchEvents: function (event, payload) {
				this.parent(event, payload);
				switch(event.type) {
					case 'change':
						this.fire('onChange', payload, event);
						break;
					case 'layoutchange':
						this.fire('onLayoutChange', payload, event);
						break;
				}
			},
			proxyProperties: function (propnames) {
				this.parent([
					'data',
					'text',
					'size',
					'scrolling',
					'truncation',
					'wrap',
					'font',
					'lineHeight',
					'totalLines',
					'maxVisibleLindex',
					'visibleLines',
					'firstLine',
					'anchorStyle',
					'color',
					'textWidth',
					'textHeight'
				].concat(propnames || []));
			}
		},

		config: {
			element: Text
		},

		initialize: function () {
			this.config.anchorStyle = this.config.styles && this.config.styles.anchorStyle || this.config.anchorStyle;
			if (this.config.styles) {
				delete this.config.styles.anchorStyle;
			}
			if ('wrap' in this.config || 'truncation' in this.config) {
				if (!this.config.styles) {
					this.config.styles = {};
				}
				this.config.styles.wrap = 'wrap' in this.config.styles ? this.config.styles.wrap : this.config.wrap;
				this.config.styles.truncation = 'truncation' in this.config.styles ? this.config.styles.truncation : this.config.truncation;
				delete this.config.wrap;
				delete this.config.truncation;
			}

			this.parent();
			if (this.config.anchorStyle) {
				this.anchorStyle = this.config.anchorStyle;
			}
			if (this.config.visibleLines) {
				this.visibleLines = this.config.visibleLines;
			}
			this.setText(this.config.data || this.config.text || this.config.label);
		},

		setText: function (text) {
			this.element.data = text;
		}
	});
});
