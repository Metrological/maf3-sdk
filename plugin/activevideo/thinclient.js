var Kraken = (function () {
	var instance = {};
	function getCurrentChannel(callback) {
		new Request({
			url: 'http://session/client/properties.json',
			proxy: false,
			onComplete: function (response) {
				var json = response.responseText || {
					channel: 'tv:1537.99.9907'
				};
				if (typeOf(json) === 'string') {
					json = JSON.parse(json);
				}
				if (json && json.channel) {
					new Request({
						url: 'http://appdev.io/kraken/v2/schedule/networks/HU/services.json',
						proxy: false,
						data: {
							maxBatchSize: 1,
							show: 'name,udpStreamLink,channel.ref',
							dvbDec: json.channel.split(':')[1]
						},
						onSuccess: function (services) {
							var s = services && services.data;
							if (s && s.length > 0) {
								new Request({
									url: String.sprintf('http://appdev.io/kraken/v2/schedule/data/HU/channels/%s/broadcasts.json?end>%s', s[0].channel.ref, moment.utc().format('YYYY-MM-DD[T]HH:mm[Z]')),
									proxy: false,
									data: {
										maxBatchSize: 1,
										show: 'ageRating,end,start,title,synopsis'
									},
									onSuccess: function (broadcast) {
										var b = broadcast && broadcast.data;
										if (b && b.length > 0 && callback) {
											callback(Object.merge({}, b[0], {
												channel: s[0].name,
												stream: s[0].udpStreamLink.href
											}));
										}
									}
								}).send();
							}
						}
					}).send();
				}
			}
		}).send();
	}
	getter(instance, 'getCurrentChannel', function () {
		return getCurrentChannel;
	});
	return instance;
}());

this.ThinClient = (function () {
	var body = document.body,
		instance = {},
		currentChannel = 1,
		currentProgram = {},
		programTimer,
		video;

	function updateNowPlaying() {
		if (programTimer) {
			clearTimeout(programTimer);
		}
		Kraken.getCurrentChannel(function (data) {
			currentProgram = data;
			var timeout = (+moment.utc(data.end)) - Date.now();
			programTimer = setTimeout(updateNowPlaying, timeout);
			video.src = currentProgram.stream;
			if (instance.onChannelChanged) {
				instance.onChannelChanged();
			}
		});
	}
	function init() {
		video = video || body.getElementsByTagName('video')[0];
		if (video) {
			video.setAttribute('autoplay', '');
			updateNowPlaying();
		}
	}

	getter(instance, 'init', function () {
		return init;
	});
	getter(instance, 'up', function () {
		return emptyFn;
	});
	getter(instance, 'down', function () {
		return emptyFn;
	});
	getter(instance, 'channel', function () {
		return new TVChannel(currentChannel, currentProgram.channel);
	});
	setter(instance, 'channel', function (channel) {
		updateNowPlaying();
	});
	getter(instance, 'program', function () {
		return new TVProgram(currentProgram.title, currentProgram.synopsis, +moment.utc(currentProgram.start), +moment.utc(currentProgram.end));
	});
	return instance;
}());
