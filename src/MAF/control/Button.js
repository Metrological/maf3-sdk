define('MAF.control.Button', function () {
	var updateSecureIndicator = function (event) {
		if (!this.secureIndicator && this.secure) {
			this.secureIndicator = new MAF.element.Text({
				ClassName: 'SecureButtonIndicator',
				label: FontAwesome.get('lock')
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
						break;
				}
			}
		},

		initialize: function () {
			if (this.config.theme !== false) {
				this.onThemeNeeded.subscribeTo(this, ['onFocus', 'onBlur', 'onAppend'] , this);
			} else {
				this.createContent.subscribeTo(this, 'onAppend' , this);
			}
			updateSecureIndicator.subscribeTo(this, 'onChangedSecure', this);
			this.parent();
			updateSecureIndicator.call(this);
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
			hOffset: 10,
			vOffset: 7
		}
	}
});
