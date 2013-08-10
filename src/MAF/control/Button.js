define('MAF.control.Button', function () {
	var updateSecureIndicator = function (event) {
		var key  = 'SecureButtonIndicator',
			sts  = Theme.getStyles(key),
			src  = Theme.storage[key] && Theme.storage[key].source,
			right  = sts && sts.hAlign == 'right',
			bottom = sts && sts.vAlign == 'bottom';

		if (!this.secureIndicator && this.secure) {
			this.secureIndicator = new MAF.element.Image({
				src: src,
				styles: sts
			}).appendTo(this);
		}

		if (this.secureIndicator) {
			this.secureIndicator.setStyles({
				hOffset: right  ? this.width  - parseInt(sts.marginRight  || 0, 10) : lock.hOffset,
				vOffset: bottom ? this.height - parseInt(sts.marginBottom || 0, 10) : lock.vOffset,
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
		source: Image.BLANK
	}
});
