//var version = '1.0.8s4c2r99';
var version = MAE.naf || '1.0.9s4c2r148';

NAF = {};
WebApp = {};

KeyMap.defineKeys(KeyMap.NORMAL, {
	19: 'pause', 413: 'stop', 415: 'play',
	417: 'forward', 412: 'rewind',
	3: 'back'
}, true);

include('naf-webapp/' + version + '/naf-webapp.min.js');

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
	var i = getApplicationIndex();

	log('naf: base init');

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
		switch (state) {
			case 'paused':
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
				}).delay(500);
				break;
		}
		currentState = state;
	});

	onFn('model.state.key', function () {
		var ev = model.state.key,
			keyCode = parseInt(ev.keyCode, 10),
			keyState = ev.keyState.toLowerCase(),
			keyEvent = document.createEvent('Events'),
			el = document.activeElement || window;
		if (keyState === 'repeat') {
			keyState = 'down';
		}
		keyEvent.initEvent('key' + keyState, true, true);
		keyEvent.keyCode = keyEvent.which = keyCode;
		keyEvent.key = KeyMap.lookupKey(KeyMap.NORMAL, keyCode);
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
			channel = model.channels && model.channels.filter(function (c) {
				return c.id === channelId;
			}) || [];
		if (channel.length > 0) {
			ApplicationManager.getApplicationsByChannelName(channel[0].name).forEach(function (id) {
				result.push({
					id: id,
					name: ApplicationManager.getMetadataByKey(id, 'name'),
					image: ApplicationManager.getIcon(id),
					url: ApplicationManager.getLaunchURL(id)
				});
			});
		}
		return [{
			id: ui,
			name: 'Apps',
			image: ApplicationManager.getIcon(ui),
			url: ApplicationManager.getMainURL()
		}].concat(result);
	}

	function onMessageCallback() {
		var msg = model.state.applications[i].appMsg,
			uiId = model.state.applications[0].id,
			message;
		if (msg.sourceId !== uiId) {
			return;
		}
		switch (msg.method) {
			case 'getApplications':
				message = getApplicationsByChannelId(msg.message);
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
		currentSource,
		forcePlay = false,
		isPlaying = false,
		initialized = false;

	instance.subscribers = {};

	getter(internal, 'player', function () {
		return initialized ? model.state.players[0] : {};
	});

	function stateChange(state) {
		fire.call(instance, 'onStateChange', {
			state: state
		});
	}

	onFn('model.initialized', function () {
		var i = getApplicationIndex();

		log('naf: video init');

		initialized = true;

		onFn('model.state.applications.' + i + '.media.assets.*', function () {
			if (currentSource && !forcePlay && !isPlaying) {
				forcePlay = true;
				stateChange(states.INFOLOADED);
			}
		});

		onFn('model.state.players.0.currentProgram', function () {
			if (!forcePlay) {
				fire.call(instance, 'onChannelChange');
			}
		});

		onFn('model.state.players.0.status', function () {
			if (!instance.src) {
				return;
			}
			var status = internal.player.status;
			if (status) {
				switch (status.code) {
					case 200: 
						stateChange(states.PLAY);
						forcePlay = false;
						break;
					case 201:
						//BEGINNING_OF_CONTENT
						stateChange(states.PLAY);
						forcePlay = false;
						break;
					case 202:
						stateChange(states.EOF);
						break;
					case 101:
						stateChange(states.BUFFERING);
						break;
					case 470:
					case 471:
						stateChange(states.ERROR);
						isPlaying = false;
						break;
					case 472:
						stateChange(states.STOP);
						isPlaying = false;
						break;
					default:
						break;
				}
			}
		});
	});

	function supports(mime) {
		return mime.indexOf('video/mp4') !== -1;
	}
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
					image: image
				}
			}]
		});
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
		return parseInt(internal.player.playRate, 10);
	});
	setter(instance, 'rate', function (rate) {
		if (this.rates.indexOf(rate) > -1) {
			doFn('model.state.players.0?playRate=' + rate + 'x');
		}
	});
	getter(instance, 'duration', function () {
		return parseInt(internal.player.duration, 10);
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
		var i = getApplicationIndex();
		if (!initialized) {
			return;
		} else if (src) {
			var asset = new model.MediaAsset('media.asset.video.0', '', src, null, 'video', null, null, '', null, null, null, null, null);
			if (currentSource) {
				//stateChange(states.STOP);
				currentSource = undefined;
				doFn('model.state.applications.' + i + '.media.assets.0', '');
			}
			isPlaying = false;
			forcePlay = false;
			currentSource = src;
			stateChange(states.BUFFERING);
			(function () {
				doFn('model.state.applications.' + i + '.media', asset);
			}).delay(500);
		} else if (currentSource && !src) {
			currentSource = undefined;
			doFn('model.state.players.0', 'model.state.players.0.currentChannel');
			doFn('model.state.applications.' + i + '.media.assets.0', '');
			stateChange(states.STOP);
		}
	});
	getter(instance, 'paused', function () {
		return internal.player.playRate === '0x';
	});
	setter(instance, 'paused', function (p) {
		if (currentSource) {
			if (forcePlay && !isPlaying) {
				var i = getApplicationIndex();
				isPlaying = true;
				stateChange(states.PLAY);
				doFn('model.state.players.0', 'model.state.applications.' + i + '.media.assets.0');
				return;
			}
			doFn('model.state.players.0?playRate=' + (p ? 0 : 1) + 'x');
			stateChange(p ? states.PAUSE : states.PLAY);
		}
	});
	getter(instance, 'bounds', function () {
		return currentBounds;
	});
	setter(instance, 'bounds', function (b) {
		if (b && b.length === 4) {
			doFn('model.state.players.0?window=' + r(b[0]) + ',' + r(b[1]) + ',' + r(b[2]) + ',' + r(b[3]));
			currentBounds = b;
		}
	});
	getter(instance, 'notify', function () {
		return notify;
	});
};
NAFPlayer.prototype = new Player();
NAFPlayer.prototype.constructor = NAFPlayer;

plugins.players.push(new NAFPlayer());

controller.init();
