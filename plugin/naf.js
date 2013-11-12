var version = '1.0.9s4c2r107';

NAF = {};
WebApp = {};

KeyMap.defineKeys(KeyMap.NORMAL, {
	3: 'back'
}, true);

include('naf-webapp/' + version + '/naf-webapp.min.js');

var model = new WebApp.Model(),
	controller = new WebApp.Controller(model);

controller.registerPMRPC();

controller.on('model.initialized', function () {
	var doFn = controller['do'],
		internalIndex = controller.getApplicationIndex;

	function getApplicationIndex() {
		return internalIndex ? internalIndex() : 1;
	}

	window.addEventListener('focus', function () {
		var i = getApplicationIndex();
		doFn('model.state.applications.' + i + '?state=running');
		if (active && apps[active]) {
			send(active, 'onSelect', {
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
			send(active, 'exit');
		}
	});

	controller.on('model.state.key', function () {
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
			channel = model.channels.filter(function (c) {
				return c.id === channelId;
			});
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

	controller.on('model.state.applications.' + getApplicationIndex() + '.appMsg', onMessageCallback);

	if (ApplicationManager.complete) {
		getMainMenuApplications();
	} else {
		ApplicationManager.onComplete = getMainMenuApplications;
	}
});

controller.init();
