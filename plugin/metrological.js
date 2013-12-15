var MLPlayer = function () {
	var instance = this;

	if (TVEmulator && TVEmulator.init) {
		TVEmulator.init();

		function backToLive() {
			var channel = TVEmulator.channel.number;
			TVEmulator.channel = channel;
		}

		TVEmulator.onChannelChanged = function () {
			fire.call(instance, 'onChannelChange');
		};

		getter(instance, 'channel', function () {
			return TVEmulator.channel;
		});
		setter(instance, 'channel', function (channel) {
			if (typeOf(channel) === 'string') {
				if (channel === 'up' || channel === 'down') {
					TVEmulator[channel]();
				}
			} else {
				TVEmulator.channel = channel;
			}
		});

		getter(instance, 'program', function () {
			return TVEmulator.program;
		});

		getter(instance, 'backToLive', function () {
			return backToLive;
		});
	}
};
MLPlayer.prototype = new HTML5Player(Player.TV);
MLPlayer.prototype.constructor = MLPlayer;

plugins.players.push(new MLPlayer());
