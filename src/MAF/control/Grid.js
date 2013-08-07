define('MAF.control.Grid', function () {
	return new MAF.Class({
		ClassName: 'ControlGrid',

		Extends: MAF.element.Grid,

		Protected: {
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
			this.onThemeNeeded.subscribeTo(this, ['onAppend','onFocus','onBlur'], this);
		},

		focusCell: function (target) {
			this.parent(target);
			return this;
		},

		blurCell: function (target) {
			this.parent(target);
			return this;
		}
	});
}, {
	ControlGrid: {
		normal: {
			styles: {
				backgroundColor: 'transparent'
			}
		},
		focused: {
			styles: {
				backgroundColor: 'rgba(83,16,30,.12)'
			}
		}
	},
	ControlGridCellHighlight: {
		
	}
});
