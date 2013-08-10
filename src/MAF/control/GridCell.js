define('MAF.control.GridCell', function () {
	return new MAF.Class({
		ClassName: 'ControlGridCell',

		Extends: MAF.element.GridCell,

		Protected: {
			onThemeNeeded: function (event) {
				if (event.defaultPrevented) {
					return;
				}
				var coords = this.getCellCoordinates();
				switch(event.type) {
					case 'onFocus':
						this.renderSkin('focused', coords);
						break;
					case 'onBlur':
					case 'onAppend':
						this.renderSkin('normal', coords);
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
	ControlGridCell: {
		renderSkin: function (state, w, h, args, theme) {
			var ff = new Frame();
			theme.applyLayer('BaseGlow', ff);
			if (state === 'focused') {
				theme.applyLayer('BaseFocus', ff);
			}
			theme.applyLayer('BaseHighlight', ff);
			return ff;
		}
	}
});
