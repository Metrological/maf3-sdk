var TestView7 = new MAF.Class({
	ClassName: 'TestView7',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		this.parent();
		MAF.mediaplayer.init();
		this.channelChange.subscribeTo(MAF.mediaplayer, 'onChannelChange', this);
		this.stateChange.subscribeTo(MAF.mediaplayer, 'onStateChange', this);
	},

	stateChange: function (event) {
		var states = MAF.mediaplayer.constants.states;
		switch (event.payload.newState) {
			case states.ERROR:
			case states.EOF:
			case states.STOP:
			case states.PLAY:
				this.elements.isLive.setText('Live TV: ' + String(MAF.mediaplayer.isTVActive));
				this.elements.assetTitle.setText('Asset Title: ' + MAF.mediaplayer.currentAsset.title);
				this.elements.assetWidget.setText('Asset Widget: ' + (MAF.mediaplayer.currentAsset.widget && MAF.mediaplayer.currentAsset.widget.name || 'None'));
				break;
		}
	},

	channelChange: function () {
		var currentChannel = MAF.mediaplayer.getCurrentChannel(),
			currentProgram = MAF.mediaplayer.getCurrentProgram();
		this.elements.channelNumber.setText('Channel Number: ' + currentChannel.number);
		this.elements.channelName.setText('Channel Name: ' + currentChannel.name);
		this.elements.programTitle.setText('Program Title: ' + currentProgram.title);
		this.elements.programDescription.setText('Program Description: ' + currentProgram.description);
		this.elements.assetTitle.setText('Asset Title: ' + MAF.mediaplayer.currentAsset.title);
		this.elements.assetWidget.setText('Asset Widget: ' + (MAF.mediaplayer.currentAsset.widget && MAF.mediaplayer.currentAsset.widget.name || 'None'));
	},

	createView: function () {
		var back = new MAF.control.BackButton({
			label: 'TV'
		}).appendTo(this);

		var currentChannel = MAF.mediaplayer.getCurrentChannel(),
			currentProgram = MAF.mediaplayer.getCurrentProgram();

		var changeChannel = new MAF.control.TextButton({
			label: 'Change Channel',
			styles: {
				vOffset: back.outerHeight + 1
			},
			events: {
				onSelect: function () {
					MAF.mediaplayer.setChannelByNumber(Math.floor(Math.random()*11));
				}
			}
		}).appendTo(this);

		this.elements.channelNumber = new MAF.control.TextButton({
			label: 'Channel Number: ' + currentChannel.number,
			disabled: true,
			styles: {
				vOffset: changeChannel.outerHeight + 1
			}
		}).appendTo(this);

		this.elements.channelName = new MAF.control.TextButton({
			label: 'Channel Name: ' + currentChannel.name,
			disabled: true,
			styles: {
				vOffset: this.elements.channelNumber.outerHeight + 1
			}
		}).appendTo(this);

		this.elements.programTitle = new MAF.control.TextButton({
			label: 'Program Title: ' + currentProgram.title,
			disabled: true,
			styles: {
				vOffset: this.elements.channelName.outerHeight + 1
			}
		}).appendTo(this);

		this.elements.programDescription = new MAF.control.TextButton({
			label: 'Program Description: ' + currentProgram.description,
			disabled: true,
			styles: {
				vOffset: this.elements.programTitle.outerHeight + 1
			}
		}).appendTo(this);

		this.elements.isLive = new MAF.control.TextButton({
			label: 'Live TV: ' + String(MAF.mediaplayer.isTVActive),
			disabled: true,
			styles: {
				vOffset: this.elements.programDescription.outerHeight + 1
			}
		}).appendTo(this);

		this.elements.assetTitle = new MAF.control.TextButton({
			label: 'Asset Title: ' + MAF.mediaplayer.currentAsset.title,
			disabled: true,
			styles: {
				vOffset: this.elements.isLive.outerHeight + 1
			}
		}).appendTo(this);

		this.elements.assetWidget = new MAF.control.TextButton({
			label: 'Asset Widget: ' + (MAF.mediaplayer.currentAsset.widget && MAF.mediaplayer.currentAsset.widget.name || 'None'),
			disabled: true,
			styles: {
				vOffset: this.elements.assetTitle.outerHeight + 1
			}
		}).appendTo(this);

		this.elements.notification = new MAF.control.TextButton({
			label: 'Notification in 60 seconds',
			styles: {
				vOffset: this.elements.assetWidget.outerHeight + 1
			},
			events: {
				onSelect: function () {
					var button = this;
					button.setStyle('backgroundColor', 'red');
					(function () {
						MAF.system.notify('http://icons.iconarchive.com/icons/kyo-tux/delikate/64/Internet-icon.png', 'This is an example notification', MAF.Notification.ALERT);
						if (button) {
							button.setStyle('backgroundColor', null);
						}
					}).delay(60000);
				}
			}
		}).appendTo(this);

		this.elements.startYouTube = new MAF.control.TextButton({
			label: 'Call 2 Action in 60 seconds',
			styles: {
				vOffset: this.elements.notification.outerHeight + 1
			},
			events: {
				onSelect: function () {
					var button = this;
					button.setStyle('backgroundColor', 'red');
					(function () {
						MAF.system.notify('http://www.icon2s.com/img64/64-6904.png', 'Launch YouTube', MAF.Notification.CALL2ACTION, 'com.metrological.widgets.tv.Youtube');
						if (button) {
							button.setStyle('backgroundColor', null);
						}
					}).delay(60000);
				}
			}
		}).appendTo(this);

		this.elements.stats = new MAF.control.TextButton({
			label: 'Stats API',
			styles: {
				vOffset: this.elements.startYouTube.outerHeight + 1
			},
			events: {
				onSelect: function () {
					MAF.Stats.event('myButtom', {
						click: Date.now(),
						customId: 123
					});
				}
			}
		}).appendTo(this);
	}
});
