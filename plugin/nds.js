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
	if (VideoPlayer) {
		VideoPlayer.onPlaybackStarted = function () {
			if (grabbed && instance.src && !canPlay) {
				canPlay = true;
				stateChange(Player.state.PLAY);
			}
		};
		VideoPlayer.onPlaybackEnd = function () {
			if (grabbed && canPlay && instance.src) {
				canPlay = false;
				stateChange(Player.state.EOF);
			}
		};
		VideoPlayer.onPlaybackUnexpectedStop = function () {
			if (grabbed && instance.src) {
				stateChange(Player.state.STOP);
				instance.src = '';
			}
		};
		VideoPlayer.onPlaybackError = function () {
			if (grabbed && instance.src) {
				stateChange(Player.state.ERROR);
			}
		};
	}
	if (TVContext) {
		TVContext.onContentSelectionSucceeded = function () {
			if (!grabbed) {
				channelChange();
			}
		};
	}

	var mimetypes = videoPlayer && videoPlayer.getSupportedMimeTypes() || [];
	function supports(mimetype) {
		var container = mimetype && mimetype.split(';')[0];
		for (var i = 0; i < mimetypes.length; i++) {
			if (mimetypes[i].indexOf(mimetype) > -1 || mimetypes[i].indexOf(container) > -1) {
				return true;
			}
		}
		return false;
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
		return currentSource;
	});
	setter(instance, 'src', function (src) {
		if (src && VideoPlayer) {
			stateChange(Player.state.BUFFERING);
			if (!grabbed) {
				try {
					VideoPlayer.grab();
					grabbed = true;
				} catch(err) {
					return;
				}
			}
			if (canPlay && currentSource && VideoPlayer.status !== VideoPlayer.PLAYER_STATUS_STOPPED) {
				try {
					VideoPlayer.stop();
				} catch(err) {}
			}
			canPlay = false;
			paused = false;
			try {
				previousState = null;
				currentSource = src;
				VideoPlayer.setURI(src);
				VideoPlayer.start.delay(800, VideoPlayer);
			} catch(err) {}
		} else if (VideoPlayer) {
			paused = false;
			if (canPlay && currentSource && VideoPlayer.status !== VideoPlayer.PLAYER_STATUS_STOPPED) {
				try {
					VideoPlayer.stop();
				} catch(err) {}
				canPlay = false;
				currentSource = null;
				stateChange(Player.state.STOP);
			} else {
				canPlay = false;
				currentSource = null;
			}
			previousState = null;
			if (grabbed) {
				try {
					VideoPlayer.ungrab();
				} catch(err) {}
				grabbed = false;
			}
		}
	});
	getter(instance, 'paused', function () {
		return paused;
	});
	setter(instance, 'paused', function (p) {
		if (canPlay && this.src) {
			if (!p) {
				if (this.paused) {
					try {
						VideoPlayer.resume();
						paused = false;
						stateChange(Player.state.PLAY);
					} catch(err) {
						canPlay = false;
						return;
					}
				}
			} else {
				try {
					VideoPlayer.pause();
					paused = true;
					stateChange(Player.state.PAUSE);
				} catch(err) {
					canPlay = false;
					return;
				}
			}
		}
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

var ndsplayer = new NDSPlayer();
plugins.players.push(ndsplayer);

function resetNDSPlayer() {
	if (ndsplayer.src) {
		ndsplayer.src = '';
	}
}

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
	Application.pause();
});
