define('MAF.control.Button', function () {
	var updateSecureIndicator = function (event) {
		var key  = 'SecureButtonIndicator',
			sts  = Theme.getStyles(key),
			src  = Theme.storage[key] && Theme.storage[key].source,
			right  = sts && sts.hAlign == 'right',
			bottom = sts && sts.vAlign == 'bottom';

		if (!this.secureIndicator && this.secure) {
			if (src) {
				this.secureIndicator = new MAF.element.Image({
					src: src,
					styles: sts
				}).appendTo(this);
			} else {
				this.secureIndicator = new MAF.element.Text({
					data: '&#128274;',
					styles: sts
				}).appendTo(this);
			}
		}

		if (this.secureIndicator) {
			// TODO: lock not defined, will give error when no hAlign/vAlign in theming at the moment
			this.secureIndicator.setStyles({
				hOffset: right  ? parseInt(sts.marginRight  || 0, 10) : lock.hOffset,
				vOffset: bottom ? parseInt(sts.marginBottom || 0, 10) : lock.vOffset,
				visible: this.secure
			});
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
		adjustAccessories: emptyFn
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
		source: false,
		normal: {
			styles: {
				visible: false,
				hAlign: 'right',
				vAlign: 'bottom',
				marginRight: 5,
				marginBottom: 7
			}
		}
	}
});
