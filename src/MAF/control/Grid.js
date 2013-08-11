define('MAF.control.Grid', function () {
	return new MAF.Class({
		ClassName: 'ControlGrid',

		Extends: MAF.element.Grid,

		Protected: {
			generateCells: function (count) {
				var l = this.parent(count);
				this.cells.forEach(function (cell) {
					cell.fire('onAppend', {
						parent: this.element,
						owner: this
					})
				}, this);
				return l;
			},
			onThemeNeeded: function (event) {
				if (event.defaultPrevented) {
					return;
				}
				switch(event.type) {
					case 'onFocus':
						this.renderSkin('focused');
						break;
					case 'onBlur':
					case 'onAppend':
						this.renderSkin('normal');
						break;
				}
			}
		},

		initialize: function () {
			this.parent();
			this.onThemeNeeded.subscribeTo(this, ['onAppend', 'onFocus', 'onBlur'], this);
		}
	});
}, {
	ControlGrid: {
		renderSkin: function (state, w, h, args, theme) {
			return;
		}
	},
	ControlGridCellHighlight: {
		
	}
});
