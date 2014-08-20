define('MAF.element.SlideCarouselCell', function(){
	return new MAF.Class({
		ClassName: 'SlideCarouselCell',
		Extends: MAF.element.Container,

		Protected: {
			proxyProperties: function(propnames){
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
				var el = this.element;
				getter(this, 'width', function () {
					return this.getCellDimensions().width || el.width;
				});
				getter(this, 'height', function () {
					return this.getCellDimensions().height || el.height;
				});
				getter(this, 'outerWidth', function () {
					return this.width + (el.hOffset || 0);
				});
				getter(this, 'outerHeight', function () {
					return this.height + (el.vOffset || 0);
				});
				getter(this, 'id', function () {
					return el.getAttribute('id');
				});
				setter(this, 'id', function (id) {
					return el.setAttribute('id', id);
				});
				getter(this, 'disabled', function () {
					return this.element && this.element.disabled;
				});
				setter(this, 'disabled', function (disabled) {
					disabled = disabled || false;
					if (this.disabled !== disabled && this.element) {
						this.fire(disabled ? 'onDisable' : 'onEnable');
						this.element.disabled = disabled;
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

		getCellDataIndex: function(){
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