var Kraken = (function () {
	var instance = {},
		mockTriplet = '1537.99.9908';
	function sendMessage(msg, callback) {
		new Request({
			url: 'http://session/client/send?protocolid=D4A',
			data: msg,
			method: 'POST',
			proxy: false,
			onSuccess: function (data) {
				new Request({
					url: 'http://session/client/poll?protocolid=D4A',
					proxy: false,
					data: data,
					onSuccess: function (response) {
						callback(response);
					}
				}).send();
			},
			onFailure: function () {
				log('NO SESSION DATA');
				callback();
			}
		}).send();
	}
	function getCurrentChannelByProperties(callback, properties) {
		properties = properties || {};
		new Request({
			url: 'http://appdev.io/kraken/v2/schedule/networks/HU/services.json',
			proxy: false,
			data: {
				maxBatchSize: 1,
				show: 'name,udpStreamLink,channel.ref',
				dvbDec: properties.channel && properties.channel.split(':')[1] || mockTriplet
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
							} else {
								callback({
									channel: s[0].name,
									stream: s[0].udpStreamLink.href
								});
							}
						}
					}).send();
				}
			}
		}).send();
	}
	function getCurrentChannel(callback) {
		new Request({
			url: 'http://session/client/properties.json',
			proxy: false,
			onSuccess: function (json) {
				getCurrentChannelByProperties(callback, json);
			},
			onFailure: function () {
				log('NO CHANNEL DATA');
				getCurrentChannelByProperties(callback);
			}
		}).send();
	}
	getter(instance, 'sendMessage', function () {
		return sendMessage;
	});
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
		ageRating,
		programTimer,
		video;

	function getAgeRating(callback) {
		Kraken.sendMessage(String.fromCharCode(6), function (data) {
			ageRating = parseInt(data && data.substr(4) || -1, 10);
			callback();
		});
	}
	function updateNowPlaying() {
		if (programTimer) {
			clearTimeout(programTimer);
			programTimer = undefined;
		}
		Kraken.getCurrentChannel(function (data) {
			if (ageRating === -1 || (data.ageRating - 3) <= ageRating) {
				currentProgram = data;
				if (data.stream !== video.src) {
					log('UPDATE UDP');
					video.src = data.stream;
					video.load();
					video.play();
				}
			} else {
				currentProgram = { title: 'Szülői zár' };
				video.src = '';
				video.load();
			}
			var now = Date.now(),
				expire = (+moment.utc(data.end || now) - now);
			if (expire < 1000) {
				expire = 5000;
			}
			programTimer = setTimeout(updateNowPlaying, expire);
			if (instance.onChannelChanged) {
				instance.onChannelChanged();
			}
		});
	}
	function init() {
		video = video || body.getElementsByTagName('video')[0];
		if (video) {
			getAgeRating(updateNowPlaying);
		}
	}

	function visibilityChanged() {
		var state = document.webkitVisibilityState || document.visibilityState;
		switch(state) {
			case 'webkitHidden':
			case 'hidden':
				if (video) {
					video.muted = true;
				}
				break;
			case 'webkitVisible':
			case 'visible':
				if (video) {
					video.muted = false;
				}
				break;
		}
	}
	document.addEventListener('webkitvisibilitychange', visibilityChanged, false);
	document.addEventListener('visibilitychange', visibilityChanged, false);

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
