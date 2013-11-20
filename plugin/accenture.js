var UTC = window.UTC,
	OTT = UTC && OTT;

KeyMap.defineKeys(KeyMap.NORMAL, {
}, true);

var AccenturePlayer = function () {
	var instance = this,
		scale = 720 / 1080,
		currentBounds = Player.prototype.bounds,
		paused = false,
		currentSource = null,
		previousState = null;

	instance.subscribers = {};

	function stateChange(state) {
		if (previousState !== state) {
			fire.call(instance, 'onStateChange', {
				state: state
			});
			previousState = state;
		}
	}
	function timeChange() {
		fire.call(instance, 'onTimeChange');
	}
	function channelChange() {
		fire.call(instance, 'onChannelChange');
	}
	if (OTT && OTT.onPlaybackEvent) {
		OTT.onPlaybackEvent(stateChange);
	}
	if (OTT && OTT.onChannelEvent) {
		OTT.onChannelEvent(channelChange);
	}

	function supports(mimetype) {
		return OTT && OTT.supports && OTT.supports(mimetype) || false;
	}
	function r(c) {
		return Math.floor(c * scale);
	}

	getter(instance, 'id', function () {
		return Player.TV;
	});
	getter(instance, 'type', function () {
		return Player.type.VIDEO;
	});
	getter(instance, 'supports', function () {
		return supports;
	});
	getter(instance, 'waitIndicator', function () {
		return false;
	});
	getter(instance, 'channel', function () {
		var channel = OTT && OTT.channel && OTT.channel() || {};
		return new TVChannel(channel.number, channel.name);
	});
	setter(instance, 'channel', function (number) {
	});
	getter(instance, 'program', function () {
		var program = OTT && OTT.now && OTT.now() || {};
		return new TVProgram(program.title, program.description, program.startTime, program.duration);
	});
	getter(instance, 'startTime', function () {
		return 0;
	});
	setter(instance, 'startTime', function (time) {
	});
	getter(instance, 'currentTime', function () {
		return OTT && OTT.time && OTT.time() || 0;
	});
	setter(instance, 'currentTime', function (time) {
		if (OTT && OTT.move) {
			OTT.move(time);
		}
	});
	getter(instance, 'rate', function () {
		return 1;
	});
	setter(instance, 'rate', function (rate) {
	});
	getter(instance, 'duration', function () {
		return OTT && OTT.duration && OTT.duration() || 0;
	});
	getter(instance, 'buffered', function () {
		return 100;
	});
	getter(instance, 'muted', function () {
		return false;
	});
	setter(instance, 'muted', function (mute) {
	});
	getter(instance, 'volume', function () {
		return 1;
	});
	setter(instance, 'volume', function (volume) {
	});
	getter(instance, 'src', function () {
		return currentSource;
	});
	setter(instance, 'src', function (src) {
		if (OTT && src) {
			if (OTT.viewMode) {
				UTC.OTT.viewMode('full');
			}
			currentSource = src;
			paused = false;
			OTT.load(src);
		} else if (OTT && currentSource) {
			currentSource = null;
			paused = false;
			OTT.stop();
		}

	});
	getter(instance, 'paused', function () {
		return paused;
	});
	setter(instance, 'paused', function (p) {
		if (OTT && this.src) {
			if (!p) {
				if (this.paused) {
					OTT.play();
					paused = false;
				}
			} else {
				OTT.pause();
				paused = true;
			}
		}
	});
	getter(instance, 'bounds', function () {
		return currentBounds;
	});
	setter(instance, 'bounds', function (b) {
		var len = b && b.length || 0;
		if (len > 1 && OTT) {
			OTT.windowPositionSize(r(b[0]), r(b[1]), r(b[2] || currentBounds[2]), r(b[3] || currentBounds[3]));
			currentBounds = b;
		}
	});
};

plugins.players.push(new AccenturePlayer());

var onShow = function () {
	},
	onHide = function () {
		var player = plugins.players[0];
		if (player) {
			player.src = '';
		}
	};

if (OTT && OTT.onShow) {
	OTT.onShow(onShow);
}
if (OTT && OTT.onHide) {
	OTT.onHide(onHide);
}

window.addEventListener('unload', function () {
	onHide();
});

window.addEventListener('blur', function () {
	onHide();
	if (OTT && OTT.exit) {
		OTT.exit();
	}
});

if (OTT && OTT.viewMode) {
	OTT.viewMode('overlay');
}
