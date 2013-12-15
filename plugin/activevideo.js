include('activevideo/thinclient.js');

KeyMap.defineKeys(KeyMap.NORMAL, {
	19: 'pause', 413: 'stop', 415: 'play',
	403: 'red', 404: 'green', 405: 'yellow', 406: 'blue'
}, true);

var AVNPlayer = function () {
	var instance = this;

	this.hide();

	if (ThinClient && ThinClient.init) {
		ThinClient.init();

		function backToLive() {
			var channel = ThinClient.channel.number;
			ThinClient.channel = channel;
		}

		ThinClient.onChannelChanged = function () {
			fire.call(instance, 'onChannelChange');
		};

		getter(instance, 'channel', function () {
			return ThinClient.channel;
		});
		setter(instance, 'channel', function (channel) {
			if (typeOf(channel) === 'string') {
				if (channel === 'up' || channel === 'down') {
					ThinClient[channel]();
				}
			} else {
				ThinClient.channel = channel;
			}
		});

		getter(instance, 'program', function () {
			return ThinClient.program;
		});

		getter(instance, 'backToLive', function () {
			return backToLive;
		});
	}
};
AVNPlayer.prototype = new HTML5Player(Player.TV);
AVNPlayer.prototype.constructor = AVNPlayer;

plugins.players.push(new AVNPlayer());

plugins.storage = new CookieStorage();

window.addEventListener('blur', function () {
	if (active === ui) {
		window.close();
	}
});
