var NDS = createPluginObject('my_user_api', 'my_user_api', 'application/x-jsuserapi-plugin'),
	Application = NDS.Application_getInstance && NDS.Application_getInstance(),
	VideoPlayer = NDS.Player_getInstance && NDS.Player_getInstance(),
	AudioPlayer = NDS.AudioOutput_getInstance && NDS.AudioOutput_getInstance(),
	TVContext   = NDS.ApplicationTvContext_getInstance && NDS.ApplicationTvContext_getInstance() || NDS.ApplicationTVContext_getInstance && NDS.ApplicationTVContext_getInstance(),
	User        = NDS.UserAuthentication_getInstance && NDS.UserAuthentication_getInstance(),
	Planner     = NDS.Planner_getInstance && NDS.Planner_getInstance();

KeyMap.defineKeys(KeyMap.NORMAL, {
	403: 'red', 404: 'green',
	405: 'yellow', 406: 'blue',
	413: 'stop', 415: 'playpause',
	417: 'forward', 412: 'rewind',
	462: 'menu', 461: 'back'
}, true);

var NDSPlayer = function () {
	var instance = this,
		defaultBounds = Player.prototype.bounds,
		canPlay = false,
		grabbed = false,
		paused = false,
		currentSource = null,
		previousState = null,
		startCounter = 0,
		startTimer;

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
	function start() {
		if (currentSource && !canPlay) {
			screen.log('START');
			VideoPlayer.start();
			if (startCounter < 5) {
				//VideoPlayer.setURI(currentSource);
				startTimer = setTimeout(start, (5 - startCounter) * 1000);
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
			screen.log('STARTED');
			startCounter = 0;
			clearTimeout(startTimer);
			startTimer = null;
		}
	}

	if (VideoPlayer) {
		VideoPlayer.onPlaybackStarted = function () {
			if (grabbed && currentSource && VideoPlayer) {
				canPlay = true;
				screen.log('INFOLOADED');
				stateChange(Player.state.INFOLOADED);
			}
		};
		VideoPlayer.onPlaybackEnd = function () {
			if (grabbed && currentSource) {
				screen.log('EOF');
				stateChange(Player.state.EOF);
			}
		};
		VideoPlayer.onPlaybackUnexpectedStop = function () {
			if (grabbed && currentSource && canPlay) {
				screen.log('STOPPED');
				stateChange(Player.state.STOP);
			}
		};
		VideoPlayer.onPlaybackError = function () {
			if (grabbed && currentSource) {
				screen.log('ERROR');
				stateChange(Player.state.ERROR);
			}
		};
	}
	if (TVContext) {
		TVContext.onContentSelectionSucceeded = function () {
			if (!grabbed) {
				screen.log('CHANNEL CHANGE');
				channelChange();
			}
		};
	}

	function supports(mimetype) {
		return true;
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
		var channel = TVContext && TVContext.getCurrentChannel() || {};
		return new TVChannel(channel.number, channel.name);
	});
	setter(instance, 'channel', function (number) {
		if (TVContext) {
			TVContext.selectContentByID('service:number:' + number);
		}
	});
	getter(instance, 'program', function () {
		var channel = TVContext && TVContext.getCurrentChannel() || {},
			program = channel && channel.getCurrentProgram() || {};
		return new TVProgram(program.title, program.description, program.startTime, program.duration);
	});
	getter(instance, 'startTime', function () {
		return 0;
	});
	setter(instance, 'startTime', function (time) {
	});
	getter(instance, 'currentTime', function () {
		try {
			return VideoPlayer && (VideoPlayer.position / 1000) || 0;
		} catch(err) {
			return 0;
		}
	});
	setter(instance, 'currentTime', function (time) {
		if (VideoPlayer) {
			try {
				VideoPlayer.seek(time * 1000);
			} catch(err) {}
		}
	});
	getter(instance, 'rate', function () {
		if (canPlay && VideoPlayer) {
			try {
				return VideoPlayer.speed || 0;
			} catch(err) {
				return 1;
			}
		} else {
			return 1;
		}
	});
	setter(instance, 'rate', function (rate) {/*
		if (VideoPlayer && canPlay && this.rate !== rate) {
			VideoPlayer.setSpeed(rate);
			if (rate < 0) {
				stateChange(Player.state.REWIND);
			} else if (rate === 1) {
				stateChange(Player.state.PLAY);
			} else if (rate > 0) {
				stateChange(Player.state.FORWARD);
			} else {
				stateChange(Player.state.PAUSE);
			}
		}*/
	});
	getter(instance, 'duration', function () {
		try {
			return VideoPlayer && VideoPlayer.getPlaybackDuration() || 0;
		} catch(err) {
			return 0;
		}
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
			screen.log('BUFFERING');
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
				screen.log('LOAD');
				VideoPlayer.setURI(src);
				currentSource = src;
				start.delay(800);
				//startTimer = setTimeout(start, 600);
			} catch(err) {
				screen.log('LOAD ERROR');
			}
		} else if (currentSource && VideoPlayer) {
			canPlay = false;
			currentSource = null;
			previousState = null;
			paused = false;
			if (startTimer) {
				clearTimeout(startTimer);
				startTimer = null;
			}
			if (VideoPlayer.status !== VideoPlayer.PLAYER_STATUS_STOPPED) {
				try {
					VideoPlayer.stop();
				} catch(err) {}
			}
			screen.log('STOP');
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
		screen.log(paused ? 'PAUSED' : 'RESUME');
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
	});
};

plugins.players.push(new NDSPlayer());

var resetNDSPlayer = function () {
	var player = plugins.players[0];
	if (player) {
		player.src = '';
	}
};

if (Application) {
	Application.onHide = function () {
		resetNDSPlayer();
	};
}

window.addEventListener('unload', function () {
	resetNDSPlayer();
});

window.addEventListener('blur', function () {
	resetNDSPlayer();
	if (Application) {
		Application.pause();
	}
});
