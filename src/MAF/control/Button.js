define('MAF.control.Button', function () {
	var updateSecureIndicator = function (event) {
		if (!this.secureIndicator && this.secure) {
			this.secureIndicator = new MAF.element.Text({
				ClassName: 'SecureButtonIndicator',
				data: '&#128274;'
			}).appendTo(this);
		}
		this.adjustAccessories();
	};

	return new MAF.Class({
		ClassName: 'ControlButton',

		Extends: MAF.element.Button,

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
						this.renderSkin('normal');
						break;
					case 'onAppend':
						this.renderSkin('normal');
						this.createContent();
						updateSecureIndicator.call(this);
						break;
				}
			}
		},

		initialize: function () {
			this.onThemeNeeded.subscribeTo(this, ['onFocus', 'onBlur', 'onAppend'] , this);
			updateSecureIndicator.subscribeTo(this, 'onChangedSecure', this);
			this.parent();
		},

		createContent: emptyFn,
		adjustAccessories: emptyFn,

		suicide: function () {
			if (this.secureIndicator) {
				this.secureIndicator.suicide();
				delete this.secureIndicator;
			}
			this.parent();
		}
	});
}, {
	ControlButton: {
		renderSkin: function (state, w, h, args, theme) {
			var ff = new Frame();
			theme.applyLayer('BaseGlow', ff);
			if (state === 'focused') {
				theme.applyLayer('BaseFocus', ff);
			}
			theme.applyLayer('BaseHighlight', ff);
			return ff;
		},
		styles: {
			width: 'inherit',
			height: 51
		}
	},
	SecureButtonIndicator: {
		styles: {
			hAlign: 'right',
			vAlign: 'bottom',
			hOffset: 5,
			vOffset: 7
		}
	}
});
