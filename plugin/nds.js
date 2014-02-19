var NDS = createPluginObject('my_user_api', 'my_user_api', 'application/x-jsuserapi-plugin'),
	Application = NDS.Application_getInstance && NDS.Application_getInstance(),
	VideoPlayer = NDS.Player_getInstance && NDS.Player_getInstance(),
	AudioPlayer = NDS.AudioOutput_getInstance && NDS.AudioOutput_getInstance(),
	TVContext   = NDS.ApplicationTvContext_getInstance && NDS.ApplicationTvContext_getInstance() || NDS.ApplicationTVContext_getInstance && NDS.ApplicationTVContext_getInstance(),
	User        = NDS.UserAuthentication_getInstance && NDS.UserAuthentication_getInstance(),
	UserData    = TVContext && TVContext.getUserData(),
	Planner     = NDS.Planner_getInstance && NDS.Planner_getInstance(),
	isEnabled   = false,
	currentChannel, currentProgram, timerProgramData;

KeyMap.defineKeys(KeyMap.NORMAL, {
	403: 'red', 404: 'green',
	405: 'yellow', 406: 'blue',
	413: 'stop', 415: 'playpause',
	417: 'forward', 412: 'rewind',
	462: 'menu', 461: 'back'
}, true);

var syncProgramData = function () {
	var player = MAE.blocked && plugins.players[0],
		previousChannel = currentChannel && currentChannel.number,
		showEnded = Math.floor(Date.now() / 1000) - (currentProgram ? (currentProgram.startTime + currentProgram.duration) : 0);
	currentChannel = TVContext && TVContext.getCurrentChannel();
	if (previousChannel === currentChannel.number && showEnded < 0) {
		return;
	}
	if (timerProgramData) {
		clearTimeout(timerProgramData);
		timerProgramData = undefined;
	}
	if (!MAE.blocked || MAE.blocked.indexOf(currentChannel.number) === -1) {
		if (player) {
			player.show();
			if (player.muted) {
				player.muted = false;
			}
		}
		currentProgram = currentChannel && currentChannel.getCurrentProgram();
	} else if (player) {
		player.hide();
		if (isEnabled) {
			player.muted = true;
		}
		currentProgram = undefined;
	}
	timerProgramData = setTimeout(syncProgramData, (currentProgram && currentProgram.duration || 60) * 1000);
};

var NDSPlayer = function () {
	var instance = this,
		defaultBounds = Player.prototype.bounds,
		currentBounds = defaultBounds,
		canPlay = false,
		grabbed = false,
		paused = false,
		currentSource = null,
		previousState = null,
		maxStartCounter = 10,
		startCounter = 0,
		currentDuration = 0,
		position = 0,
		currentRate = 1,
		startTimer, timeTimer;

	instance.subscribers = {};

	function getRate(rate) {
		switch(rate) {
			case 30:
				return VideoPlayer.PLAYER_SPD_FWD30X;
			case 12:
				return VideoPlayer.PLAYER_SPD_FWD12X;
			case 6:
				return VideoPlayer.PLAYER_SPD_FWD6X;
			case 2:
				return VideoPlayer.PLAYER_SPD_FWD2X;
			case -30:
				return VideoPlayer.PLAYER_SPD_REW30X;
			case -12:
				return VideoPlayer.PLAYER_SPD_REW12X;
			case -6:
				return VideoPlayer.PLAYER_SPD_REW6X;
			case -2:
				return VideoPlayer.PLAYER_SPD_REW2X;
			default:
				return VideoPlayer.PLAYER_SPD_PLAY;
		}
	}
	function stateChange(state) {
		if (previousState !== state) {
			fire.call(instance, 'onStateChange', {
				state: state
			});
			previousState = state;
		}
	}
	function timeChange() {
		try {
			position = grabbed ? VideoPlayer && (VideoPlayer.position / 1000) || 0 : 0;
		} catch(err) {
			position = 0;
		}
		fire.call(instance, 'onTimeChange');
	}
	function channelChange() {
		syncProgramData();
		fire.call(instance, 'onChannelChange');
	}
	function start() {
		if (currentSource && !canPlay && previousState !== Player.state.ERROR) {
			//screen.log('START');
			VideoPlayer.start();
			if (startCounter < maxStartCounter) {
				//VideoPlayer.setURI(currentSource);
				startTimer = setTimeout(start, (maxStartCounter - startCounter) * 1000);
				startCounter++;
			} else {
				startCounter = 0;
				if (startTimer) {
					clearTimeout(startTimer);
					startTimer = null;
				}
				stateChange(Player.state.ERROR);
			}
		} else if (startTimer) {
			//screen.log('STARTED');
			startCounter = 0;
			clearTimeout(startTimer);
			startTimer = null;
		}
	}

	if (VideoPlayer) {
		VideoPlayer.onPlaybackStarted = function () {
			if (grabbed && currentSource && VideoPlayer) {
				canPlay = true;
				//screen.log('INFOLOADED');
				if (MAE.blocked && !currentProgram) {
					instance.show();
					instance.muted = false;
				}
				stateChange(Player.state.INFOLOADED);
			}
		};
		VideoPlayer.onPlaybackEnd = function () {
			if (grabbed && currentSource) {
				//screen.log('EOF');
				stateChange(Player.state.EOF);
			}
		};
		VideoPlayer.onPlaybackUnexpectedStop = function () {
			if (grabbed && currentSource && canPlay) {
				//screen.log('STOPPED UNEXPECTED');
				stateChange(Player.state.STOP);
				//screen.log('BOUNDS:' + JSON.stringify(instance.bounds) + ', ' + JSON.stringify(currentBounds));
				if (currentBounds[3] !== instance.bounds[3]) {
					instance.bounds = currentBounds;
				}
			}
		};
		VideoPlayer.onPlaybackError = function () {
			if (grabbed && currentSource) {
				//screen.log('ERROR');
				stateChange(Player.state.ERROR);
			}
		};
	}
	if (TVContext) {
		TVContext.onPINRequested = function () {
		};
		TVContext.onContentSelectionError = function (err) {
		};
		TVContext.onPresentationChanged = function (type) {
			if (grabbed && currentSource && canPlay) {
				//screen.log('STOPPED PRESENTATION CHANGED');
				canPlay = false;
				currentSource = null;
				previousState = null;
				paused = false;
				if (timeTimer) {
					clearInterval(timeTimer);
					timeTimer = null;
				}
				position = 0;
				if (startTimer) {
					clearTimeout(startTimer);
					startTimer = null;
				}
				stateChange(Player.state.STOP);
				grabbed = false;
			}/*
			switch (type) {
				case TVContext.CONTENT_ACCESS_DENIED:
				case TVContext.CONTENT_PRESENTATION_BLOCKED:
				case TVContext.CONTENT_SOURCE_UNAVAILABLE:
				case TVContext.CONTENT_UNKNOWN:
				case TVContext.UNSPECIFIED_ERROR:
					break;
				default:
					break;
			}*/
		};
		TVContext.onContentSelectionSucceeded = function () {
			if (!grabbed) {
				//screen.log('CHANNEL CHANGE');
				channelChange();
				//screen.log('BOUNDS:' + JSON.stringify(instance.bounds) + ', ' + JSON.stringify(currentBounds));
				if (currentBounds[3] !== instance.bounds[3]) {
					instance.bounds = currentBounds;
				}
			}
		};
	}

	function supports(mimetype) {
		return mimetype.indexOf('video/mp4') !== -1;/*
		try {
			var mimes = VideoPlayer && VideoPlayer.getSupportedMimeTypes() || [];
			for (var i = 0; i < mimes.length; i++) {
				if (mimes[i].indexOf(mimetype) !== -1) {
					return true;
				}
			}
		} catch(err) {}
		return false;*/
	}

	function notify(icon, message, type, identifier) {
		type = type || 'alert';
		identifier = identifier || active;
		try {
			var notification = NDS && NDS.Notification_getInstance();
			if (!notification) {
				return;
			}
			if (icon && notification.setIconURL) {
				notification.setIconURL(icon);
			}
			switch(typeOf(message)) {
				case 'array':
					notification.setMessageStrings(message);
					break;
				case 'string':
					notification.setMessageStrings(message.split(', '));
					break;
				default:
					return;
			}
			switch(type) {
				case 'alert':
					notification.setType(notification.NOTIFICATION_TYPE_ALERT);
					break;
				case 'c2a':
					if (MAE.pait && MAE.pait[identifier]) {
						notification.setType(notification.NOTIFICATION_TYPE_CALL2ACTION);
						notification.setCall2ActionTarget('app:' + MAE.pait[identifier]);
						break;
					}
					return;
				default:
					return;
			}
			notification.post();
		} catch(err) {}
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
		var channel = currentChannel || {};
		return new TVChannel(channel.number, channel.name);
	});
	setter(instance, 'channel', function (number) {
		if (TVContext) {
			TVContext.selectContentByID('service:number:' + number);
		}
	});
	getter(instance, 'program', function () {
		var program = currentProgram || {};
		return new TVProgram(program.title, program.description, (program.startTime || 0) * 1000, program.duration);
	});
	getter(instance, 'startTime', function () {
		return 0;
	});
	setter(instance, 'startTime', function (time) {
	});
	getter(instance, 'currentTime', function () {
		return grabbed ? position : 0;
	});
	setter(instance, 'currentTime', function (time) {
		if (VideoPlayer) {
			try {
				VideoPlayer.seek(time * 1000);
			} catch(err) {}
		}
	});
	getter(instance, 'rates', function () {
		return [1,2,6,12,30];
	});
	getter(instance, 'rate', function () {
		return currentRate;
	});
	setter(instance, 'rate', function (rate) {
		if (VideoPlayer && canPlay && currentRate !== rate) {
			try {
				VideoPlayer.setSpeed(getRate(rate));
			} catch(err) {
				return;
			}
			currentRate = rate;
			if (rate < 0) {
				stateChange(Player.state.REWIND);
			} else if (rate == 1) {
				stateChange(Player.state.PLAY);
			} else if (rate > 0) {
				stateChange(Player.state.FORWARD);
			} else {
				stateChange(Player.state.PAUSE);
			}
		}
	});
	getter(instance, 'duration', function () {
		if (currentDuration > 0) {
			return currentDuration;
		}
		try {
			currentDuration = VideoPlayer && VideoPlayer.getPlaybackDuration() || 0;
		} catch(err) {}
		return currentDuration;
	});
	getter(instance, 'buffered', function () {
		return 100;
	});
	getter(instance, 'muted', function () {
		try {
			return AudioPlayer && AudioPlayer.muted === true || false;
		} catch(err) {
			return false;
		}
	});
	setter(instance, 'muted', function (mute) {
		if (AudioPlayer) {
			try {
				AudioPlayer.mute(mute === true);
			} catch(err) {}
		}
	});
	getter(instance, 'volume', function () {
		if (AudioPlayer) {
			try {
				return AudioPlayer.level / 100;
			} catch(err) {
				return 1;
			}
		} else {
			return 1;
		}
	});
	setter(instance, 'volume', function (volume) {
		if (AudioPlayer) {
			try {
				AudioPlayer.setVolume(parseInt(volume * 100, 10));
			} catch(err) {}
		}
	});
	getter(instance, 'src', function () {
		return grabbed && currentSource;
	});
	setter(instance, 'src', function (src) {
		if (src && VideoPlayer && !currentSource) {
			canPlay = false;
			previousState = null;
			paused = false;
			if (startTimer) {
				clearTimeout(startTimer);
				startTimer = null;
			}
			//screen.log('BUFFERING');
			stateChange(Player.state.BUFFERING);
			if (!grabbed) {
				try {
					VideoPlayer.grab();
					grabbed = true;
				} catch(err) {
					return;
				}
			} else if (currentSource && VideoPlayer.status !== VideoPlayer.PLAYER_STATUS_STOPPED) {
				try {
					VideoPlayer.stop();
				} catch(err) {}
			}
			try {
				position = 0;
				currentRate = 1;
				currentDuration = 0;
				//screen.log('LOAD');
				VideoPlayer.setURI(src);
				currentSource = src;
				start.delay(800);
				//startTimer = setTimeout(start, 600);
			} catch(err) {
				//screen.log('LOAD ERROR');
			}
		} else if (currentSource && VideoPlayer) {
			canPlay = false;
			currentSource = null;
			previousState = null;
			paused = false;
			if (timeTimer) {
				clearInterval(timeTimer);
				timeTimer = null;
			}
			position = 0;
			if (startTimer) {
				clearTimeout(startTimer);
				startTimer = null;
			}
			if (VideoPlayer.status !== VideoPlayer.PLAYER_STATUS_STOPPED) {
				try {
					VideoPlayer.stop();
				} catch(err) {}
			}
			//screen.log('STOP');
			stateChange(Player.state.STOP);
			(function () {
				if (grabbed && !currentSource) {
					grabbed = false;
					try {
						VideoPlayer.ungrab();
					} catch(err) {}
				}
			}).delay(800);
		}
	});
	getter(instance, 'paused', function () {
		return paused;
	});
	setter(instance, 'paused', function (p) {
		if (grabbed && VideoPlayer) {
			if (p === false && paused === true) {
				try {
					if (VideoPlayer.status !== VideoPlayer.PLAYER_STATUS_STOPPED) {
						VideoPlayer.resume();
					} else {
						VideoPlayer.start();
					}
					paused = false;
				} catch(err) {}
			} else if (p === true && paused === false) {
				try {
					VideoPlayer.pause();
					paused = true;
				} catch(err) {}
			}
		}
		if (timeTimer) {
			clearInterval(timeTimer);
			timeTimer = null;
		}
		if (!paused) {
			timeTimer = setInterval(timeChange, 2000);
		}
		//screen.log(paused ? 'PAUSED' : 'RESUME');
		stateChange(paused ? Player.state.PAUSE : Player.state.PLAY);
	});
	getter(instance, 'bounds', function () {
		if (VideoPlayer) {
			return [VideoPlayer.x, VideoPlayer.y, VideoPlayer.width, VideoPlayer.height];
		} else {
			return defaultBounds;
		}
	});
	setter(instance, 'bounds', function (b) {
		var len = b && b.length || 0;
		if (len > 1 && VideoPlayer) {
			if (len === 4) {
				VideoPlayer.setSize(b[2], b[3]);
			}
			VideoPlayer.move(b[0], b[1]);
		}
		currentBounds = b;
	});
	getter(instance, 'notify', function () {
		return notify;
	});
};
NDSPlayer.prototype = new Player();
NDSPlayer.prototype.constructor = NDSPlayer;

plugins.players.push(new NDSPlayer());

var NDSCOUNTRIES = {
	'eng': 'en',
	'enm': 'en',
	'ned': 'nl',
	'nld': 'nl',
	'dut': 'nl',
	'che': 'ch',
	'fre': 'fr',
	'fra': 'fr',
	'ger': 'de',
	'deu': 'de',
	'irl': 'ie'
}, NDSLANGUAGES = {
	'ang': 'en',
	'eng': 'en',
	'enm': 'en',
	'ned': 'nl',
	'nld': 'nl',
	'dut': 'nl',
	'fre': 'fr',
	'fra': 'fr',
	'frm': 'fr',
	'fro': 'fr',
	'ger': 'de',
	'deu': 'de',
	'gmh': 'de',
	'goh': 'de',
	'ita': 'it',
	'irl': 'en',
	'gla': 'en',
	'gle': 'en'
};

plugins.storage = new CookieStorage();

var NDSProfile = function (name) {
	var LOCKED = false,
		ATTEMPTS = 0;
	function getUserData(key) {
		if (!key) {
			return null;
		}
		try {
			return UserData && UserData.get(key);
		} catch(err) {}
		return null;
	}
	getter(this, 'id', function () {
		return md5(this.household + '|' + (name || ''));
	});
	var profileName = getUserData(UserData.KEY_PROFILE_USER_NAME) || '';
	getter(this, 'name', function () {
		return profileName;
	});
	var ageRating = getUserData(UserData.KEY_PROFILE_PARENTAL_AGE);
	getter(this, 'ageRating', function () {
		return ageRating || 0;
	});
	var uid = getUserData(UserData.KEY_PROFILE_USER_ID);
	getter(this, 'household', function () {
		return md5(this.operator + (uid || 0));
	});
	getter(this, 'operator', function () {
		return 'horizon';
	});
	getter(this, 'packages', function () {
		return [];
	});
	getter(this, 'country', function () {
		return GEO && GEO.geo && GEO.geo.countryName;
	});
	var countryCode = getUserData(UserData.KEY_PROFILE_COUNTRY);
	getter(this, 'countryCode', function () {
		var c = (countryCode || (GEO && GEO.geo && GEO.geo.country || 'eu')).toLowerCase();
		return NDSCOUNTRIES[c] || c;
	});
	getter(this, 'language', function () {
		return LANGUAGES[this.languageCode];
	});
	var languageCode = getUserData(UserData.KEY_PROFILE_UI_LANG);
	getter(this, 'languageCode', function () {
		var l = (languageCode || (MAE.language || html.lang || 'en')).toLowerCase();
		return NDSLANGUAGES[l] || l;
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
		return '00:00:00:00:00:00';
	});
	getter(this, 'locale', function () {
		return this.languageCode + '-' + this.countryCode.toUpperCase();
	});
	getter(this, 'locked', function () {
		return LOCKED;
	});

	function hasPIN(type) {
		return true;/*
		switch (type) {
			case 'adult':
				type = User.ADULT_PIN;
				break;
			case 'youth':
				type = User.YOUTH_PIN;
				break;
			default:
				type = User.MASTER_PIN;
				break;
		}
		try {
			return UserData && UserData.isPINSet(type) || false;
		} catch(err) {
			return false;
		}*/
	}
	getter(this, 'hasPIN', function () {
		return hasPIN;
	});

	var resetLockedPIN = function () {
		LOCKED = false;
		ATTEMPTS = 0;
	};
	var challengePINCode = function (type, value) {
		try {
			return User && User.challengePINCode(type, value);
		} catch(err) {}
		return null;
	};
	var validatePIN = function (value, type) {
		if (!hasPIN(type)) {
			return true;
		}
		if (LOCKED) {
			return false;
		}
		var result;
		switch (type) {
			case 'adult':
				result = challengePINCode(User.ADULT_PIN, value);
				break;
			case 'youth':
				result = challengePINCode(User.YOUTH_PIN, value);
				break;
			default:
				result = challengePINCode(User.MASTER_PIN, value);
				break;
		}
		switch (result) {
			case User.PIN_SUCCESS:
				LOCKED = false;
				return true;
			case User.PIN_RETRY:
				ATTEMPTS++;
				if (ATTEMPTS === 3) {
					LOCKED = true;
					resetLockedPIN.delay(15 * 60 * 1000);
				}
				return false;
			case User.PIN_NOT_SET:
			case User.PIN_LOCKED:
				return false;
			default:
				return false;
		}
	};
	getter(this, 'validatePIN', function () {
		return validatePIN;
	});

	var passport = new GenericStorage('pp', true);
	getter(this, 'passport', function () {
		return passport;
	});
};
NDSProfile.prototype = new Profile();
NDSProfile.prototype.constructor = NDSProfile;

plugins.profile = NDSProfile;

var resetNDSPlayer = function () {
	var player = plugins.players[0];
	if (player) {
		player.src = '';
		if (player.muted) {
			player.muted = false;
		}
	}
};

var getUIWindow = function () {
	return apps[ui] && apps[ui].document.body;
};

if (Application) {
	Application.onShow = function () {
		isEnabled = true;
		syncProgramData();
		(function () {
			var UI = getUIWindow();
			if (UI) {
				//screen.log('ONSHOW');
				UI.visible = true;
				ApplicationManager.fire(active, 'onSelect', {
					id: apps[active].currentViewId
				});
			}
		}).delay(800);
	};
	Application.onHide = function () {
		var UI = getUIWindow();
		if (UI) {
			//screen.log('ONHIDE');
			UI.visible = false;
		}
		isEnabled = false;
		resetNDSPlayer();
		(function () {
			if (active && active !== ui) {
				ApplicationManager.close(active);
			}
		}).delay(1000);
	};
	syncProgramData();
}

window.addEventListener('unload', function () {
	resetNDSPlayer();
});

plugins.exit = function () {
	if (Application) {
		Application.pause();
	}
	var UI = getUIWindow();
	if (UI) {
		//screen.log('HIDE');
		UI.visible = false;
	}
	isEnabled = false;
};

// Test Notification
if (MAE.pait) {
	(function () {
		var id = 'com.metrological.widgets.tv.Youtube',
			icon = ApplicationManager.getAboutIcon(id);
		plugins.players[0].notify(icon, ['YouTube', 'Press OK'], 'c2a', id);
	}).delay(60000);
}
