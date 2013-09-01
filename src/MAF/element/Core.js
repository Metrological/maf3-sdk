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

		initialize: function () {
			this.initElement();
			this.children = [];
			this.setStyles(this.config.styles);
		},

		getView: function () {
			return this.getWindow();
		},

		show: function () {
			this.element.visible = true;
			return this;
		},

		hide: function () {
			this.element.visible = false;
			return this;
		},

		freeze: function () {
			this.element.updatesEnabled = false;
			return this;
		},

		thaw: function () {
			this.element.updatesEnabled = true;
			return this;
		},

		animate: function (config) {
			delete config.callback;
			if (config.events && config.events.onAnimationEnded) {
				config.callback = config.events.onAnimationEnded;
				delete config.events;
			}
			return this.element && this.element.animate.call(this, config);
		},

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
