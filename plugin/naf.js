//var version = '1.0.8s4c2r99';
var version = MAE.naf || '1.0.9s4c2r148',
	enableDebug = MAE.screenDebug || false,
	delayedShow = MAE.delayedShow !== undefined ? delayedShow || 0 : 500;

plugins.delayStart = true;

NAF = {};
WebApp = {};

KeyMap.defineKeys(KeyMap.NORMAL, {
	19: 'pause', 413: 'stop', 415: 'playpause', 417: 'forward', 412: 'rewind',
	3: 'back', 127: 'delete', 567: 'enter',
	403: 'red', 404: 'green', 405: 'yellow', 406: 'blue',
	109: '-', 107: '+', 106: '*', 512: '$', 513: '%', 510: '@',
	44: ',', 518: '"', 517: ':', 47: '/', 92: '\\', 515: '&', 516: '_', 511: '#', 531: '€',
	503: '[', 504: ']', 505: '{', 506: '}', 514: '^', 522: '?', 529: 'ß', 192: '`', 46: '.',
	91: '(', 93: ')', 519: '~', 520: '<', 521: '>', 535: '£', 509: '!', 534: '§', 61: '=',
	538: 'ę', 540: 'ą', 539: 'ó', 541: 'ś', 542: 'ł', 543: 'ż', 544: 'ź', 545: 'ć', 546: 'ń'
}, true);

include('naf-webapp/' + version + '/naf-webapp.min.js');

var l = function (s) {
	log(s);
	if (enableDebug) {
		screen.log(s);
	}
};

var model = new WebApp.Model(),
	controller = new WebApp.Controller(model);

controller.registerPMRPC();

var doFn = controller['do'],
	onFn = controller.on,
	offFn = controller.off;

var getApplicationIndex = (function () {
	var internalIndex = controller.getApplicationIndex;
	return function () {
		return internalIndex ? internalIndex() : 1;
	};
}());

onFn('model.initialized', function () {
	var i = getApplicationIndex(),
		capsLock = false;

	plugins.delayStart = false;

	l('MAF <-> NAF INIT');

	try {
		l('SET MAF LANGUAGE FROM NAF: ' + JSON.stringify(model.state.settings.current.profile.view.lang));
		switch(model.state.settings.current.profile.view.lang.code) {
			case 'cze':
				MAE.language = 'cz';
				break
			case 'pol':
				MAE.language = 'pl';
				break
			case 'eng':
				MAE.language = 'en';
				break
			default:
				break;
		}
	} catch(err) {
		l('ERROR GETTING NAF LANGUAGE FROM NAF');
	}

	if (plugins.startup) plugins.startup();

	document.body.visible = false;

	plugins.exit = function () {
		doFn('model.state.applications.' + i + '.appMsg', {
			method: 'paused',
			message: {}
		});
	};

	var currentState;
	onFn('model.state.applications.' + i + '.state', function () {
		var state = model.state.applications[i].state;
		if (currentState === state) {
			return;
		}
		l('APPS STATE: ' + (state || '').toUpperCase());
		switch (state) {
			case 'paused':
				capsLock = false;
				document.body.visible = false;
				plugins.players[0].src = null;
				if (active && active !== ui) {
					ApplicationManager.close(active);
				}
				break;
			case 'running':
				(function () {
					document.body.visible = true;
					if (active && apps[active]) {
						ApplicationManager.fire(active, 'onSelect', {
							id: apps[active].currentViewId
						});
					}
				}).delay(delayedShow);
				break;
		}
		currentState = state;
	});

	onFn('model.state.key', function () {
		var ev = model.state.key,
			keyCode = parseInt(ev.keyCode, 10),
			keyState = ev.keyState.toLowerCase(),
			el = document.activeElement || window;
		if (keyCode === 20) {
			if (keyState === 'down') {
				if (capsLock) {
					keyState = 'up';
				}
				capsLock = !capsLock;
			} else {
				return;
			}
		}
		if (keyState === 'repeat') {
			keyState = 'down';
		}
		var keyEvent = document.createEvent('Events');
		keyEvent.initEvent('key' + keyState, true, true);
		keyEvent.keyCode = keyCode;
		keyEvent.which = keyCode;
		extendKeyboardEvent(keyEvent);
		l('NAF KEY' + keyState.toUpperCase() + ': ' + (keyCode || 0) + ', KEY: ' + (keyEvent.key || ''));
		//if (keyEvent.key === 'blue')
		//	location.reload();
		el.dispatchEvent(keyEvent);
	});

	function getMainMenuApplications(apps) {
		apps = apps || ApplicationManager.getApplications();
		var j = (i+1),
			ids = apps.filter(function (id) {
				return meta[id].menu === true;
			});
		ids.forEach(function (id) {
			var name = ApplicationManager.getMetadataByKey(id, 'name'),
				image = ApplicationManager.getIcon(id),
				url = ApplicationManager.getLaunchURL(id);
			doFn('model.state.applications.' + (j++) +
				'?name=' + name +
				'&type=webapp' + 
				'&id=' + id + 
				'&windowId=' + window.name + 
				'&url=' + url + 
				'&state=loaded' +
				'&viewState=hidden' +
				'&pictures=[' + image + ']');
		});
		doFn('model.state.applications.' + i + '?state=loaded');
	}

	function getApplicationsByChannelId(channelId) {
		var result = [],
			channel = model.channels && Array.from(model.channels).filter(function (c) {
				return c && c.id === channelId;
			}) || [];
		if (channel.length > 0 && channel[0] && channel[0].name) {
			(ApplicationManager.getApplicationsByChannelName(channel[0].name) || []).forEach(function (id) {
				if (id) {
					result.push({
						id: id,
						name: ApplicationManager.getMetadataByKey(id, 'name'),
						image: ApplicationManager.getIcon(id),
						url: ApplicationManager.getLaunchURL(id)
					});
				}
			});
		}
		return [{
			id: ui,
			name: MAE.language === 'pl' ? 'APLIKACJE' : 'APPS',
			image: ApplicationManager.getIcon(ui),
			url: ApplicationManager.getMainURL('channel')
		}].concat(result);
	}

	function onMessageCallback() {
		var msg = model.state.applications[i].appMsg,
			uiId = model.state.applications[0].id,
			message;
		if (!msg || msg.sourceId !== uiId) {
			return;
		}
		switch (msg.method) {
			case 'getApplications':
				try {
					message = getApplicationsByChannelId(msg.message);
				} catch(err) {
					message = [];
				}
				break;
		}
		if (message) {
			doFn('model.state.applications.0.appMsg', {
				method: msg.method,
				message: message
			});
		}
	}

	onFn('model.state.applications.' + i + '.appMsg', onMessageCallback);

	if (ApplicationManager.complete) {
		getMainMenuApplications();
	} else {
		ApplicationManager.onComplete = getMainMenuApplications;
	}
});

var NAFPlayer = function () {
	var instance = this,
		internal = {},
		scale = 720 / 1080,
		states = Player.state,
		currentBounds = Player.prototype.bounds,
		previousState,
		playbackTimer,
		currentSource,
		appIdx,
		playRate,
		readyForPlay = false,
		initialized = false;

	instance.subscribers = {};

	getter(internal, 'player', function () {
		return initialized ? model.state.players[0] : {};
	});

	function stateChange(state) {
		fire.call(instance, 'onStateChange', {
			state: state
		});
		previousState = state;
	}

	onFn('model.initialized', function () {
		if (!appIdx)
			appIdx = getApplicationIndex();

		log('naf: video init');

		initialized = true;

		// workaround because buffering ended is not available
		onFn('model.state.applications.' + appIdx + '.media.assets.*', function () {
			if (model.state.applications[appIdx].media.assets.length > 0 && !readyForPlay) {
				readyForPlay = true;
				l('MAF SET MEDIA ASSET TO PLAYER');
				doFn('model.state.players.0', 'model.state.applications.' + appIdx + '.media.assets.0');
				l('MAF EVENT: SEND BUFFERING');
				stateChange(states.BUFFERING);
			}
		});

		onFn('model.state.players.0.currentChannel', function () {
			l('MAF EVENT: CHANNELCHANGE');
			if (model.state.applications[appIdx].media.assets.length === 0 && !instance.src) {
				fire.call(instance, 'onChannelChange');
			}
		});

		onFn('model.state.players.0.currentProgram', function () {
			l('MAF EVENT: CHANNELCHANGE');
			if (model.state.applications[appIdx].media.assets.length === 0 && !instance.src) {
				fire.call(instance, 'onChannelChange');
			}
		});

		onFn('model.state.players.0.status', function () {
			var status = internal.player.status;
			// ignore if souce is empty or asset is not yet loaded
			if (!instance.src || !status || model.state.applications[appIdx].media.assets.length === 0) {
				log('MAF INGNORED NAF PLAYER STATUS CODE: ' + (status && status.code || 'UNDEFINED'));
				return;
			}
			if (status) {
				var code = parseInt(status.code, 10);
				l('MAF RECEIVED: NAF STATUS CODE: ' + code);
				if (previousState === states.ERROR) return;
				switch (code) {
					case 200: 
						//PRESENTATION_STARTED
						// workaround for no status code
						if (playbackTimer) {
							clearTimeout(playbackTimer);
							playbackTimer = undefined;
						}
						// workaround for no buffering end
						if (previousState !== states.BUFFERING) {
							l('MAF EVENT: SEND PLAY');
							stateChange(states.PLAY);
						} else {
							l('MAF EVENT: SEND INFOLOADED');
							stateChange(states.INFOLOADED);
						}
						break;
					case 201:
						//BEGINNING_OF_CONTENT
						// workaround for no status code
						if (playbackTimer) {
							clearTimeout(playbackTimer);
							playbackTimer = undefined;
						}
						l('MAF EVENT: SEND PLAY');
						stateChange(states.PLAY);
						break;
					case 202:
						//END_OF_CONTENT
						var timeLeft = instance.duration - instance.currentTime;
						if (!isNaN(timeLeft) && timeLeft < 10) {
							l('MAF EVENT: SEND EOF (' + timeLeft + ')');
							stateChange(states.EOF);
						} else {
							l('MAF EVENT: SEND ERROR (' + timeLeft + ')');
							stateChange(states.ERROR);
						}
						break;
					case 204:
						l('MAF EVENT: SEND INFOLOADED');
						stateChange(states.INFOLOADED);
						break;
					case 101:
						//BUFFERING_CONTENT
						l('MAF EVENT: SEND BUFFERING');
						stateChange(states.BUFFERING);
						break;
					case 400:
						//GENERAL_ERROR
					case 470:
						//OTT_PLAYBACK_ERROR
					case 471:
						//OTT_UNKNOWN_ERROR
					case 472:
						//OTT_CANCELLED
					case 473:
						//OTT_FORBIDDEN
						// workaround for no status code
						if (playbackTimer) {
							clearTimeout(playbackTimer);
							playbackTimer = undefined;
						}
						// workaround for 472 and 470 error and receiving a 2xx code within a few seconds
						(function () {
							if ((code !== 472 && code !== 470) || previousState === states.BUFFERING) {
								l('MAF EVENT: SEND ERROR');
								stateChange(states.ERROR);
							}
						}).delay(code === 472 || code === 470 ? 2000 : 50);
						break;
					default:
						log('MAF EVENT: IGNORED STATUS CODE: ' + code);
						break;
				}
			}
		});
	});

	function supports(mime) {
		return mime.indexOf('video/mp4') !== -1;
	}

	var httpRegExp = new RegExp('^(https?:)?//');
	function notify(icon, message, type, identifier) {
		var t;
		switch(type) {
			case 'c2a':
				t = 'call2action';
				break;
			case 'alert':
				t = 'notification';
				break;
			case 'autostart':
				t = 'autostart';
				break;
			default:
				return;
		}
		message = [].concat(message).join(' ');
		if (icon && !httpRegExp.test(icon))
			icon = ApplicationManager.getRootPath(identifier) + icon;

		var image = identifier && ApplicationManager.getIcon(identifier),
			url = identifier && ApplicationManager.getLaunchURL(identifier);

		doFn('model.state.applications.0.appMsg', {
			method: 'announceNotifications',
			message: [{
				id: identifier,
				image: image,
				url: url,
				event: {
					type: t,
					time: Date.now(),
					timeout: 30,
					message: message || '',
					image: icon || image
				}
			}]
		});
	}

	function r(c) {
		return Math.floor(c * scale);
	}

	function playbackCheckTimer() {
		l('MAF NO REPSONSE FROM PLAYER SEND ERROR');
		stateChange(states.ERROR);
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
		var channel = internal.player.currentChannel || {};
		return new TVChannel(channel.lcn, channel.name);
	});
	setter(instance, 'channel', function (number) {
		var channels = model.channels || [];
		channels.forEach(function (channel, i) {
			if (channel.lcn === number) {
				doFn('model.state.players.0', 'model.channels.' + i);
				return;
			}
		});
	});
	getter(instance, 'program', function () {
		var program = internal.player.currentProgram || {};
		return new TVProgram(program.title, program.description, program.startTime, program.duration);
	});
	getter(instance, 'startTime', function () {
		return 0;
	});
	setter(instance, 'startTime', function (time) {
		//@TODO
	});
	getter(instance, 'currentTime', function () {
		return parseFloat(internal.player.position);
	});
	setter(instance, 'currentTime', function (time) {
		if (this.src) {
			doFn('model.state.players.0?position=' + time + 's');
		}
	});
	getter(instance, 'rates', function () {
		return [1,2,6,12,30];
	});
	getter(instance, 'rate', function () {
		return parseInt(internal.player.playRate || 0, 10);
	});
	setter(instance, 'rate', function (rate) {
		if (this.src && !playbackTimer && playRate !== rate) {
			playRate = rate;
			l('MAF CHANGE PLAY RATE: ' + rate);
			doFn('model.state.players.0?playRate=' + rate + 'x');
			if (rate > 1) {
				l('MAF EVENT: SEND FORWARD');
				stateChange(states.FORWARD);
			} else if (rate < 0) {
				l('MAF EVENT: SEND REWIND');
				stateChange(states.REWIND);
			} else {
				l('MAF EVENT: SEND ' + (rate === 0 ? 'PAUSE' : 'PLAY'));
				stateChange(rate === 0 ? states.PAUSE : states.PLAY);
			}
		}
	});
	getter(instance, 'duration', function () {
		return parseInt(internal.player.duration || 0, 10);
	});
	getter(instance, 'buffered', function () {
		//@TODO
		return 100;
	});
	getter(instance, 'muted', function () {
		//@TODO
		return false;
	});
	setter(instance, 'muted', function (mute) {
		//@TODO
	});
	getter(instance, 'volume', function () {
		//@TODO
		return 1;
	});
	setter(instance, 'volume', function (volume) {
		//@TODO
	});
	getter(instance, 'src', function () {
		return currentSource;
	});
	setter(instance, 'src', function (src) {
		if (!initialized) {
			return;
		}
		if (playbackTimer) {
			clearTimeout(playbackTimer);
			playbackTimer = undefined;
		}
		previousState = undefined;
		if (src) {
			if (currentSource) {
				//stateChange(states.STOP);
				playRate = undefined;
				currentSource = undefined;
				readyForPlay = false;
				l('MAF CLEAR MEDIA ASSET');
				doFn('model.state.applications.' + appIdx + '.media.assets', '');
			}
			var asset = new model.MediaAsset('media.asset.video.0', '', src, null, 'video', null, null, '', null, null, null, null, null);
			currentSource = src;
			l('MAF EVENT: SEND INIT');
			stateChange(states.INIT);
			(function () {
				l('MAF SET MEDIA ASSET');
				playbackTimer = playbackCheckTimer.delay(30000);
				doFn('model.state.applications.' + appIdx + '.media', asset);
			}).delay(500);
		} else if (currentSource) {
			playRate = undefined;
			currentSource = undefined;
			readyForPlay = false;
			l('MAF CLEAR MEDIA ASSET');
			doFn('model.state.applications.' + appIdx + '.media.assets', '');
			l('MAF RESTORE CHANNEL');
			doFn('model.state.players.0', 'model.state.players.0.currentChannel');
			l('MAF EVENT: SEND STOP');
			stateChange(states.STOP);
		}
	});
	getter(instance, 'paused', function () {
		return parseInt(internal.player.playRate || 0, 10) === 0;
	});
	setter(instance, 'paused', function (p) {
		if (this.src) {
			// workaround for autoplay
			if (readyForPlay) {
				readyForPlay = false;
			} else {
				l('MAF PLAYER: ' + (p ? 'PAUSE' : 'PLAY'));
				this.rate = (p ? 0 : 1);
			}
		}
	});
	getter(instance, 'bounds', function () {
		return currentBounds;
	});
	setter(instance, 'bounds', function (b) {
		if (b && b.length === 4) {
			l('NAF PLAYER WINDOW: ' + r(b[0]) + ',' + r(b[1]) + ',' + r(b[2]) + ',' + r(b[3]));
			doFn('model.state.players.0?window=' + r(b[0]) + ',' + r(b[1]) + ',' + r(b[2]) + ',' + r(b[3]));
			currentBounds = b;
		}
	});
	getter(instance, 'notify', function () {
		return notify;
	});

	fire.call(instance, 'onChannelChange');
};
NAFPlayer.prototype = new Player();
NAFPlayer.prototype.constructor = NAFPlayer;

plugins.players.push(new NAFPlayer());

controller.init();
