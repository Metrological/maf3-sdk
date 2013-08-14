var TestView1 = new MAF.Class({
	ClassName: 'TestView1',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		this.parent();
	},

	createView: function () {
		this.elements.button1 = new MAF.control.TextButton({
			label: 'Close App',
			events: {
				onSelect: function () {
					this.owner.dialog();
				}
			}
		}).appendTo(this);
	},

	dialog: function () {
		new MAF.dialogs.Alert({
			title: 'Alert Dialog',
			message: 'Do you want to close the app?',
			focusOnCompletion: this.elements.button1,
			buttons: [
				{ label: 'Ok', callback: this.dialogCallback },
				{ label: 'Cancel', callback: this.dialogCallback }
			]
		}).show();
	},

	dialogCallback: function (event) {
		switch (event.selected.label) {
			case 'Ok':
				MAF.application.exit();
				break;
		}
	}
});
