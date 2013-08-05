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
			left: '18px',
			top: '6px',
			right: '18px',
			width: 'calc(100% - 36px)',
			height: '51px'
		}
	}
});
