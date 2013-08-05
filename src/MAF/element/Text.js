define('MAF.element.Text', function () {
	return new MAF.Class({
		ClassName: 'BaseText',

		Extends: MAF.element.Core,

		Protected: {
			dispatcher: function (nodeEvent, payload) {
				this.parent(nodeEvent, payload);
				switch(nodeEvent.type) {
					case 'change':
						this.fire('onChange', payload, nodeEvent);
						break;
					case 'layoutchange':
						this.fire('onLayoutChange', payload, nodeEvent);
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
					'visibleLines',
					'firstLine',
					'anchorStyle',
					'color'
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
			this.data = this.config.data || this.config.text || this.config.label;
		},

		setText: function (text) {
			this.element.data = text;
		}
	});
});
