define('MAF.control.Header', function () {
	var createContent = function () {
		var config = this.config,
			className = config.ClassName || this.ClassName,
			headerStyle = config.headerStyle && config.headerStyle.capitalize() || '';
		this.element.addClass(className + headerStyle);
		this.content = new MAF.element.Text({
			ClassName: className + 'Text' + headerStyle,
			label: config.label,
			styles: config.textStyles
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
			width: '100%',
			height: 'inherit',
			paddingLeft: 10,
			paddingRight: 10,
			fontSize: 18,
			anchorStyle: 'leftCenter',
			truncation: 'end'
		}
	},
	ControlHeaderTextLarge: {
		styles: {
			width: '100%',
			height: 'inherit',
			paddingLeft: 10,
			paddingRight: 10,
			fontSize: 24,
			anchorStyle: 'leftCenter',
			truncation: 'end'
		}
	}
});
