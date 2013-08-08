define('MAF.element.Image', function () {
	return new MAF.Class({
		ClassName: 'BaseImage',

		Extends: MAF.element.Core,

		Protected: {
			dispatcher: function (nodeEvent, payload) {
				this.parent(nodeEvent, payload);
				switch (nodeEvent.type) {
					case 'load':
						this.fire('onLoaded', payload, nodeEvent);
						if (this.config.autoShow) {
							this.show();
						}
						if (this.config.manageWaitIndicator) {
							MAF.utility.WaitIndicator.down();
						}
						break;
					case 'error':
						this.fire('onError', payload, nodeEvent);
						if (this.config.autoShow) {
							this.show();
						}
						if (this.config.manageWaitIndicator) {
							MAF.utility.WaitIndicator.down();
						}
						break;
					default:
						break;
				}
			},
			elementEvents: function (eventTypes) {
				this.parent([
					'load',
					'error'
				].concat(eventTypes || []));
			},
			proxyProperties: function (propnames) {
				this.parent([
					'source',
					'srcWidth',
					'srcHeight',
					'colorize',
					'remoteAsync'
				].concat(propnames || []));

				getter(this, 'src', function () {
					return this.element && this.element.source;
				});
				setter(this, 'src', function (src) {
					if (this.element) {
						this.element.source = src;
					}
				});
			}
		},

		config: {
			remoteAsync: true,
			element: Image,
			hideWhileLoading: false,
			autoShow: true,
			manageWaitIndicator: false
		},

		initialize: function () {
			this.parent();
			this.remoteAsync = (this.config.remoteAsync === false) ? false : true;
			delete this.config.remoteAsync;
			this.setSources(this.config);
		},

		getSource: function () {
			return this.source;
		},

		setSource: function (source) {
			return this.setSources({ src: source });
		},

		setSources: function (object) {
			object = object || {};
			var img = this.element,
				cfg = this.config,
				src = object.src || object.source;

			if ('missingSrc' in object) {
				img.missingSrc = cfg.missingSrc = object.missingSrc;
			}
			if ('loadingSrc' in object) {
				img.loadingSrc = cfg.loadingSrc = object.loadingSrc;
			}
			if (src !== undefined) {
				//@TODO workaround for setting the same source
				if (img.source !== '' && src === cfg.src) {
					return this;
				}
				img.remoteAsync = (cfg.remoteAsync === false) ? false : true;
				if (cfg.manageWaitIndicator) {
					MAF.utility.WaitIndicator.up();
				}
				if (cfg.hideWhileLoading) {
					this.hide();
				}
				img.source = cfg.src = src;
				delete cfg.source;
			}
			return this;
		},

		aspectSizeMax: function (size) {
			var h, w, ratio = this.srcWidth / this.srcHeight;
			if (ratio >= 1) {
				w = size;
				h = size / ratio;
			} else {
				w = size * ratio;
				h = size;
			}
			return this.setStyles({
				width: w,
				height: h
			});
		},

		aspectSizeMin: function (size) {
			var h, w, ratio = this.srcWidth / this.srcHeight;
			if (ratio >= 1) {
				w = size * ratio;
				h = size;
			} else {
				w = size;
				h = size / ratio;
			}
			return this.setStyles({
				width: w,
				height: h
			});
		},

		aspectSizeBestFit: function (width, height, preferredSide) {
			var scale = 0;
			if (preferredSide === 'height') {
				scale = height / this.srcHeight;
				if (width > this.srcWidth * scale) {
					this.setStyles({
						width: this.srcWidth * scale,
						height: height
					});
				} else {
					scale = width / (this.srcWidth * scale);
					this.setStyles({
						width: width,
						height: height * scale
					});
				}
			} else {
				scale = width / this.srcWidth;
				if (height > this.srcHeight * scale) {
					this.setStyles({
						width: width,
						height: this.srcHeight * scale
					});
				} else {
					scale = height / (this.srcHeight * scale);
					this.setStyles({
						width: width * scale,
						height: height
					});
				}
			}
		},

		fitToParent: function () {
			var pn = this.element && this.element.parentNode;
			return pn ? this.aspectSizeMax(Math.min(pn.width, pn.height)) : null;
		},

		fillParent: function () {
			var pn = this.element && this.element.parentNode;
			return pn ? this.aspectSizeMin(Math.max(pn.width, pn.height)) : null;
		},

		colorizeToTheme: function () {
//			this.colorize = Theme.getColors().colorize;
			return this;
		}
	});
});
