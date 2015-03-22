define('MAF.element.SlideCarouselCell', function () {
	return new MAF.Class({
		ClassName: 'SlideCarouselCell',

		Extends: MAF.element.Container,

		Protected: {
			proxyProperties: function (propnames) {
				propnames = [
					'visible',
					'frozen',
					'hAlign',
					'vAlign',
					'rotate',
					'zOrder',
					'scrollLeft',
					'scrollTop'
				].concat(propnames || []);
				MAF.Class.Methods.proxyProperties(this, this.element, propnames);
				getter(this, 'width', function () {
					var el = this.element;
					return this.getCellDimensions().width || (el && el.width);
				});
				getter(this, 'height', function () {
					var el = this.element;
					return this.getCellDimensions().height || (el && el.height);
				});
				getter(this, 'outerWidth', function () {
					var el = this.element,
						width = el && el.width;
					return width !== undefined && (width + (el.hOffset || 0));
				});
				getter(this, 'outerHeight', function () {
					var el = this.element,
						height = el && el.height;
					return height !== undefined && (height + (el.vOffset || 0));
				});
				getter(this, 'id', function () {
					var el = this.element;
					return el && el.getAttribute('id');
				});
				setter(this, 'id', function (id) {
					var el = this.element;
					return el && el.setAttribute('id', id);
				});
				getter(this, 'disabled', function () {
					var el = this.element;
					return el && el.disabled;
				});
				setter(this, 'disabled', function (disabled) {
					disabled = disabled || false;
					var el = this.element;
					if (this.disabled !== disabled) {
						this.fire(disabled ? 'onDisable' : 'onEnable');
						if (el) el.disabled = disabled;
						this.fire('onChangeDisabled', {
							disabled: disabled
						});
					}
				});
			}
		},
		config: {
			focus: true,
			animation: true
		},
		/**
		 * @method MAF.element.SlideCarouselCell#getCellDimensions
		 * @return {Object} With the width and height of the cells for the grid.
		 */
		getCellDimensions: function () {
			return this.grid && this.grid.getCellDimensions() || {};
		},

		/**
		 * @method MAF.element.SlideCarouselCell#getCellDataItem
		 * @return {Mixed} Returns a dataset item.
		 */
		getCellDataItem: function () {
			return this.grid && this.grid.getCellDataItem(this);
		},

		getCellDataIndex: function () {
			return this.grid && this.grid.getCellDataIndex(this);
		},

		suicide: function () {
			delete this.grid;
			Object.forEach(this, function (key, obj) {
				if (key !== 'owner' && typeOf(obj) === 'instance' && obj.suicide && obj !== this) {
					delete this[key];
					obj.suicide();
				}
			}, this);
			this.parent();
		}
	});
});