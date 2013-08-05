var TestView1 = new MAF.Class({
	ClassName: 'TestView1',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		this.parent();
	},

	createView: function () {
		var button1 = new MAF.control.TextButton({
			label: 'Close App',
			events: {
				onSelect: function () {
					MAF.application.exit();
				}
			}
		}).appendTo(this);
	}
});
