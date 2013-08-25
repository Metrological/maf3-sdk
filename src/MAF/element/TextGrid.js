define('MAF.element.TextGrid', function () {
	return new MAF.Class({
		ClassName: 'BaseTextGrid',

		Extends: MAF.element.Text,

		Protected: {
			dispatchEvents: function (event, payload) {
				if (event.type === 'layoutchange') {
					this.fire('onStateUpdated', {
						currentPage: this.getCurrentPage(),
						pageCount: this.getPageCount()
					}, event);
				}
				this.parent(event, payload);
			},
			registerEvents: function (eventTypes) {
				this.parent([
					'change',
					'layoutchange'
				].concat(eventTypes || []));
			}
		},

		initialize: function () {
			this.parent();
			this.element.allowChangeEvents = true;
		},

		getCurrentPage: function () {
			return Math.round(this.getPageCount() * this.firstLine / this.totalLines);
		},

		getPageCount: function () {
			return Math.ceil(this.totalLines / this.visibleLines);
		},

		getStartLine: function (pagenum) {
			return pagenum * this.visibleLines;
		},

		shift: function (direction) {
			var current = this.getCurrentPage(),
				lastpage = this.getPageCount(),
				target;

			switch (direction) {
				case 'left':
					target = Math.max(current - 1, 0);
					break;
				case 'right':
					target = Math.min(current + 1, lastpage - 1);
					break;
			}
			this.firstLine = this.getStartLine(target);
			return this;
		},

		attachAccessory: function (accessory) {
			if (accessory && accessory.attachToSource) {
				accessory.attachToSource(this);
			}
			return this;
		},

		attachAccessories: function () {
			Array.slice(arguments).forEach(this.attachAccessory, this);
			return this;
		},

		setText: function (text) {
			this.freeze();
			this.firstLine = 0;
			this.parent(text);
			this.thaw();
		}
	});
});
