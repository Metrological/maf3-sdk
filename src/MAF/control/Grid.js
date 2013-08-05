define('MAF.control.Grid', function () {
	return new MAF.Class({
		ClassName: 'ControlGrid',

		Extends: MAF.element.Grid,

		Protected: {
			onThemeNeeded: function (event) {
				switch(event.type){
					case 'onFocus':
						//this.applyThemeStyles('focused');
						this.renderSkin('focused');
						break;
					case 'onBlur':
					case 'onAppend':
						//this.applyThemeStyles('normal');
						this.renderSkin('normal');
						break;
				}
			}
		},
		initialize: function () {
			this.parent();
			//this.createRovingHighlight();
			this.onThemeNeeded.subscribeTo(this, ['onAppend','onFocus','onBlur'], this);
		},

		focusCell: function (target) {
			this.parent(target);
			//this.updateRovingHighlight({visible:true,target:this._state.focusCoordinates});
			return this;
		},

		blurCell: function (target) {
			this.parent(target);
			//this.updateRovingHighlight({visible:false});
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
