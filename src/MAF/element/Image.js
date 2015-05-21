/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2014  Metrological
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/
/** 
 * @class MAF.element.Image
 * @extends MAF.element.Core
 * @classdesc > This is a base image component.
 */
/**
 * @cfg {Boolean} hideWhileLoading Do not show the src image while loading. Default true.
 * @memberof MAF.element.Image
 */
/**
 * @cfg {Boolean} autoShow Show the src image when it is done loading.
 * @memberof MAF.element.Image
 */
/**
 * @cfg {Boolean} manageWaitIndicator Show the framework waitindicator while image is loading. Default false.
 * @memberof MAF.element.Image
 */
/**
 * @cfg {String} src Path of the image.
 * @memberof MAF.element.Image
 */
/**
 * @cfg {String} source Path of the image.
 * @memberof MAF.element.Image
 * @deprecated Will be removed in a future release, use src instead.
 */
/**
 * @cfg {String} missingSrc When the src image has problems loading this image will be shown in its place.
 * @memberof MAF.element.Image
 */
/**
 * @cfg {String} aspect This will put a aspect on the image based on the size of this component.
 * </br> Aspect options:
 * 
 * | Name          | Alternative name | Description   |
 * | -------------:|:----------------:| ------------- |
 * | fit           | parent, exact    | This will stretch the image inside its parent, without looking at ratio.  |
 * | height        | portrait         | Resize image based on height  |
 * | width         | landscape        | Resize image based on width |
 * | auto          | parent/exact     | Automatically resize for best fit inside parent. |
 * | crop          | parent/exact     | Crop the image so it will fit inside its parent. |
 * | source        |                  | When you don't want to change the aspect but want to have the image cached |
 * @memberof MAF.element.Image
 */
/**
 * @cfg {Number} srcWidth If you know the width of the image you can define it here. Not all browsers get this info in time.
 * @memberof MAF.element.Image
 */
/**
 * @cfg {Number} srcHeight If you know the height of the image you can define it here. Not all browsers get this info in time.
 * @memberof MAF.element.Image
 */
/**
 * @cfg {Number} remoteAsync The image is loaded asynchronously. You can place a alternative image in its place while it is loading. Default is true.
 * @memberof MAF.element.Image
 */
/**
 * Fired when the source image finished loading.
 * @event MAF.element.Text#onLoaded
 */
/**
 * Fired when the source image had problems loading.
 * @event MAF.element.Text#onError
 */
define('MAF.element.Image', function () {
	return new MAF.Class({
		ClassName: 'BaseImage',

		Extends: MAF.element.Core,

		Protected: {
			dispatchEvents: function (event, payload) {
				this.parent(event, payload);
				switch (event.type) {
					case 'load':
						this.fire('onLoaded', payload, event);
						if (this.config.autoShow) {
							this.show();
						}
						if (this.config.manageWaitIndicator) {
							MAF.utility.WaitIndicator.down();
						}
						break;
					case 'error':
						if (this.config.missingSrc) {
							this.element.source = this.config.missingSrc;
						}
						this.fire('onError', payload, event);
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
			registerEvents: function (eventTypes) {
				this.parent(['load', 'error'].concat(eventTypes || []));
			},
			proxyProperties: function (propnames) {
				this.parent([
					'source',
					'aspect',
					'srcWidth',
					'srcHeight',
					'region',
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
			if (this.config.aspect) {
				this.aspect = this.config.aspect;
			}
			if (this.config.region) {
				this.region = this.config.region;
			}
			this.setSources(this.config);
		},

		/**
		 * Returns the src path of the image currently on this component.
		 * @method MAF.element.Image#getSource
		 */
		getSource: function () {
			return this.source;
		},

		/**
		 * Set the src config of this component with a new image path.
		 * @param {String} source Path of the image.
		 * @method MAF.element.Image#setSource
		 */
		setSource: function (source) {
			return this.setSources({ src: source });
		},

		/**
		 * Set the sources of the this component.
		 * @param {Object} object Can contain src/missingSrc image path.
		 * ```
		 * image.setSources({
		 *    src: 'path/to/image.png',
		 *    missingSrc: 'path/to/missing.png'
		 * })
		 * ```
		 * @method MAF.element.Image#setSources
		 */
		setSources: function (object) {
			object = object || {};
			var img = this.element,
				cfg = this.config,
				src = object.src || object.source;

			if ('missingSrc' in object) {
				cfg.missingSrc = object.missingSrc;
			}
			if (src) {
				if (cfg.manageWaitIndicator) {
					MAF.utility.WaitIndicator.up();
				}
				if (cfg.hideWhileLoading) {
					this.hide();
				}
			}
			if (img && cfg) {
				var sameSrc = cfg.src === src;
				img.source = cfg.src = src;
				if (sameSrc && src && src !== Image.BLANK) {
					this.fire('onLoaded');
					if (cfg.autoShow) {
						this.show();
					}
					if (cfg.manageWaitIndicator) {
						MAF.utility.WaitIndicator.down();
					}
				}
			}
			delete cfg.source;
			return this;
		},

		/**
		 * The image will be resized maintaining aspect ratio. Will try maximize the image's width.
		 * @param {Number} size Will resize based on this parameter in pixels
		 * @method MAF.element.Image#aspectSizeMax
		 */
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

		/**
		 * The image will be resized maintaining aspect ratio. Will maximize the image's height.
		 * @param {Number} size Will resize based on this parameter in pixels
		 * @method MAF.element.Image#aspectSizeMin
		 */
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

		/**
		 * While keeping aspect this method tries to fit the image in a certain space as best as possible.
		 * @param {Number} width How wide the space is in pixels.
		 * @param {Number} height How high the space is in pixels.
		 * @param {String} preferredSide Define which side is the prefered side to be maximized in size.
		 * @method MAF.element.Image#aspectSizeBestFit
		 */
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

		/**
		 * Based on the parents width and height the image will be resized maintaining aspect ratio. Will maximize the image's height. Returns null if there is no parent.
		 * @method MAF.element.Image#fitToParent
		 */
		fitToParent: function () {
			var pn = this.element && this.element.parentNode;
			return pn ? this.aspectSizeMax(Math.min(pn.width, pn.height)) : null;
		},

		/**
		 * Based on the parents width and height the image will be resized maintaining aspect ratio. Will maximize the image's width. Returns null if there is no parent.
		 * @method MAF.element.Image#fillParent
		 */
		fillParent: function () {
			var pn = this.element && this.element.parentNode;
			return pn ? this.aspectSizeMin(Math.max(pn.width, pn.height)) : null;
		}
	});
});
