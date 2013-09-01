var TestView7 = new MAF.Class({
	ClassName: 'TestView7',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		this.parent();
	},

	createView: function () {
		var back = new MAF.control.BackButton({
			label: 'TV'
		}).appendTo(this);

		var button1 = new MAF.control.TextButton({
			label: 'Channel Id: ' + tv.channel,
			disabled: true,
			styles: {
				vOffset: back.outerHeight + 1
			}
		}).appendTo(this);

		var button2 = new MAF.control.TextButton({
			label: 'Current Channel: ' + JSON.stringify(tv.currentChannel),
			disabled: true,
			styles: {
				vOffset: button1.outerHeight + 1
			}
		}).appendTo(this);

		var button3 = new MAF.control.TextButton({
			label: 'Channel by Number: ' + tv.getChannelByNumber(5),
			disabled: true,
			styles: {
				vOffset: button2.outerHeight + 1
			}
		}).appendTo(this);

		var button4 = new MAF.control.TextButton({
			label: 'Current Program: ' + JSON.stringify(tv.currentProgram),
			disabled: true,
			styles: {
				vOffset: button3.outerHeight + 1
			}
		}).appendTo(this);

		var button5 = new MAF.control.TextButton({
			label: 'Next Program: ' + JSON.stringify(tv.nextProgram),
			disabled: true,
			styles: {
				vOffset: button4.outerHeight + 1
			}
		}).appendTo(this);

		var button6 = new MAF.control.TextButton({
			label: 'Blocked Channels: ' + JSON.stringify(tv.blockedChannels),
			disabled: true,
			styles: {
				vOffset: button5.outerHeight + 1
			}
		}).appendTo(this);

		var button7 = new MAF.control.TextButton({
			label: 'Resized Channels: ' + JSON.stringify(tv.resizedChannels),
			disabled: true,
			styles: {
				vOffset: button6.outerHeight + 1
			}
		}).appendTo(this);
	}
});
