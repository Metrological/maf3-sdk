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
 * @class MAF.element.Core
 * @classdesc > This is the base class for all MAF components. This component does not act on events from its element. Extended classes should define if they want to act on them.
 * @memberof MAF.element
 * @property {Number} width Width of the component
 * @property {Number} height Height of the component
 * @property {String} hAlign
 * @property {String} vAlign
 * @property {Number} hOffset
 * @property {Number} vOffset
 */
/**
 * @cfg {Object} events A object containing one or more event handlers to be added to this object during initialization. 
 * > The possible events are defined on each component.
 * @example MAF.element.Core({
 *    events: {
 *       onAppend: function () {
 *       	// do something
 *       }
 *    }
 * }).appendTo(this);
 * @memberof MAF.element.Core
 */
/**
 * @cfg {String} id The unique id of this class
 * @memberof MAF.element.Core
 */
/**
 * @cfg {Object} styles CSS styles for the component:
 * @param {Number} width The width of this component in pixels.
 * @param {Number} height The height of this component in pixels.
 * @param {String} [hAlign=left] Horizontal alignment of this component. (left, center, right)
 * @param {String} [vAlign=top] Vertical alignment of this component. (top, center, bottom)
 * @param {Number} [hOffset] Horizontal offset of this component in pixels.
 * @param {Number} [vOffset] Vertical offset of this component.
 * @memberof MAF.element.Core
 */
/**
 * Fired when component has appended to a parent. Update visual appearances by applying a Theme style and rendering the skin.
 * @event MAF.element.Core#onAppend
 */
/**
 * Fired when a animation on this component has ended.
 * @event MAF.element.Core#onAnimationEnded
 */
define('MAF.element.Core', function () {
	return new MAF.Class({
		ClassName: 'BaseCore',

		Implements: [
			Library.Storage,
			Library.DOM,
			Library.Styles
		],

		Protected: {
			initElement: function () {
				var El = this.config.element;
				if (El && El.nodeType) {
					// ignore
				} else if (El && El.prototype && El.prototype.constructor) {
					El = new El();
				} else {
					El = new this.constructor.prototype.config.element();
				}
				El.addClass(this.ClassName);
				if (this.config.ClassName) {
					El.addClass(this.config.ClassName);
				}

				this.config.element = null;
				delete this.config.element;

				El.owner = this;
				this.element = El;

				this.proxyProperties();
				this.registerEvents();

				if (this.config.id) {
					this.id = this.config.id;
				}

				if (this.config.frozen === true) {
					this.freeze();
				}
			},
			proxyProperties: function (propnames) {
				propnames = [
					'width',
					'height',
					'visible',
					'frozen',
					'hAlign',
					'vAlign',
					'rotate',
					'zOrder',
					'hOffset',
					'vOffset',
					'scrollLeft',
					'scrollTop'
				].concat(propnames || []);

				MAF.Class.Methods.proxyProperties(this, this.element, propnames);

				var el = this.element;
				getter(this, 'outerWidth', function () {
					return el.width + (el.hOffset || 0);
				});
				getter(this, 'outerHeight', function () {
					return el.height + (el.vOffset || 0);
				});
				getter(this, 'id', function () {
					return el.getAttribute('id');
				});
				setter(this, 'id', function (id) {
					return el.setAttribute('id', id);
				});
			},
			registerEvents: function (types) {
				if (!types) {
					return;
				}
				var listener = this.dispatchEvents.bindTo(this);
				[].concat(types).forEach(function (type){
					type = type && type.type ? type.type : type;
					var phase = type.phase === true;
					if (type && this.element) {
						this.element.addEventListener(type, listener, phase);
					}
				}, this);
			},
			dispatchEvents: emptyFn,
			getWindow: function () {
				var el = this.element,
					win = el && el.window;
				return win && win.owner;
			}
		},

		config: {
			element: Frame
		},
		/**
		 * Initialize the class
		 * @method MAF.element.Core#initialize
		 */
		initialize: function () {
			this.initElement();
			this.children = [];
			this.setStyles(this.config.styles);
		},

		/**
		 * @method MAF.element.Core#getView
		 * @return {Class} Returns the view this class is appended on.
		 */
		getView: function () {
			return this.getWindow();
		},

		/**
		 * Shows this component.
		 * @method MAF.element.Core#show
		 * @return {Class} This component.
		 */
		show: function () {
			this.element.visible = true;
			return this;
		},
		/**
		 * Hides this component.
		 * @method MAF.element.Core#hide
		 * @return {Class} This component.
		 */
		hide: function () {
			this.element.visible = false;
			return this;
		},
		/**
		 * Freezes this component. Screen renders no longer trigger until thawed.
		 * @method MAF.element.Core#freeze
		 * @return {Class} This component.
		 */
		freeze: function () {
			this.element.updatesEnabled = false;
			return this;
		},
		/**
		 * Thawes this component. Screen renders can trigger again.
		 * @method MAF.element.Core#thaw
		 * @return {Class} This component.
		 */
		thaw: function () {
			this.element.updatesEnabled = true;
			return this;
		},

		/**
		 * @method MAF.element.Core#animate
		 * @param {Object} config A config object
		 * @fires MAF.element.Core#onAnimationEnded
		 */
		animate: function (config) {
			var callback;
			if (config.events && config.events.onAnimationEnded) {
				callback = config.events.onAnimationEnded;
				delete config.events;
			} else if (config.callback) {
				callback = config.callback;
			}
			config.callback = function (animator) {
				if (callback && callback.call) {
					try {
						callback.call(this, animator);
					} catch(err) {}
				}
				try {
					this.fire('onAnimationEnded', animator);
				} catch(err) {}
			};
			return this.element && this.element.animate.call(this, config);
		},

		/**
		 * Give back the position relative to its first positioned ancestor element
		 * @method MAF.element.Core#getAbsolutePosition
		 * @return {Object} {hOffset:Number, vOffset: Number}
		 */
		getAbsolutePosition: function () {
			var hPosition = this.hOffset,
				vPosition = this.vOffset,
				cWindow = this.element.window,
				parent = this.element.parentNode;

			if (cWindow && parent) {
				while (parent && cWindow !== parent) {
					hPosition += parent.hOffset;
					vPosition += parent.vOffset;
					parent =  parent.parentNode;
				}
			}

			return {
				hOffset: hPosition,
				vOffset: vPosition
			};
		}
	});
});
