//var version = '1.0.8s4c2r99';
var version = '1.0.9s4c2r122';

NAF = {};
WebApp = {};

KeyMap.defineKeys(KeyMap.NORMAL, {
	3: 'back'
}, true);

include('naf-webapp/' + version + '/naf-webapp.min.js');

var model = new WebApp.Model(),
	controller = new WebApp.Controller(model);

controller.registerPMRPC();

var doFn = controller['do'],
	onFn = controller.on;

onFn('model.initialized', function () {
	var internalIndex = controller.getApplicationIndex;

	log('naf: base init');

	function getApplicationIndex() {
		return internalIndex ? internalIndex() : 1;
	}

	window.addEventListener('focus', function () {
		var i = getApplicationIndex();
		doFn('model.state.applications.' + i + '?state=running');
		if (active && apps[active]) {
			ApplicationManager.fire(active, 'onSelect', {
				id: apps[active].currentViewId
			});
		}
	});

	window.addEventListener('blur', function () {
		var i = getApplicationIndex();
		doFn('model.state.applications.' + i + '.appMsg', {
			method: 'paused',
			message: {}
		});
		if (active && active !== ui) {
			ApplicationManager.close(active);
		}
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
		var i = getApplicationIndex();
			ids = apps.filter(function (id) {
				return meta[id].menu === true;
			});
		ids.forEach(function (id) {
			var name = ApplicationManager.getMetadataByKey(id, 'name'),
				image = ApplicationManager.getIcon(id),
				url = ApplicationManager.getLaunchURL(id);
			doFn('model.state.applications.' + (++i) +
				'?name=' + name +
				'&type=webapp' + 
				'&id=' + id + 
				'&windowId=' + window.name + 
				'&url=' + url + 
				'&state=loaded' +
				'&viewState=hidden' +
				'&pictures=[' + image + ']');
		});
		doFn('model.state.applications.' + getApplicationIndex() + '?state=loaded');
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
		var i = getApplicationIndex(),
			msg = model.state.applications[i].appMsg,
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

	onFn('model.state.applications.' + getApplicationIndex() + '.appMsg', onMessageCallback);

	if (ApplicationManager.complete) {
		getMainMenuApplications();
	} else {
		ApplicationManager.onComplete = getMainMenuApplications;
	}
});

var NAFPlayer = function () {
	var instance = this,
		internal = {},
		initialized = false;

	instance.subscribers = {};

	getter(internal, 'player', function () {
		return initialized ? model.state.players[0] : {};
	});

	onFn('model.initialized', function () {
		log('naf: video init');
		initialized = true;

		onFn('model.state.players.0.currentProgram', function () {
			fire.call(instance, 'onChannelChange');
		});
	});

	function supports(mime) {
		return mime.indexOf('video/mp4') !== -1;
	}
	function notify() {
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
		//@TODO
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
		//@TODO
		return 0;
	});
	setter(instance, 'currentTime', function (time) {
		//@TODO
	});
	getter(instance, 'rates', function () {
		return [1,2,6,12,30];
	});
	getter(instance, 'rate', function () {
		return 1;
	});
	setter(instance, 'rate', function (rate) {
		//@TODO
	});
	getter(instance, 'duration', function () {
		//@TODO
		return 0;
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
		//@TODO
		return null;
	});
	setter(instance, 'src', function (src) {
		//@TODO
	});
	getter(instance, 'paused', function () {
		return internal.player.playRate === '0x';
	});
	setter(instance, 'paused', function (p) {
		//@TODO
	});
	getter(instance, 'bounds', function () {
		//@TODO
		return Player.prototype.bounds;
	});
	setter(instance, 'bounds', function (b) {
		//@TODO
	});
	getter(instance, 'notify', function () {
		return notify;
	});
};
NAFPlayer.prototype = new Player();
NAFPlayer.prototype.constructor = NAFPlayer;

plugins.players.push(new NAFPlayer());

controller.init();
