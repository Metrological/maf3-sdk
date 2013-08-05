define('MAF.control.GridCell', function () {
	return new MAF.Class({
		ClassName: 'ControlGridCell',

		Extends: MAF.element.GridCell,

		Protected: {
			onThemeNeeded: function (event) {
				if (event.defaultPrevented) {
					return;
				}
				var cc = this.getCellCoordinates();
				switch(event.type){
					case 'onFocus':
						this.element.addClass('focused');
						//this.renderSkin('focused', cc);
						break;
					case 'onBlur':
					case 'onAppend':
						this.element.removeClass('focused');
						//this.renderSkin('normal', cc);
						break;
				}
			}
		},

		initialize: function () {
			this.parent();
			this.onThemeNeeded.subscribeTo(this, ['onAppend','onFocus','onBlur'], this);
		}
	});
}, {
	ControlGridCell: {
		normal: {
			styles: {
				backgroundColor: Theme.getStyles('BaseGlow', 'backgroundColor')
			}
		},
		focused: {
			styles: {
				backgroundColor: Theme.getStyles('BaseFocus', 'backgroundColor')
			}
		},
		highlight: {
			styles: {
				backgroundColor: Theme.getStyles('BaseActive', 'backgroundColor')
			}
		}
	}
});
