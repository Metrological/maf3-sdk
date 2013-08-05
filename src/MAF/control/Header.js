define('MAF.control.Header', function () {
	var createContent = function () {
		this.content = new MAF.element.Text({
			ClassName: (this.config.ClassName || this.ClassName) + 'Text' + this.config.headerStyle.capitalize(),
			label: this.config.label,
			styles: this.config.textStyles
		}).appendTo(this);
	};

	return new MAF.Class({
		ClassName: 'ControlHeader',

		Extends: MAF.element.Container,

		config: {
			headerStyle: 'large'
		},

		initialize: function () {
			delete this.config.focus;
			this.parent();
			this.element.addClass((this.config.ClassName || this.ClassName) + this.config.headerStyle.capitalize());
			createContent.call(this);
		},

		setText: function (text) {
			this.content.setText(text);
		}
	});
}, {
	ControlHeader: {
		styles: {
			backgroundColor: Theme.getStyles('BaseGlow', 'backgroundColor'),
			width: 'inherit'
		}
	},
	ControlHeaderSmall: {
		styles: {
			height: '32px'
		}
	},
	ControlHeaderLarge: {
		styles: {
			height: '48px'
		}
	},
	ControlHeaderTextSmall: {
		styles: {
			width: 'calc(100% - 20px)',
			height: 'inherit',
			hOffset: 10,
			fontSize: 18,
			anchorStyle: 'leftCenter',
			truncation: 'end'
		}
	},
	ControlHeaderTextLarge: {
		styles: {
			width: 'calc(100% - 20px)',
			height: 'inherit',
			hOffset: 10,
			fontSize: 24,
			anchorStyle: 'leftCenter',
			truncation: 'end'
		}
	}
});
