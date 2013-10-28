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
			if (this.config.theme !== false) {
				this.onThemeNeeded.subscribeTo(this, ['onAppend', 'onFocus', 'onBlur'], this);
			}
			this.parent();
		}
	});
}, {});
