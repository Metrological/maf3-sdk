var UTC = window.UTC,
	OTT = UTC && UTC.OTT || false;

KeyMap.defineKeys(KeyMap.NORMAL, {
	114: 'playpause', 118: 'rewind', 117: 'forward', 115: 'stop',
	123: 'blue', 122: 'yellow', 121: 'green', 120: 'red',
	119: 'record',
	175: 'volume-up', 174: 'volume-down', 173: 'mute'
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
			if (state === Player.state.ERROR) {
				instance.src = null;
			}
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
	if (OTT && OTT.onChannelChange) {
		OTT.onChannelChange(channelChange);
	}

	function supports(mimetype) {
		return mimetype.indexOf('video/mp4') !== -1; //OTT && OTT.supports && OTT.supports(mimetype) || false;
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
				OTT.viewMode('full');
			}
			if (currentSource) {
				currentSource = null;
				paused = false;
				OTT.stop();
			}
			currentSource = src;
			paused = false;
			(function () {
				OTT.load(src, false);
			}).delay(400);
		} else if (OTT && currentSource) {
			currentSource = null;
			paused = false;
			OTT.stop();
			OTT.viewMode('overlay');
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
AccenturePlayer.prototype = new Player();
AccenturePlayer.prototype.constructor = AccenturePlayer;

plugins.players.push(new AccenturePlayer());

var AccentureProfile = function (name) {
	function getProfileId() {
		return OTT && OTT.getProfileId && OTT.getProfileId() || {};
	}
	getter(this, 'id', function () {
		return md5(this.household + '|' + (name || ''));
	});
	getter(this, 'name', function () {
		return name || (OTT && OTT.getProfileName && OTT.getProfileName() || '');
	});
	getter(this, 'ageRating', function () {
		return OTT && OTT.getAgeRating && OTT.getAgeRating() || 0;
	});
	getter(this, 'household', function () {
		return md5(this.operator + (getProfileId().id || 0));
	});
	getter(this, 'operator', function () {
		return 'kpn';
	});
	getter(this, 'packages', function () {
		return OTT && OTT.getPackages && OTT.getPackages() || [];
	});
	getter(this, 'country', function () {
		return GEO && GEO.geo && GEO.geo.countryName;
	});
	getter(this, 'countryCode', function () {
		return OTT && OTT.getCountry && OTT.getCountry().toLowerCase() || window.MAE.country || 'nl';
	});
	getter(this, 'language', function () {
		return LANGUAGES[this.languageCode];
	});
	getter(this, 'languageCode', function () {
		/*var l = OTT && OTT.getLanguage && OTT.getLanguage().toLowerCase();
		switch (l) {
			case 'nederlands':
			case 'dutch':
				return 'nl';
			default:*/
				return window.MAE.language || 'en';
		//}
	});
	getter(this, 'city', function () {
		return GEO && GEO.geo && GEO.geo.city;
	});
	getter(this, 'latlon', function () {
		return GEO && GEO.geo && GEO.geo.ll || [];
	});
	getter(this, 'ip', function () {
		return GEO && GEO.ip || '127.0.0.1';
	});
	getter(this, 'mac', function () {
		return getProfileId().mac || '00:00:00:00:00:00';
	});
	getter(this, 'locale', function () {
		return this.languageCode + '-' + this.countryCode.toUpperCase();
	});
	getter(this, 'locked', function () {
		return false;
	});
	function hasPIN(type) {
		return true;
	}
	function validatePIN(value, type) {
		if (!hasPIN(type)) {
			return true;
		}
		switch (type) {
			case 'adult':
			case 'youth':
				return OTT && OTT.verifyPIN ? OTT.verifyPIN(value) === 1 : false;
			default:
				return false;
		}
	}
	getter(this, 'hasPIN', function () {
		return hasPIN;
	});
	getter(this, 'validatePIN', function () {
		return validatePIN;
	});
	var passport = new GenericStorage('pp', true);
	getter(this, 'passport', function () {
		return passport;
	});
};
AccentureProfile.prototype = new Profile();
AccentureProfile.prototype.constructor = AccentureProfile;

plugins.profile = AccentureProfile;

var getUIWindow = function () {
	return apps[ui] && apps[ui].document.body;
};

var onShow = function () {
		//screen.log('ONSHOW');
		(function () {
			var UI = getUIWindow();
			if (UI) {
				UI.visible = true;
			}
			if (active && apps[active]) {
				ApplicationManager.fire(active, 'onSelect', {
					id: apps[active].currentViewId
				});
			}
		}).delay(800);
	},
	onHide = function () {
		//screen.log('ONHIDE');
		var player = plugins.players[0],
			UI = getUIWindow();
		if (player) {
			player.bounds = [0,0,1920,1080];
			player.src = '';
		}
		if (UI) {
			UI.visible = false;
		}
		if (active && active !== ui) {
			ApplicationManager.close(active);
		}
	};

if (OTT && OTT.onShow) {
	OTT.onShow(onShow);
}
if (OTT && OTT.onHide) {
	OTT.onHide(onHide);
}

plugins.exit = function () {
	var player = plugins.player[0];
	if (player) {
		player.bounds = [0,0,1920,1080];
		player.src = '';
	}
	if (OTT && OTT.exit) {
		OTT.exit();
	}
};
/*
window.addEventListener('blur', function () {
	onHide();
});
*/
if (OTT && OTT.viewMode) {
	OTT.viewMode('overlay');
}
/*
window.addEventListener('keydown', function (event) {
	screen.log('KEYDOWN: ' + event.keyCode);
});
*/
