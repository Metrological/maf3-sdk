define('MAF.element.Core', function () {
	return new MAF.Class({
		ClassName: 'BaseCore',

		Implements: [
			Library.Storage,
			Library.DOM,
			Library.Styles
		],

		Protected: {
			dispatcher: function () {
			},
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
				this.elementEvents();

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
			elementEvents: function (types) {
				if (!types) {
					return;
				}
				var listener = this.dispatcher.bindTo(this);
				[].concat(types).forEach(function (type){
					type = type && type.type ? type.type : type;
					var phase = type.phase === true;
					if (type && this.element) {
						this.element.addEventListener(type, listener, phase);
					}
				}, this);
			},
			getViewController: function () {
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
			return this.getViewController();
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

		getAbsolutePosition: function () {
			var habs = this.hOffset,
				vabs = this.vOffset,
				wind = this.element.window,
				supr = this.element.parentNode;

			if (wind && supr) {
				while (supr && wind !== supr) {
					habs += supr.hOffset;
					vabs += supr.vOffset;
					supr =  supr.parentNode;
				}
			}

			return {
				hOffset: habs,
				vOffset: vabs
			};
		}
	});
});
