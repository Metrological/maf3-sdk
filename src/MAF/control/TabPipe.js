define('MAF.control.TabPipe', function () {
	return new MAF.Class({
		ClassName: 'ControlTabPipe',

		Extends: MAF.control.TabStrip,

		config: {
			buttonClass: MAF.control.TabPipeButton
		},

		initialize: function () {
			this.parent();
			this.body.appendTo(new MAF.element.Container({
				ClassName: 'ControlTabPipeContainer'
			}).appendTo(this));
		}
	});
}, {
	ControlTabPipe: {
		styles: {
			borderBottom: '2px solid grey',
			width: 'inherit',
			height: '57px'
		}
	},
	ControlTabPipeBody: 'ControlTabStripBody',
	ControlTabPipeContainer: {
		styles: {
			width: '100%',
			height: '100%',
			paddingTop: 6,
			paddingLeft: 18,
			paddingRight: 18
		}
	}
});
