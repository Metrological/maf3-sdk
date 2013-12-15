this.ThinClient = (function () {
	var body = document.body,
		instance = {},
		currentChannel = 1,
		currentProgram = '',
		video;

	function init() {
		video = video || body.getElementsByTagName('video')[0];
		if (video) {
			log('thinclient init');
			video.setAttribute('autoplay', '');
			setChannel();
		}
	}
	function channelUp() {
		log('channel up');
		currentChannel++;
		if (currentChannel === 1000) {
			currentChannel = 1;
		}
		setChannel();
	}
	function channelDown() {
		log('channel down');
		currentChannel--;
		if (currentChannel === 0) {
			currentChannel = 999;
		}
		setChannel();
	}
	function setChannel(channel) {
		channel = channel || currentChannel;
		log('channel change', channel);
		currentChannel = channel;
		if (instance.onChannelChanged) {
			instance.onChannelChanged();
		}
	}

	getter(instance, 'init', function () {
		return init;
	});
	getter(instance, 'up', function () {
		return channelUp;
	});
	getter(instance, 'down', function () {
		return channelDown;
	});
	getter(instance, 'channel', function () {
		return new TVChannel(currentChannel, '');
	});
	setter(instance, 'channel', function (channel) {
		setChannel(channel);
	});
	getter(instance, 'program', function () {
		return new TVProgram(currentProgram, '', Date.now(), -1);
	});
	return instance;
}());
